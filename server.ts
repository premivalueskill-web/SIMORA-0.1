import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { handleSmartListRequest } from './src/server/smartListHandler.ts';
import { sendOtp, verifyOtp, validateSession, activeUserSessions } from './src/server/otpService.ts';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(express.json());

// ==========================================
// Role-Based Access Control (RBAC) System
// ==========================================
const ADMIN_MASTER_SECRET = process.env.SIMORA_ADMIN_SECRET || 'simora_admin_secret_token_2026';
const ACTIVE_ADMIN_TOKENS = new Set<string>(['simora_admin_secret_token_2026']);

// In-memory data store for backend operations
const platformStores = [
  {
    id: 'store-104',
    name: 'SIMORA Dark Store #104 - Koramangala Hub',
    code: 'BLR-KRM-104',
    city: 'Bengaluru',
    pincode: '560034',
    status: 'active',
    manager: 'Ramesh Patel',
    phone: '+91 98450 11223',
    ordersToday: 42,
    revenueToday: 18450
  },
  {
    id: 'store-108',
    name: 'SIMORA Dark Store #108 - Indiranagar Hub',
    code: 'BLR-IDN-108',
    city: 'Bengaluru',
    pincode: '560038',
    status: 'active',
    manager: 'Sunita Rao',
    phone: '+91 98220 33445',
    ordersToday: 58,
    revenueToday: 24900
  },
  {
    id: 'store-112',
    name: 'SIMORA Dark Store #112 - HSR Layout Hub',
    code: 'BLR-HSR-112',
    city: 'Bengaluru',
    pincode: '560102',
    status: 'active',
    manager: 'Kiran Desai',
    phone: '+91 98110 55667',
    ordersToday: 36,
    revenueToday: 15300
  }
];

// RBAC Middleware: Strict enforcement that blocks customer/shopkeeper access
const requireAdminRole = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  const adminKeyHeader = req.headers['x-admin-key'] as string;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  const isAuthorized = 
    (token && (token === ADMIN_MASTER_SECRET || ACTIVE_ADMIN_TOKENS.has(token))) ||
    (adminKeyHeader && adminKeyHeader === ADMIN_MASTER_SECRET);

  if (!isAuthorized) {
    return res.status(403).json({
      error: 'Forbidden: Insufficient privileges',
      code: 'ADMIN_ROLE_REQUIRED',
      message: 'Admin operations are strictly restricted to the standalone SIMORA Admin Portal with authorized credentials. Customers and shopkeepers do not possess admin permissions.'
    });
  }

  next();
};

// Admin Authentication Endpoint (Used exclusively by standalone Admin Portal)
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@simora.in' && (password === 'simora@admin2026' || password === 'admin123')) {
    const sessionToken = 'admin_sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    ACTIVE_ADMIN_TOKENS.add(sessionToken);
    return res.json({
      success: true,
      token: sessionToken,
      role: 'admin',
      adminUser: {
        id: 'adm-01',
        name: 'SIMORA Central Operations',
        email: 'admin@simora.in',
        role: 'SUPER_ADMIN',
        permissions: ['ALL_STORES', 'DISPATCH_AUDIT', 'FINANCIAL_REPORTS', 'FLEET_MGMT']
      }
    });
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
});

// Admin-only: Global Platform Metrics
app.get('/api/admin/metrics', requireAdminRole, (_req, res) => {
  const totalStores = platformStores.length;
  const totalRevenue = platformStores.reduce((acc, s) => acc + s.revenueToday, 0);
  const totalOrders = platformStores.reduce((acc, s) => acc + s.ordersToday, 0);

  return res.json({
    success: true,
    data: {
      totalStores,
      totalOrdersToday: totalOrders,
      grossRevenueToday: totalRevenue,
      activeFleetOnline: 24,
      avgDeliveryMins: 9.4,
      orderSuccessRate: '99.2%',
      systemStatus: 'OPERATIONAL_EXCELLENT'
    }
  });
});

// Admin-only: Manage Dark Stores
app.get('/api/admin/stores', requireAdminRole, (_req, res) => {
  return res.json({
    success: true,
    stores: platformStores
  });
});

