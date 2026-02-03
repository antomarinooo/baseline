import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

// Helper function to decode JWT and extract user ID
function extractUserIdFromJWT(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    return payload.sub || null;
  } catch (err) {
    console.log(`JWT decode error: ${err}`);
    return null;
  }
}

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization", "x-user-token"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Valid license keys for Full Access
const VALID_LICENSE_KEYS = [
  "BASELINE-FULL-2024",
  "BASELINE-PRO-2024",
  "BASELINE-UNLIMITED"
];

// Store for email verification codes (in production, use Redis or similar)
const verificationCodes = new Map<string, { code: string, expires: number, email: string }>();

// Device fingerprint tracking to prevent abuse
const deviceUsage = new Map<string, { calculations: number, accounts: Set<string> }>();

// Helper to generate 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Health check endpoint
app.get("/make-server-a15ad91a/health", (c) => {
  return c.json({ status: "ok" });
});

// Test auth endpoint
app.get("/make-server-a15ad91a/test-auth", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    console.log('Test auth - Token received:', { 
      hasToken: !!accessToken, 
      tokenLength: accessToken?.length,
      tokenPrefix: accessToken?.substring(0, 20)
    });
    
    console.log('Test auth - Environment check:', {
      hasSupabaseUrl: !!Deno.env.get('SUPABASE_URL'),
      hasServiceRoleKey: !!Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      supabaseUrlPrefix: Deno.env.get('SUPABASE_URL')?.substring(0, 30)
    });
    
    if (!accessToken) {
      return c.json({ error: "No token provided" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    console.log('Test auth - getUser result:', { 
      hasUser: !!user, 
      userId: user?.id,
      userEmail: user?.email,
      errorMessage: error?.message,
      errorStatus: error?.status
    });

    if (error || !user) {
      return c.json({ 
        error: "Auth failed",
        details: error?.message,
        hasUser: !!user
      }, 401);
    }

    return c.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (err) {
    console.log(`Test auth error: ${err}`);
    return c.json({ error: String(err) }, 500);
  }
});

// Signup endpoint
app.post("/make-server-a15ad91a/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, name, licenseKey } = body;

    console.log('Signup request received:', { 
      email, 
      name, 
      hasLicenseKey: !!licenseKey,
      licenseKey: licenseKey ? licenseKey.substring(0, 10) + '...' : null 
    });

    if (!email || !password || !name) {
      console.log('Missing required fields:', { hasEmail: !!email, hasPassword: !!password, hasName: !!name });
      return c.json({ error: "Email, password, and name are required" }, 400);
    }

    console.log('Creating Supabase client with service role key');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Determine if user has full access based on license key
    const hasFullAccess = licenseKey && VALID_LICENSE_KEYS.includes(licenseKey.trim());
    
    console.log('License key validation:', { 
      hasFullAccess, 
      providedKey: licenseKey,
      isValidKey: VALID_LICENSE_KEYS.includes(licenseKey?.trim() || '')
    });

    // Create user with Supabase Auth
    console.log('Calling supabase.auth.admin.createUser...');
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        hasFullAccess,
        calculationsUsed: 0
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Supabase createUser error:`, { 
        message: error.message, 
        status: error.status,
        code: error.code 
      });
      return c.json({ error: error.message }, 400);
    }

    console.log('User created successfully:', { userId: data.user.id, email: data.user.email });

    // Store user data in KV store
    console.log('Storing user data in KV store...');
    await kv.set(`user:${data.user.id}`, {
      email,
      name,
      hasFullAccess,
      calculationsUsed: 0,
      createdAt: new Date().toISOString()
    });

    console.log('Signup completed successfully for user:', data.user.id);

    return c.json({ 
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name,
        hasFullAccess,
        calculationsUsed: 0
      }
    });
  } catch (err) {
    console.log(`Signup error (caught exception):`, err);
    console.error('Full error details:', err);
    return c.json({ error: "Failed to create account", details: String(err) }, 500);
  }
});

// Get user info endpoint
app.get("/make-server-a15ad91a/user", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Extract user ID from JWT
    const userId = extractUserIdFromJWT(accessToken);
    if (!userId) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user data from KV store
    const userData = await kv.get(`user:${user.id}`);

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: userData?.name || user.user_metadata?.name || '',
        hasFullAccess: userData?.hasFullAccess || user.user_metadata?.hasFullAccess || false,
        calculationsUsed: userData?.calculationsUsed || user.user_metadata?.calculationsUsed || 0
      }
    });
  } catch (err) {
    console.log(`Get user error: ${err}`);
    return c.json({ error: "Failed to get user info" }, 500);
  }
});

// Track calculation endpoint
app.post("/make-server-a15ad91a/calculate", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Extract user ID from JWT
    const userId = extractUserIdFromJWT(accessToken);
    if (!userId) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);

    if (error || !user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user data from KV store, or create if doesn't exist
    let userData = await kv.get(`user:${user.id}`);
    
    if (!userData) {
      // User doesn't exist in KV store, create them
      userData = {
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || '',
        hasFullAccess: user.user_metadata?.hasFullAccess || false,
        calculationsUsed: user.user_metadata?.calculationsUsed || 0,
        createdAt: new Date().toISOString()
      };
      await kv.set(`user:${user.id}`, userData);
    }

    // Check if user has full access
    if (userData.hasFullAccess) {
      return c.json({ 
        success: true,
        hasFullAccess: true,
        calculationsRemaining: -1 // Unlimited
      });
    }

    // Check if user has reached limit
    const calculationsUsed = userData.calculationsUsed || 0;
    if (calculationsUsed >= 5) {
      return c.json({ 
        error: "Calculation limit reached. Please upgrade to Full Access.",
        limitReached: true,
        calculationsUsed,
        calculationsRemaining: 0
      }, 403);
    }

    // Increment calculation count
    const newCount = calculationsUsed + 1;
    await kv.set(`user:${user.id}`, {
      ...userData,
      calculationsUsed: newCount
    });

    return c.json({
      success: true,
      hasFullAccess: false,
      calculationsUsed: newCount,
      calculationsRemaining: 5 - newCount
    });
  } catch (err) {
    console.log(`Calculate tracking error: ${err}`);
    return c.json({ error: "Failed to track calculation" }, 500);
  }
});

// Upgrade account endpoint
app.post("/make-server-a15ad91a/upgrade", async (c) => {
  try {
    // Get user token from custom header or body
    let accessToken = c.req.header('x-user-token');
    const body = await c.req.json();
    const { licenseKey, userToken } = body;
    
    // Use token from body if header is not provided
    if (!accessToken && userToken) {
      accessToken = userToken;
    }
    
    // Also try Authorization header as fallback (for backward compatibility)
    if (!accessToken) {
      const authHeader = c.req.header('Authorization');
      if (authHeader?.startsWith('Bearer ey')) {
        // Check if it looks like a JWT (starts with 'ey'), not the anon key
        accessToken = authHeader.split(' ')[1];
      }
    }
    
    console.log('Upgrade request received:', { 
      hasToken: !!accessToken, 
      tokenLength: accessToken?.length,
      tokenPrefix: accessToken?.substring(0, 30),
      licenseKey,
      hasUserTokenInBody: !!userToken,
      hasCustomHeader: !!c.req.header('x-user-token')
    });
    
    if (!accessToken) {
      console.log('No access token provided');
      return c.json({ error: "Unauthorized - No token" }, 401);
    }

    if (!licenseKey || !VALID_LICENSE_KEYS.includes(licenseKey.trim())) {
      console.log('Invalid license key:', licenseKey);
      return c.json({ error: "Invalid license key" }, 400);
    }

    // Extract user ID from JWT token
    const userId = extractUserIdFromJWT(accessToken);
    console.log('Extracted user ID from JWT:', { userId, tokenParts: accessToken.split('.').length });
    
    if (!userId) {
      console.log('Failed to extract user ID from token - token may be malformed');
      return c.json({ error: "Invalid token format - unable to extract user ID" }, 401);
    }

    // Use service role key with admin API
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    console.log('Calling getUserById with userId:', userId);

    // Verify user exists using admin API
    const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);

    console.log('getUserById result:', { 
      hasUser: !!user, 
      userId: user?.id,
      userEmail: user?.email,
      errorMessage: error?.message,
      errorCode: error?.code,
      errorStatus: error?.status
    });

    if (error || !user) {
      console.log('Auth verification failed:', { error: error?.message, hasUser: !!user });
      return c.json({ 
        error: `Authentication failed - ${error?.message || 'User not found'}`,
        details: 'Please ensure you are logged in with a valid session'
      }, 401);
    }

    // Get user data from KV store, or create if doesn't exist
    let userData = await kv.get(`user:${user.id}`);
    
    console.log('User data from KV store:', { 
      hasData: !!userData, 
      email: userData?.email,
      hasFullAccess: userData?.hasFullAccess 
    });
    
    if (!userData) {
      // User doesn't exist in KV store, create them
      console.log('User not found in KV store, creating entry');
      userData = {
        email: user.email,
        name: user.user_metadata?.name || user.email?.split('@')[0] || '',
        hasFullAccess: false,
        calculationsUsed: user.user_metadata?.calculationsUsed || 0,
        createdAt: new Date().toISOString()
      };
    }

    // Update user to full access
    console.log('Updating user to full access');
    await kv.set(`user:${user.id}`, {
      ...userData,
      hasFullAccess: true
    });

    console.log('Upgrade successful for user:', user.id);
    return c.json({
      success: true,
      hasFullAccess: true
    });
  } catch (err) {
    console.log(`Upgrade error: ${err}`);
    console.error('Full error details:', err);
    return c.json({ error: "Failed to upgrade account", details: String(err) }, 500);
  }
});

// Check device usage to prevent abuse across multiple accounts
app.post("/make-server-a15ad91a/check-device", async (c) => {
  try {
    const body = await c.req.json();
    const { deviceFingerprint } = body;

    if (!deviceFingerprint) {
      return c.json({ error: "Device fingerprint required" }, 400);
    }

    // Check device usage from KV store
    const deviceData = await kv.get(`device:${deviceFingerprint}`);
    
    if (!deviceData) {
      // First time seeing this device
      return c.json({ 
        allowed: true, 
        calculations: 0,
        accountsCreated: 0
      });
    }

    // Check if device has exceeded limits
    const calculations = deviceData.calculations || 0;
    const accountsCreated = (deviceData.accounts || []).length;

    // Allow if user has full access OR hasn't exceeded limits
    // Limit: 3 accounts max per device, 15 total free calculations
    const allowed = calculations < 15 && accountsCreated < 3;

    return c.json({
      allowed,
      calculations,
      accountsCreated,
      message: allowed ? 'Device allowed' : 'Device limit exceeded. Please purchase a license for unlimited access.'
    });
  } catch (err) {
    console.log(`Check device error: ${err}`);
    return c.json({ error: "Failed to check device" }, 500);
  }
});

// Track device usage
app.post("/make-server-a15ad91a/track-device", async (c) => {
  try {
    const body = await c.req.json();
    const { deviceFingerprint, userId, action } = body;

    if (!deviceFingerprint) {
      return c.json({ error: "Device fingerprint required" }, 400);
    }

    // Get current device data
    let deviceData = await kv.get(`device:${deviceFingerprint}`) || {
      calculations: 0,
      accounts: [],
      firstSeen: new Date().toISOString()
    };

    // Update based on action
    if (action === 'calculate') {
      deviceData.calculations = (deviceData.calculations || 0) + 1;
    } else if (action === 'signup' && userId) {
      if (!deviceData.accounts) deviceData.accounts = [];
      if (!deviceData.accounts.includes(userId)) {
        deviceData.accounts.push(userId);
      }
    }

    deviceData.lastSeen = new Date().toISOString();

    // Save updated device data
    await kv.set(`device:${deviceFingerprint}`, deviceData);

    return c.json({ success: true });
  } catch (err) {
    console.log(`Track device error: ${err}`);
    return c.json({ error: "Failed to track device" }, 500);
  }
});

// Send email verification code
app.post("/make-server-a15ad91a/send-verification", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email) {
      return c.json({ error: "Email required" }, 400);
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store code (in production, use Redis or similar with TTL)
    verificationCodes.set(email, { code, expires, email });

    // In production, send email via SendGrid, AWS SES, etc.
    // For now, just log it (in preview mode, we'll show it in the UI)
    console.log(`Verification code for ${email}: ${code}`);

    return c.json({ 
      success: true,
      message: "Verification code sent",
      // In preview mode, return the code (remove in production!)
      previewCode: code
    });
  } catch (err) {
    console.log(`Send verification error: ${err}`);
    return c.json({ error: "Failed to send verification code" }, 500);
  }
});

// Verify email code
app.post("/make-server-a15ad91a/verify-email", async (c) => {
  try {
    const body = await c.req.json();
    const { email, code } = body;

    if (!email || !code) {
      return c.json({ error: "Email and code required" }, 400);
    }

    const stored = verificationCodes.get(email);

    if (!stored) {
      return c.json({ error: "No verification code found. Please request a new one." }, 400);
    }

    if (Date.now() > stored.expires) {
      verificationCodes.delete(email);
      return c.json({ error: "Verification code expired. Please request a new one." }, 400);
    }

    if (stored.code !== code) {
      return c.json({ error: "Invalid verification code" }, 400);
    }

    // Code is valid, remove it
    verificationCodes.delete(email);

    return c.json({ 
      success: true,
      message: "Email verified successfully"
    });
  } catch (err) {
    console.log(`Verify email error: ${err}`);
    return c.json({ error: "Failed to verify email" }, 500);
  }
});

// Verify reCAPTCHA token
app.post("/make-server-a15ad91a/verify-recaptcha", async (c) => {
  try {
    const body = await c.req.json();
    const { token } = body;

    if (!token) {
      return c.json({ error: "reCAPTCHA token required" }, 400);
    }

    const recaptchaSecret = Deno.env.get('RECAPTCHA_SECRET_KEY');
    
    if (!recaptchaSecret) {
      console.log('Warning: RECAPTCHA_SECRET_KEY not set, skipping verification in preview mode');
      return c.json({ success: true, score: 0.9 });
    }

    // Verify with Google reCAPTCHA
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${recaptchaSecret}&response=${token}`,
    });

    const result = await response.json();

    if (!result.success) {
      return c.json({ error: "reCAPTCHA verification failed" }, 400);
    }

    // For reCAPTCHA v3, check score (0.0 - 1.0, higher is better)
    const score = result.score || 0;
    if (score < 0.5) {
      return c.json({ error: "Low reCAPTCHA score, possible bot" }, 400);
    }

    return c.json({ 
      success: true,
      score
    });
  } catch (err) {
    console.log(`Verify reCAPTCHA error: ${err}`);
    return c.json({ error: "Failed to verify reCAPTCHA" }, 500);
  }
});

Deno.serve(app.fetch);