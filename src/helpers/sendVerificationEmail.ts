import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const toEmail =
      process.env.NODE_ENV === "development"
        ? process.env.RESEND_TEST_EMAIL!
        : email;

    const { error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: toEmail,
      subject: "Mystry Message | Verification Code",
      react: VerificationEmail({
        username,
        otp: verifyCode,
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        message: error.message || "Email sending failed",
      };
    }

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (err) {
    console.error("Unexpected email error:", err);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
