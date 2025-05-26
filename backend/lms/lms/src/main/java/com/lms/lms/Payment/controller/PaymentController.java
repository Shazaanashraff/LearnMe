package com.lms.lms.Payment.controller;

import com.lms.lms.Course.model.courseModel;
import com.lms.lms.Payment.model.Payment;
import com.lms.lms.User.Entity.User;
import com.lms.lms.Course.repository.courseRepository;
import com.lms.lms.User.repository.UserRepository;
import com.lms.lms.Payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    @Autowired
    private UserRepository studentRepo;

    @Autowired
    private courseRepository courseRepo;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{paymentId}")
    public Payment getPaymentById(@PathVariable Long paymentId) {
        return paymentService.getPaymentById(paymentId);
    }

    @PostMapping
    public ResponseEntity<?> addPayment(@RequestBody Payment payment) {
        try {
            // Validate student info
            if (payment.getStudent() == null || payment.getStudent().getId() == null) {
                return ResponseEntity.badRequest().body("Student ID is missing");
            }

            // Validate or create course
            courseModel course = null;
            if (payment.getCourse() == null) {
                return ResponseEntity.badRequest().body("Course is missing");
            }

            if (payment.getCourse().getId() != null) {
                // Existing course, fetch from DB
                course = courseRepo.findById(payment.getCourse().getId()).orElse(null);
                if (course == null) {
                    return ResponseEntity.badRequest().body("Course not found");
                }
            } else if (payment.getCourse().getTitle() != null && !payment.getCourse().getTitle().isBlank()) {
                // New course name provided, create and save course
                courseModel newCourse = new courseModel();
                // Assign an ID, e.g., generate a UUID string or something like "course" + random number
                newCourse.setId(Math.abs(UUID.randomUUID().getMostSignificantBits()));
                newCourse.setTitle(payment.getCourse().getTitle());
                course = courseRepo.save(newCourse);
            } else {
                return ResponseEntity.badRequest().body("Course ID or name must be provided");
            }

            // Fetch student
            User student = studentRepo.findById(payment.getStudent().getId()).orElse(null);
            if (student == null) {
                return ResponseEntity.badRequest().body("Student not found");
            }

            // Set managed entities before saving payment
            payment.setStudent(student);
            payment.setCourse(course);

            // Save payment
            Payment saved = paymentService.savePayment(payment);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error saving payment: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Payment> updatePaymentStatus(@PathVariable Long id, @RequestParam String status) {
        Payment payment = paymentService.getPaymentById(id);
        if (payment != null) {
            payment.setStatus(status);
            return ResponseEntity.ok(paymentService.savePayment(payment));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public void deletePaymentById(@PathVariable Long id) {
        paymentService.deletePayment(id);
    }

    @GetMapping("/check/{studentId}/{courseId}")
    public ResponseEntity<?> checkPaymentStatus(@PathVariable Long studentId, @PathVariable Long courseId) {
        try {
            boolean hasPaid = paymentService.checkPaymentStatus(studentId, courseId);
            Map<String, Boolean> response = new HashMap<>();
            response.put("paid", hasPaid);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error checking payment status: " + e.getMessage());
        }
    }
}