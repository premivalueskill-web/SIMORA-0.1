# SIMORA Central Admin Portal (Standalone Application)

This is the dedicated, standalone **SIMORA Admin Portal** decoupled from the customer and shopkeeper mobile/web apps. It connects securely to the shared SIMORA quick-commerce backend via Role-Based Access Control (RBAC).

---

## 🔒 Security & Role-Based Access Control (RBAC)

1. **Backend Separation**:
   - The customer and shopkeeper application strictly contains **Customer** and **Shopkeeper** modules.
   - All admin endpoints (`/api/admin/*`) enforce strict RBAC checks on the backend.
   - Any unauthenticated request or request with customer/shopkeeper privileges returns `HTTP 403 Forbidden` (`ADMIN_ROLE_REQUIRED`).

2. **Admin Authentication**:
   - Admin credentials are authenticated via `POST /api/auth/admin-login`.
   - On successful authentication, a cryptographically signed RBAC bearer token is issued.
   - All administrative requests pass `Authorization: Bearer <token>` in the request headers.

---

## 🚀 Running the Admin Portal

To launch this standalone admin project locally:

```bash
cd simora-admin-portal
npm install
npm run dev
```

The admin portal runs on **`http://localhost:3001`** and proxies all `/api` requests to the SIMORA backend running on port `3000`.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔑 Default Administrator Credentials

- **Admin Email**: `admin@simora.in`
- **Access Password**: `simora@admin2026`
- **Master Admin Secret**: Configurable via `SIMORA_ADMIN_SECRET` environment variable.

---

## 📊 Features & Controls

1. **Platform GMV & Live Metrics**: Real-time gross merchandise value, active orders, and average fulfillment delivery SLA (9-12 minutes).
2. **Dark Store Governance**: Provision new regional dark stores, update hub manager contacts, and audit store order volumes.
3. **Delivery Fleet Status**: Monitor active delivery partners across urban clusters.
4. **RBAC Token Audit**: Live monitor of backend security rules and permission scopes.