app.post('/api/admin/stores', requireAdminRole, (req, res) => {
  const { name, city, pincode, manager, phone } = req.body;
  if (!name || !city || !pincode) {
    return res.status(400).json({ error: 'Missing required store details' });
  }

  const newStore = {
    id: 'store-' + (100 + platformStores.length + 1),
    name,
    code: `${city.substring(0, 3).toUpperCase()}-NEW-${Math.floor(100 + Math.random() * 900)}`,
    city,
    pincode,
    status: 'active',
    manager: manager || 'Store Incharge',
    phone: phone || '+91 98000 00000',
    ordersToday: 0,
    revenueToday: 0
  };

  platformStores.push(newStore);
  return res.status(201).json({ success: true, store: newStore });
});

// Public / Customer / Shopkeeper Store Info
app.get('/api/store/info', (_req, res) => {
  return res.json({
    success: true,
    activeStore: platformStores[0]
  });
});

// ==========================================
// User Mobile OTP Authentication Endpoints
// ==========================================

// 1. Dispatch OTP to user mobile
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phone, role = 'customer' } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }
    if (!['customer', 'rider', 'shopkeeper'].includes(role)) {
      return res.status(400).json({ error: 'Invalid app role specified' });
    }

    const result = await sendOtp(phone, role);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/auth/send-otp:', err);
    return res.status(500).json({ error: 'Failed to dispatch OTP. Please try again.' });
  }
});

// 2. Verify OTP & generate verified session token
app.post('/api/auth/verify-otp', (req, res) => {
  try {
    const { phone, otp, role = 'customer', name, storeName } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Mobile number and OTP code are required' });
    }

    const result = verifyOtp(phone, otp, role, name, storeName);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /api/auth/verify-otp:', err);
    return res.status(500).json({ error: 'OTP verification failed' });
  }
});

// 3. Validate existing user session
app.get('/api/auth/session', (req, res) => {
  const authHeader = req.headers.authorization;
  const session = validateSession(authHeader);
  if (!session) {
    return res.status(401).json({ authenticated: false, error: 'Session expired or invalid' });
  }
  return res.json({ authenticated: true, session });
});

// 4. Logout user session
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    activeUserSessions.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// Middleware for customer/rider/shopkeeper role enforcement
export const requireRole = (allowedRoles: ('customer' | 'rider' | 'shopkeeper')[]) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization;
    const session = validateSession(authHeader);
    if (!session || !allowedRoles.includes(session.role)) {
      return res.status(403).json({
        error: 'Forbidden: Insufficient privileges for this role',
        code: 'ROLE_FORBIDDEN',
        requiredRoles: allowedRoles
      });
    }
    (req as any).userSession = session;
    next();
  };
};

// AI Smart Shopping List Generator Endpoint (Customer)
app.post('/api/ai/smart-list', async (req, res) => {
  try {
    const { orders = [], availableProducts = [], promptTone = 'weekly_routine' } = req.body;
    const result = await handleSmartListRequest(orders, availableProducts, promptTone);
    return res.json(result);
  } catch (err) {
    console.error('Error in /api/ai/smart-list:', err);
    return res.status(500).json({ error: 'Failed to generate smart list' });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  // Explicit route for manifest.webmanifest and manifest.json to guarantee application/manifest+json MIME type
  app.get(['/manifest.webmanifest', '/manifest.json'], (_req, res) => {
    const manifestPath = path.resolve(__dirname, 'public/manifest.webmanifest');
    res.setHeader('Content-Type', 'application/manifest+json');
    res.sendFile(manifestPath);
  });

  // Explicit route for sw.js to guarantee application/javascript and Service-Worker-Allowed scope
  app.get('/sw.js', (_req, res) => {
    const swPath = path.resolve(__dirname, 'public/sw.js');
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Service-Worker-Allowed', '/');
    res.sendFile(swPath);
  });

  // Endpoint to download the complete Native Kotlin & Jetpack Compose Android Studio Project
  app.get('/api/download/simora-android-project.zip', (_req, res) => {
    const zipPath = path.resolve(__dirname, 'public/simora-android-project.zip');
    res.download(zipPath, 'SIMORA-Native-Android-Compose-Project.zip');
  });

  // Serve all static assets from public/
  app.use(express.static(path.join(__dirname, 'public')));

  if (!isProd) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Serve transformed index.html for SPA client navigation
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`SIMORA server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

