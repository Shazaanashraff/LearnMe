package com.lms.lms.Payment.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendConfirmationEmail(String to, String studentName, BigDecimal amount, String month, String courseName, String courseCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Payment Confirmation");
            String text = "Hello " + studentName + ",\n\n" +
                    "Your payment of Rs. " + amount + " for " + month + " has been received successfully.\n" +
                    "Course: " + courseName + " (" + courseCode + ")\n\n" +
                    "Thank you!";
            message.setText(text);
            mailSender.send(message);
            logger.info("Confirmation email sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send confirmation email to {}", to, e);
        }
    }


    public void sendFailureEmail(String to, String studentName, BigDecimal amount) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Payment Failure");
            message.setText("Hello " + studentName + ",\n\nUnfortunately, your payment of Rs. " + amount + " has failed.\nPlease check your payment method or contact support for assistance.\n\nThank you.");
            mailSender.send(message);
            logger.info("Failure email sent to {}", to);
        } catch (Exception e) {
            logger.error("Failed to send failure email to {}", to, e);
        }
    }

    public void sendTutorPaymentNotification(String tutorEmail, String studentName, BigDecimal amount, String month, LocalDate paidOn) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(tutorEmail);
            message.setSubject("Student Payment Notification");
            message.setText("Hello Tutor,\n\nStudent " + studentName + " has made a payment of Rs. " + amount + " for " + month + " on " + paidOn + ".\n\nThank you for your attention.");
            mailSender.send(message);
            logger.info("Tutor notification email sent to {}", tutorEmail);
        } catch (Exception e) {
            logger.error("Failed to send tutor notification email to {}", tutorEmail, e);
        }
    }
}