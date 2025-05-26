package com.lms.lms.Payment.service;

import com.lms.lms.Course.model.courseModel;
import com.lms.lms.Payment.model.Payment;
import com.lms.lms.User.Entity.User;
import com.lms.lms.Payment.repository.PaymentRepo;
import com.lms.lms.User.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepo paymentRepo;
    private final UserRepository studentRepo;
    private final EmailService emailService;

    public PaymentService(PaymentRepo paymentRepo, UserRepository studentRepo, EmailService emailService) {
        this.paymentRepo = paymentRepo;
        this.studentRepo = studentRepo;
        this.emailService = emailService;
    }

    public List<Payment> getAllPayments() {
        return paymentRepo.findAll();
    }

    public Payment getPaymentById(Long paymentId) {
        return paymentRepo.findById(paymentId).orElse(null);
    }

    public Payment savePayment(Payment payment) {
        Long studentId = payment.getStudent().getId();

        User student = studentRepo.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));

        payment.setStudent(student);

        Payment savedPayment = paymentRepo.save(payment);

        String status = savedPayment.getStatus();

        if ("done".equalsIgnoreCase(status)) {
            courseModel course = savedPayment.getCourse();

            // Send confirmation email with course details
            emailService.sendConfirmationEmail(
                    student.getEmail(),
                    student.getName(),
                    savedPayment.getAmount(),
                    savedPayment.getMonth(),
                    course != null ? course.getTitle() : "N/A",
                    course != null ? course.getId().toString() : "N/A"
            );

            // Notify tutor
            String tutorEmail = "nirdeepana@gmail.com";
            emailService.sendTutorPaymentNotification(
                    tutorEmail,
                    student.getName(),
                    savedPayment.getAmount(),
                    savedPayment.getMonth(),
                    savedPayment.getPaidOn()
            );

        } else if ("failed".equalsIgnoreCase(status)) {
            emailService.sendFailureEmail(
                    student.getEmail(),
                    student.getName(),
                    savedPayment.getAmount()
            );
        }

        return savedPayment;
    }

    public void deletePayment(Long paymentId) {
        paymentRepo.deleteById(paymentId);
    }

    public boolean checkPaymentStatus(Long studentId, Long courseId) {
        List<Payment> payments = paymentRepo.findAll();
        
        return payments.stream()
            .anyMatch(payment -> 
                payment.getStudent() != null && 
                payment.getStudent().getId().equals(studentId) &&
                payment.getCourse() != null &&
                payment.getCourse().getId().equals(courseId) &&
                "paid".equalsIgnoreCase(payment.getStatus())
            );
    }
}