package com.lms.lms.Assignment.Entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.lms.lms.Course.model.courseModel;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime dueDate;
    private String status; // Active, Closed, etc.
    private String fileUrl;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private courseModel course;

    @OneToMany(mappedBy = "assignment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Submission> submissions = new ArrayList<>();

    // Helper method to calculate time remaining
    @Transient
    public String getTimeRemaining() {
        LocalDateTime now = LocalDateTime.now();

        if (now.isAfter(dueDate)) {
            return "Assignment past due";
        }

        long hours = java.time.Duration.between(now, dueDate).toHours();
        long minutes = java.time.Duration.between(now, dueDate).toMinutes() % 60;

        return hours + " hours " + minutes + " mins";
    }
}
