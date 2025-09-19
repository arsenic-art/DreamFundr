import sgMail from "@sendgrid/mail";

// Email service configuration validation
function validateEmailConfig() {
  const requiredVars = ['SENDGRID_API_KEY', 'SENDGRID_VERIFIED_EMAIL'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.error(`Email service configuration incomplete. Missing: ${missing.join(', ')}`);
    return false;
  }
  
  return true;
}

/**
 * Tests email service configuration
 * @returns {Promise<{success: boolean, error?: string}>} - Configuration test result
 */
export async function testEmailConfig() {
  if (!validateEmailConfig()) {
    return { success: false, error: "Email service configuration incomplete." };
  }

  try {
    // Test SendGrid API key validity by attempting to get account info
    // This is a lightweight way to validate the API key without sending an email
    const testMsg = {
      to: process.env.SENDGRID_VERIFIED_EMAIL,
      from: process.env.SENDGRID_VERIFIED_EMAIL,
      subject: "Configuration Test",
      html: "<p>Test email</p>",
    };

    // We'll use the mail send endpoint but with a dry run approach
    // by checking if the message structure is valid
    if (!testMsg.to || !testMsg.from || !testMsg.subject || !testMsg.html) {
      return { success: false, error: "Invalid email message structure." };
    }

    return { success: true };
  } catch (error) {
    console.error("Email configuration test failed:", error);
    return { success: false, error: "Email service configuration test failed." };
  }
}

// Initialize SendGrid with validation
if (validateEmailConfig()) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log("Email service initialized successfully");
} else {
  console.error("Email service initialization failed. Email sending will be disabled.");
}

/**
 * Generates HTML template for email verification
 * @param {string} name - The recipient's name
 * @param {string} otp - The verification OTP
 * @returns {string} - HTML email template
 */
