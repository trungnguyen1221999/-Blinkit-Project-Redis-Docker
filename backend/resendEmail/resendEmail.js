import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const resendEmail = async (toEmail, subject, htmlContent) => {
  try {
    const response = await resend.emails.send({
      from: process.env.RESEND_EMAIL,
      to: toEmail,
      subject: subject,
      html: htmlContent,
    });

    // Resend API trả về data, không có error field khi thất bại
    // Nếu muốn check thành công, bạn có thể log response
    console.log("Email sent:", response);
    return response;
  } catch (error) {
    // Log chi tiết để debug
    console.error(
      "Error sending email:",
      error.response?.data || error.message || error
    );
    throw error; // Optional: re-throw để controller catch
  }
};

export default resendEmail;
