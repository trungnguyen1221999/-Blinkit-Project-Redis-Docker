const forgotPasswordEmailTemplet = (name, otp) => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Password OTP</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f0f8ff; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0, 119, 190, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #006bb3 0%, #0088cc 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">🛒 Blinkit</h1>
            <p style="color: #e6f3ff; margin: 10px 0 0 0; font-size: 16px;">Your trusted delivery partner</p>
          </div>
  
          <!-- Main Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #006bb3; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Hello ${name}! 👋</h2>
            <p style="color: #555555; font-size: 16px; margin: 0 0 30px 0;">
              Your OTP for password reset is <b style="color: #006bb3; font-size: 35px;">${otp}</b>. It is valid for 5 minutes.
            </p>
          </div>
  
          <!-- Footer -->
          <div style="background-color: #f8fbff; padding: 30px; text-align: center; border-top: 2px solid #e1f1ff;">
            <p style="color: #888888; font-size: 14px; margin: 0 0 10px 0;">
              If you didn't forget password at Blinkit, please ignore this email.
            </p>
            <p style="color: #006bb3; font-size: 16px; font-weight: 600; margin: 15px 0 0 0;">
              Best regards,<br/>
              <span style="color: #0088cc;">The Blinkit Team</span> 💙
            </p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e1f1ff;">
              <p style="color: #999999; font-size: 12px; margin: 0;">© 2025 Blinkit. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
};

export default forgotPasswordEmailTemplet;
