package com.lms.lms.Assignment.DTO;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class SubmissionDTO {
    private Long id;
    private Long assignmentId;
    private String studentId;
    private String comment;
    private LocalDateTime submissionTime;
    private String submissionStatus;
    private String gradingStatus;
    private Integer attemptNumber;
}