package com.example.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String email;

    public void sendResetEmail(String to, String resetLink) {
        String subject = "Cập nhật lại mật khẩu";
        String body = "<html>" +
                "<body style='font-family: Inter, sans-serif; background-color: #f8fafc; padding: 40px;'>" +
                "<div style='max-width: 480px; background-color: #ffffff; padding: 24px; border-radius: 8px; " +
                "box-shadow: 0px 4px 10px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; margin: auto;'>" +
                "<h2 style='color: #1e293b; text-align: center; font-size: 20px; margin-bottom: 16px;'>" +
                "🔒 Đặt lại mật khẩu</h2>" +
                "<p style='color: #475569; font-size: 14px; margin-bottom: 16px;'>Xin chào,</p>" +
                "<p style='color: #475569; font-size: 14px; line-height: 1.5;'>" +
                "Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào nút bên dưới để tiếp tục:</p>" +
                "<div style='text-align: center; margin: 24px 0;'>" +
                "<a href='" + resetLink + "' style='display: inline-block; padding: 12px 24px; " +
                "font-size: 14px; font-weight: 500; text-align: center; color: #ffffff; background-color: #6366f1; " +
                "text-decoration: none; border-radius: 6px;'>Đặt lại mật khẩu</a>" +
                "</div>" +
                "<p style='color: #64748b; font-size: 13px; text-align: center;'>" +
                "⚠ Liên kết này sẽ hết hạn sau <strong>5 phút</strong>.</p>" +
                "<p style='color: #64748b; font-size: 13px; line-height: 1.5; margin-top: 16px;'>" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>" +
                "<hr style='border: 0; height: 1px; background: #e2e8f0; margin: 24px 0;'>" +
                "<p style='font-size: 12px; color: #94a3b8; text-align: center;'>" +
                "Trân trọng,<br>" +
                "<strong>Đội ngũ hỗ trợ của chúng tôi</strong></p>" +
                "</div></body></html>";

        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            helper.setFrom(email);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new IllegalArgumentException("Lỗi gửi email: " + e.getMessage());
        }
    }

}