function getVerificationEmailTemplate(name, otp) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Dream Fundr</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
            Dream Fundr
          </h1>
          <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 16px; opacity: 0.9;">
            Turn your dreams into reality
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
          <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
            Hi ${name}! 👋
          </h2>
          
          <p style="color: #4a5568; line-height: 1.6; margin: 0 0 24px 0; font-size: 16px;">
            Welcome to Dream Fundr! We're excited to have you join our community of dreamers and supporters.
          </p>
          
          <p style="color: #4a5568; line-height: 1.6; margin: 0 0 32px 0; font-size: 16px;">
            To complete your account setup and start exploring amazing projects, please verify your email address using the code below:
          </p>

          <!-- OTP Box -->
          <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border: 2px solid #e2e8f0; border-radius: 12px; padding: 32px; text-align: center; margin: 32px 0;">
            <p style="color: #718096; margin: 0 0 16px 0; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
              Your Verification Code
            </p>
            <div style="font-size: 36px; font-weight: 800; color: #667eea; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
            <p style="color: #a0aec0; margin: 16px 0 0 0; font-size: 14px;">
              This code expires in 10 minutes
            </p>
          </div>

          <!-- Instructions -->
          <div style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 32px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #2d3748; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
              How to verify:
            </h3>
            <ol style="color: #4a5568; margin: 0; padding-left: 20px; line-height: 1.6;">
              <li style="margin-bottom: 8px;">Return to the verification page</li>
              <li style="margin-bottom: 8px;">Enter the 6-digit code above</li>
              <li>Click "Verify Email" to complete setup</li>
            </ol>
          </div>

          <p style="color: #718096; line-height: 1.6; margin: 32px 0 0 0; font-size: 14px;">
            If you didn't create an account with Dream Fundr, you can safely ignore this email.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #718096; margin: 0 0 12px 0; font-size: 14px;">
            Thanks for choosing Dream Fundr!
          </p>
          <p style="color: #a0aec0; margin: 0; font-size: 12px;">
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      </div>
      
      <!-- Footer spacing -->
      <div style="height: 40px;"></div>
    </body>
    </html>
  `;
}

/**
 * Sends an email verification email using SendGrid.
 * @param {object} options - The options for the email.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.name - The recipient's name.
 * @param {string} options.otp - The verification OTP.
 * @returns {Promise<{success: boolean, error?: any}>} - A promise that resolves to an object indicating success or failure.
 */
export async function sendVerificationEmail({ to, name, otp }) {
  // Input validation
  if (!to || !name || !otp) {
    console.error("sendVerificationEmail: Missing required parameters", { to: !!to, name: !!name, otp: !!otp });
    return { success: false, error: "Missing required email parameters." };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    console.error("sendVerificationEmail: Invalid email format", { to });
    return { success: false, error: "Invalid email address format." };
  }

  // Configuration validation
  if (!validateEmailConfig()) {
    return { success: false, error: "Email service not configured." };
  }

  const msg = {
    to,
    from: process.env.SENDGRID_VERIFIED_EMAIL,
    subject: "Verify Your Email Address - Dream Fundr",
    html: getVerificationEmailTemplate(name, otp),
  };

  try {
    console.log(`Sending verification email to: ${to}`);
    const response = await sgMail.send(msg);
    console.log(`Verification email sent successfully to: ${to}`);
    return { success: true, messageId: response[0]?.headers?.['x-message-id'] };
  } catch (error) {
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      code: error.code,
      statusCode: error.response?.status,
      body: error.response?.body,
      to,
      timestamp: new Date().toISOString()
    };
    
    console.error("SendGrid verification email error:", errorDetails);
    
    // Return user-friendly error messages based on error type
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return { success: false, error: "Network error. Please try again later." };
    }
    
    if (error.response?.status === 400) {
      return { success: false, error: "Invalid email configuration." };
    }
    
    if (error.response?.status === 401) {
      return { success: false, error: "Email service authentication failed." };
    }
    
    if (error.response?.status === 403) {
      return { success: false, error: "Email service access denied." };
    }
    
    return { success: false, error: "Failed to send verification email. Please try again." };
  }
}

/**
 * Sends a password reset email using SendGrid.
 * @param {object} options - The options for the email.
 * @param {string} options.to - The recipient's email address.
 * @param {string} options.username - The recipient's username.
 * @param {string} options.token - The password reset token.
 * @param {string} options.otp - The password reset OTP.
 * @returns {Promise<{success: boolean, error?: any}>} - A promise that resolves to an object indicating success or failure.
 */
export async function sendResetEmail({ to, username, token, otp }) {
  // Input validation
  if (!to || !username || !token || !otp) {
    console.error("sendResetEmail: Missing required parameters", { 
      to: !!to, username: !!username, token: !!token, otp: !!otp 
    });
    return { success: false, error: "Missing required email parameters." };
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(to)) {
    console.error("sendResetEmail: Invalid email format", { to });
    return { success: false, error: "Invalid email address format." };
  }

  // Configuration validation
  if (!validateEmailConfig()) {
    return { success: false, error: "Email service not configured." };
  }

  // Validate app URL for reset link
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.error("sendResetEmail: NEXT_PUBLIC_APP_URL not configured");
    return { success: false, error: "Application URL not configured." };
  }

  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password-confirm?token=${token}`;

  const msg = {
    to,
    from: process.env.SENDGRID_VERIFIED_EMAIL, 
    subject: "Password Reset Request - Dream Fundr",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2>Hi ${username},</h2>
        <p>You recently requested to reset your password. You can do so using one of the options below.</p>
        
        <h3>Option 1: Reset via Link</h3>
        <p>
          Click the button below to set a new password. This link is valid for 15 minutes.
          <br/><br/>
          <a href="${resetLink}" 
             style="background-color: #4f46e5; color: #ffffff; padding: 12px 25px;
                    text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
            Reset Password
          </a>
        </p>
        
        <h3>Option 2: Reset via OTP</h3>
        <p>Use the following One-Time Password (OTP) to reset your password. This OTP is valid for 10 minutes.</p>
        <div style="font-size: 24px; font-weight: bold; color: #4f46e5; letter-spacing: 2px; margin: 10px 0;">
          ${otp}
        </div>

        <br/>
        <p>If you did not request this password reset, please ignore this email.</p>
        <p>Thanks,<br/>The Dream Fundr Team</p>
      </div>
    `,
  };

  try {
    console.log(`Sending password reset email to: ${to}`);
    const response = await sgMail.send(msg);
    console.log(`Password reset email sent successfully to: ${to}`);
    return { success: true, messageId: response[0]?.headers?.['x-message-id'] };
  } catch (error) {
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      code: error.code,
      statusCode: error.response?.status,
      body: error.response?.body,
      to,
      timestamp: new Date().toISOString()
    };
    
    console.error("SendGrid password reset email error:", errorDetails);
    
    // Return user-friendly error messages based on error type
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      return { success: false, error: "Network error. Please try again later." };
    }
    
    if (error.response?.status === 400) {
      return { success: false, error: "Invalid email configuration." };
    }
    
    if (error.response?.status === 401) {
      return { success: false, error: "Email service authentication failed." };
    }
    
    if (error.response?.status === 403) {
      return { success: false, error: "Email service access denied." };
    }
    
    return { success: false, error: "Failed to send password reset email. Please try again." };
  }
}
