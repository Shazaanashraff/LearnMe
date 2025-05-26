package com.lms.lms.Assignment.DTO;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class AssignmentDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private String status;
    private String timeRemaining;
}
