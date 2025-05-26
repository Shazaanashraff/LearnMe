package com.lms.lms.Payment.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lms.lms.Course.model.courseModel;
import com.lms.lms.User.Entity.User;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @Column(nullable = true)
    private String status;

    private String month;

    private BigDecimal amount;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate paidOn;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User student;




    @ManyToOne
    @JoinColumn(name = "course_id")
    private courseModel course;

    public courseModel getCourse() {
        return course;
    }

    public void setCourse(courseModel course) {
        this.course = course;
    }

    public Payment() {}

    public Payment(Long paymentId, LocalDate paidOn, BigDecimal amount, String month, String status, User student) {
        this.paymentId = paymentId;
        this.paidOn = paidOn;
        this.amount = amount;
        this.month = month;
        this.status = status;
        this.student = student;
    }

    // Getters and setters

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public LocalDate getPaidOn() { return paidOn; }
    public void setPaidOn(LocalDate paidOn) { this.paidOn = paidOn; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    @Override
    public String toString() {
        return "Payment{" +
                "paymentId=" + paymentId +
                ", status='" + status + '\'' +
                ", month='" + month + '\'' +
                ", amount=" + amount +
                ", paidOn=" + paidOn +
                ", student=" + student +
                '}';
    }
}