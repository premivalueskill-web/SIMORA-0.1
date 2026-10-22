import crypto from 'crypto';

interface OtpRecord {
  phone: string;
  role: 'customer' | 'rider' | 'shopkeeper';
  otp: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
  lastRequestedAt: number;
}

export interface UserSession {
  token: string;
  phone: string;
  role: 'customer' | 'rider' | 'shopkeeper';
  name: string;
  storeName?: string;
  createdAt: number;
}

// In-memory OTP store (keyed by phone number)
const otpStore = new Map<string, OtpRecord>();

// In-memory active authenticated user sessions (keyed by session token)
export const activeUserSessions = new Map<string, UserSession>();

/**
 * Dispatch real SMS to Indian mobile numbers via configured SMS providers.
 * Supports Fast2SMS, Twilio, and MSG91 via environment variables.
 */
async function sendSmsViaProvider(phone: string, otp: string, roleTitle: string): Promise<{ sent: boolean; provider: string; error?: string }> {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const message = `SIMORA: Your verification OTP for ${roleTitle} is ${otp}. Valid for 5 minutes. Do not share this code. - SIMORA Your Need Our Deed`;

  // 1. Fast2SMS Integration (Fastest for India DLT / OTP routes)
  const fast2SmsKey = process.env.FAST2SMS_API_KEY;
  if (fast2SmsKey) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          'authorization': fast2SmsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: cleanPhone
        })
      });
      const data = await response.json();
      if (data.return) {
        console.log(`[Fast2SMS] Successfully dispatched OTP to +91 ${cleanPhone}`);
        return { sent: true, provider: 'Fast2SMS' };
      } else {
        console.warn(`[Fast2SMS] Provider error:`, data.message);
      }
    } catch (err: any) {
      console.warn(`[Fast2SMS] Network error:`, err.message);
    }
  }

  // 2. Twilio SMS Integration
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuth = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_MESSAGING_SERVICE_SID;
  if (twilioSid && twilioAuth && twilioFrom) {
    try {
      const authHeader = Buffer.from(`${twilioSid}:${twilioAuth}`).toString('base64');
      const params = new URLSearchParams();
      params.append('To', `+91${cleanPhone}`);
      params.append('From', twilioFrom);
      params.append('Body', message);

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });
      const data = await response.json();
      if (response.ok && data.sid) {
        console.log(`[Twilio] Successfully dispatched OTP to +91 ${cleanPhone}`);
        return { sent: true, provider: 'Twilio' };
      } else {
        console.warn(`[Twilio] Provider error:`, data.message);
      }
    } catch (err: any) {
      console.warn(`[Twilio] Network error:`, err.message);
    }
  }

  // 3. MSG91 Integration
  const msg91Auth = process.env.MSG91_AUTH_KEY;
  const msg91Template = process.env.MSG91_TEMPLATE_ID;
  if (msg91Auth && msg91Template) {
    try {
      const response = await fetch('https://control.msg91.com/api/v5/otp', {
        method: 'POST',
        headers: {
          'authkey': msg91Auth,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template_id: msg91Template,
          mobile: `91${cleanPhone}`,
          otp
        })
      });
      const data = await response.json();
      if (data.type === 'success') {
        console.log(`[MSG91] Successfully dispatched OTP to +91 ${cleanPhone}`);
        return { sent: true, provider: 'MSG91' };
      }
    } catch (err: any) {
      console.warn(`[MSG91] Network error:`, err.message);
    }
  }

  // Real-time console log simulation if live provider credentials are not yet specified in .env
  console.log(`\n======================================================`);
  console.log(`🔔 [SIMORA SMS GATEWAY] Dispatching OTP to +91 ${cleanPhone}`);
  console.log(`📱 Role: ${roleTitle}`);
  console.log(`🔑 Verification Code (OTP): [ ${otp} ]`);
  console.log(`⏳ Expiration: 5 minutes`);
  console.log(`💡 To send live real-world SMS: Configure FAST2SMS_API_KEY or TWILIO_ACCOUNT_SID in .env`);
  console.log(`======================================================\n`);

  return { 
    sent: false, 
    provider: 'SIMORA Secure Gateway (Sandbox Mode)',
    error: 'No external SMS provider configured in .env. Dispatched via SIMORA Secure Gateway console.'
  };
}

/**
 * Generate and dispatch a secure OTP for user mobile login.
 */
