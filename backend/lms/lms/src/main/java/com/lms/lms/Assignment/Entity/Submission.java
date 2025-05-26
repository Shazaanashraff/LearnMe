package com.lms.lms.Assignment.Entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "submissions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    private String studentId;
    private String comment;
    private LocalDateTime submissionTime;
    private String fileName;
    private String fileType;
    
    @Lob
    @Column(columnDefinition = "BYTEA")
    private byte[] fileContent;

    private String submissionStatus = "SUBMITTED";
    private String gradingStatus = "NOT_GRADED";
    private Integer attemptNumber = 1;

    @PrePersist
    protected void onCreate() {
        submissionTime = LocalDateTime.now();
    }
}