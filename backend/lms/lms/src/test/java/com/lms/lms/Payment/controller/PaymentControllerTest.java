package com.lms.lms.Payment.controller;

import com.lms.lms.Course.model.courseModel;
import com.lms.lms.Payment.model.Payment;
import com.lms.lms.User.Entity.User;
import com.lms.lms.Course.repository.courseRepository;
import com.lms.lms.User.repository.UserRepository;
import com.lms.lms.Payment.service.PaymentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class PaymentControllerTest {

    @Mock
    private PaymentService paymentService;

    @Mock
    private UserRepository studentRepo;

    @Mock
    private courseRepository courseRepo;

    @InjectMocks
    private PaymentController paymentController;

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
        when(paymentService.getAllPayments()).thenReturn(expectedPayments);

        List<Payment> actualPayments = paymentController.getAllPayments();

        assertEquals(expectedPayments, actualPayments);
        verify(paymentService).getAllPayments();
    }

    @Test
    void testGetPaymentById() {
        when(paymentService.getPaymentById(1L)).thenReturn(payment);

        Payment foundPayment = paymentController.getPaymentById(1L);

        assertNotNull(foundPayment);
        assertEquals(payment.getPaymentId(), foundPayment.getPaymentId());
        verify(paymentService).getPaymentById(1L);
    }

    @Test
    void testAddPayment_Success() {
        when(studentRepo.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepo.findById(1L)).thenReturn(Optional.of(course));
        when(paymentService.savePayment(any(Payment.class))).thenReturn(payment);

        ResponseEntity<?> response = paymentController.addPayment(payment);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(payment, response.getBody());
        verify(paymentService).savePayment(payment);
    }

    @Test
    void testAddPayment_MissingStudentId() {
        payment.setStudent(null);

        ResponseEntity<?> response = paymentController.addPayment(payment);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Student ID is missing", response.getBody());
        verify(paymentService, never()).savePayment(any(Payment.class));
    }

    @Test
    void testAddPayment_MissingCourse() {
        payment.setCourse(null);

        ResponseEntity<?> response = paymentController.addPayment(payment);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Course is missing", response.getBody());
        verify(paymentService, never()).savePayment(any(Payment.class));
    }

    @Test
    void testAddPayment_StudentNotFound() {
        when(studentRepo.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = paymentController.addPayment(payment);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Student not found", response.getBody());
        verify(paymentService, never()).savePayment(any(Payment.class));
    }

    @Test
    void testAddPayment_CourseNotFound() {
        when(studentRepo.findById(1L)).thenReturn(Optional.of(student));
        when(courseRepo.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = paymentController.addPayment(payment);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Course not found", response.getBody());
        verify(paymentService, never()).savePayment(any(Payment.class));
    }

    @Test
    void testUpdatePaymentStatus_Success() {
        when(paymentService.getPaymentById(1L)).thenReturn(payment);
        when(paymentService.savePayment(any(Payment.class))).thenReturn(payment);

        ResponseEntity<Payment> response = paymentController.updatePaymentStatus(1L, "failed");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("failed", response.getBody().getStatus());
        verify(paymentService).getPaymentById(1L);
        verify(paymentService).savePayment(payment);
    }

    @Test
    void testUpdatePaymentStatus_NotFound() {
        when(paymentService.getPaymentById(1L)).thenReturn(null);

        ResponseEntity<Payment> response = paymentController.updatePaymentStatus(1L, "failed");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNull(response.getBody());
        verify(paymentService).getPaymentById(1L);
        verify(paymentService, never()).savePayment(any(Payment.class));
    }

    @Test
    void testDeletePaymentById() {
        doNothing().when(paymentService).deletePayment(1L);

        paymentController.deletePaymentById(1L);

        verify(paymentService).deletePayment(1L);
    }

    @Test
    void testCheckPaymentStatus_Success() {
        when(paymentService.checkPaymentStatus(1L, 1L)).thenReturn(true);

        ResponseEntity<?> response = paymentController.checkPaymentStatus(1L, 1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(((Map<String, Boolean>) response.getBody()).get("paid"));
        verify(paymentService).checkPaymentStatus(1L, 1L);
    }

    @Test
    void testCheckPaymentStatus_Error() {
        when(paymentService.checkPaymentStatus(1L, 1L)).thenThrow(new RuntimeException("Test error"));

        ResponseEntity<?> response = paymentController.checkPaymentStatus(1L, 1L);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Error checking payment status"));
        verify(paymentService).checkPaymentStatus(1L, 1L);
    }
} 