package com.lms.lms.Payment.service;

import com.lms.lms.Course.model.courseModel;
import com.lms.lms.Payment.model.Payment;
import com.lms.lms.User.Entity.User;
import com.lms.lms.Payment.repository.PaymentRepo;
import com.lms.lms.User.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PaymentServiceTest {

    @Mock
    private PaymentRepo paymentRepo;

    @Mock
    private UserRepository studentRepo;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private PaymentService paymentService;

    private Payment payment;
    private User student;
    private courseModel course;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialize test data
        student = new User();
        student.setId(1L);
        student.setEmail("test@example.com");
        student.setFirstName("John");
        student.setLastName("Doe");

        course = new courseModel();
        course.setId(1L);
        course.setTitle("Test Course");

        payment = new Payment();
        payment.setPaymentId(1L);
        payment.setStatus("done");
        payment.setMonth("January");
        payment.setAmount(new BigDecimal("100.00"));
        payment.setPaidOn(LocalDate.now());
        payment.setStudent(student);
        payment.setCourse(course);
    }

    @Test
    void testGetAllPayments() {
        List<Payment> expectedPayments = Arrays.asList(payment);
        when(paymentRepo.findAll()).thenReturn(expectedPayments);

        List<Payment> actualPayments = paymentService.getAllPayments();

        assertEquals(expectedPayments, actualPayments);
        verify(paymentRepo).findAll();
    }

    @Test
    void testGetPaymentById_Success() {
        when(paymentRepo.findById(1L)).thenReturn(Optional.of(payment));

        Payment foundPayment = paymentService.getPaymentById(1L);

        assertNotNull(foundPayment);
        assertEquals(payment.getPaymentId(), foundPayment.getPaymentId());
        verify(paymentRepo).findById(1L);
    }

    @Test
    void testGetPaymentById_NotFound() {
        when(paymentRepo.findById(999L)).thenReturn(Optional.empty());

        Payment foundPayment = paymentService.getPaymentById(999L);

        assertNull(foundPayment);
        verify(paymentRepo).findById(999L);
    }

    @Test
    void testSavePayment_Success() {
        when(studentRepo.findById(1L)).thenReturn(Optional.of(student));
        when(paymentRepo.save(any(Payment.class))).thenReturn(payment);

        Payment savedPayment = paymentService.savePayment(payment);

        assertNotNull(savedPayment);
        assertEquals(payment.getPaymentId(), savedPayment.getPaymentId());
        verify(studentRepo).findById(1L);
        verify(paymentRepo).save(payment);
        verify(emailService).sendConfirmationEmail(
            eq(student.getEmail()),
            eq(student.getName()),
            eq(payment.getAmount()),
            eq(payment.getMonth()),
            eq(course.getTitle()),
            eq(course.getId().toString())
        );
    }

    @Test
    void testSavePayment_FailedStatus() {
        payment.setStatus("failed");
        when(studentRepo.findById(1L)).thenReturn(Optional.of(student));
        when(paymentRepo.save(any(Payment.class))).thenReturn(payment);

        Payment savedPayment = paymentService.savePayment(payment);

        assertNotNull(savedPayment);
        assertEquals("failed", savedPayment.getStatus());
        verify(emailService).sendFailureEmail(
            eq(student.getEmail()),
            eq(student.getName()),
            eq(payment.getAmount())
        );
    }

    @Test
    void testSavePayment_StudentNotFound() {
        when(studentRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> paymentService.savePayment(payment));
        verify(studentRepo).findById(1L);
        verify(paymentRepo, never()).save(any(Payment.class));
    }

    @Test
    void testDeletePayment() {
        doNothing().when(paymentRepo).deleteById(1L);

        paymentService.deletePayment(1L);

        verify(paymentRepo).deleteById(1L);
    }

    @Test
    void testCheckPaymentStatus_True() {
        List<Payment> payments = Arrays.asList(payment);
        when(paymentRepo.findAll()).thenReturn(payments);

        boolean hasPaid = paymentService.checkPaymentStatus(1L, 1L);

        assertTrue(hasPaid);
        verify(paymentRepo).findAll();
    }

    @Test
    void testCheckPaymentStatus_False() {
        List<Payment> payments = Arrays.asList(payment);
        when(paymentRepo.findAll()).thenReturn(payments);

        boolean hasPaid = paymentService.checkPaymentStatus(999L, 999L);

        assertFalse(hasPaid);
        verify(paymentRepo).findAll();
    }
} 