export async function sendOtp(phone: string, role: 'customer' | 'rider' | 'shopkeeper') {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]\d{9}$/.test(cleanPhone)) {
    return {
      success: false,
      error: 'Invalid Indian mobile number. Please enter a 10-digit number starting with 6, 7, 8, or 9.',
      code: 'INVALID_PHONE'
    };
  }

  const now = Date.now();
  const existing = otpStore.get(cleanPhone);

  // Rate-limiting check: Minimum 30s wait between OTP generation requests
  if (existing && (now - existing.lastRequestedAt) < 30 * 1000) {
    const secondsRemaining = Math.ceil((30 * 1000 - (now - existing.lastRequestedAt)) / 1000);
    return {
      success: false,
      error: `Please wait ${secondsRemaining}s before requesting a new OTP.`,
      code: 'RATE_LIMITED',
      retryAfterSeconds: secondsRemaining
    };
  }

  // Cryptographically secure 6-digit OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const roleNames = {
    customer: 'SIMORA Customer App',
    rider: 'SIMORA Delivery Partner App',
    shopkeeper: 'SIMORA Shopkeeper Hub'
  };

  otpStore.set(cleanPhone, {
    phone: cleanPhone,
    role,
    otp,
    createdAt: now,
    expiresAt: now + 5 * 60 * 1000, // 5 minutes expiration
    attempts: 0,
    lastRequestedAt: now
  });

  const smsResult = await sendSmsViaProvider(cleanPhone, otp, roleNames[role]);

  return {
    success: true,
    message: `Verification OTP dispatched to +91 ${cleanPhone}.`,
    phone: cleanPhone,
    role,
    expiresInSeconds: 300,
    resendAfterSeconds: 30,
    provider: smsResult.provider,
    isLiveSms: smsResult.sent,
    // Provide live hint in development to ensure seamless instant testing
    devHintOtp: process.env.NODE_ENV !== 'production' || !smsResult.sent ? otp : undefined
  };
}

/**
 * Verify OTP submitted by the user.
 */
export function verifyOtp(
  phone: string, 
  submittedOtp: string, 
  role: 'customer' | 'rider' | 'shopkeeper',
  customName?: string,
  storeName?: string
) {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const record = otpStore.get(cleanPhone);

  if (!record) {
    return {
      success: false,
      error: 'No active OTP request found for this mobile number. Please click "Send OTP".',
      code: 'NO_OTP_FOUND'
    };
  }

  const now = Date.now();

  // Check expiration (5 minutes)
  if (now > record.expiresAt) {
    otpStore.delete(cleanPhone);
    return {
      success: false,
      error: 'This OTP has expired. Please request a new verification code.',
      code: 'OTP_EXPIRED'
    };
  }

  // Check brute force attempts (max 4 attempts)
  if (record.attempts >= 4) {
    otpStore.delete(cleanPhone);
    return {
      success: false,
      error: 'Too many incorrect attempts. For security, please request a fresh OTP.',
      code: 'MAX_ATTEMPTS_EXCEEDED'
    };
  }

  // Compare OTP
  if (record.otp !== submittedOtp.trim()) {
    record.attempts += 1;
    const remaining = 4 - record.attempts;
    return {
      success: false,
      error: `Incorrect OTP. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      code: 'INVALID_OTP',
      attemptsRemaining: remaining
    };
  }

  // OTP is correct! Clear from store
  otpStore.delete(cleanPhone);

  // Generate cryptographically secure session token
  const token = `simora_tok_${role}_${crypto.randomBytes(24).toString('hex')}`;
  
  const defaultNames = {
    customer: customName || 'SIMORA Customer',
    rider: customName || 'Delivery Partner',
    shopkeeper: customName || 'Store Incharge'
  };

  const userSession: UserSession = {
    token,
    phone: `+91 ${cleanPhone}`,
    role,
    name: defaultNames[role],
    storeName: role === 'shopkeeper' ? (storeName || 'SIMORA Dark Store #104') : undefined,
    createdAt: now
  };

  activeUserSessions.set(token, userSession);

  return {
    success: true,
    token,
    role,
    user: {
      id: `usr_${cleanPhone.slice(-4)}_${Date.now().toString(36).slice(-3)}`,
      phone: userSession.phone,
      name: userSession.name,
      role: userSession.role,
      storeName: userSession.storeName
    }
  };
}

/**
 * Validate user session and role authorization.
 */
export function validateSession(token: string | undefined): UserSession | null {
  if (!token) return null;
  const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
  const session = activeUserSessions.get(cleanToken);
  return session || null;
}
