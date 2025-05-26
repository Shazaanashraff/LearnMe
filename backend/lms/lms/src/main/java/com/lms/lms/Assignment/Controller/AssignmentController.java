package com.lms.lms.Assignment.Controller;

import com.lms.lms.Assignment.Entity.Assignment;
import com.lms.lms.Assignment.Service.AssignmentService;
import com.lms.lms.Course.model.courseModel;
import com.lms.lms.Course.repository.courseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private courseRepository courseRepository;

    @PostMapping
    public ResponseEntity<?> createAssignment(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("dueDate") String dueDate,
            @RequestParam("courseId") Long courseId,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            // Find the course
            courseModel course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new RuntimeException("Course not found"));

            Assignment assignment = new Assignment();
            assignment.setTitle(title);
            assignment.setDescription(description);
            assignment.setDueDate(java.time.LocalDateTime.parse(dueDate));
            assignment.setCourse(course);

            // Handle file upload if present
            if (file != null && !file.isEmpty()) {
                String fileUrl = assignmentService.uploadFile(file);
                assignment.setFileUrl(fileUrl);
            }

            Assignment savedAssignment = assignmentService.saveAssignment(assignment);
            return ResponseEntity.ok(savedAssignment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating assignment: " + e.getMessage());
        }
    }

    @GetMapping
    public List<Assignment> getAllAssignments() {
        return assignmentService.getAllAssignments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable Long id) {
        Assignment assignment = assignmentService.getAssignmentById(id);
        if (assignment != null) {
            return ResponseEntity.ok(assignment);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getAssignmentsByCourse(@PathVariable Long courseId) {
        try {
            List<Assignment> assignments = assignmentService.getAssignmentsByCourse(courseId);
            return ResponseEntity.ok(assignments);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching assignments: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssignment(
            @PathVariable Long id,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "dueDate", required = false) String dueDate,
            @RequestParam(value = "courseId", required = false) Long courseId,
            @RequestParam(value = "file", required = false) MultipartFile file) {
        try {
            Assignment assignment = assignmentService.getAssignmentById(id);
            if (assignment == null) {
                return ResponseEntity.notFound().build();
            }

            if (title != null) assignment.setTitle(title);
            if (description != null) assignment.setDescription(description);
            if (dueDate != null) assignment.setDueDate(java.time.LocalDateTime.parse(dueDate));
            
            if (courseId != null) {
                courseModel course = courseRepository.findById(courseId)
                        .orElseThrow(() -> new RuntimeException("Course not found"));
                assignment.setCourse(course);
            }

            if (file != null && !file.isEmpty()) {
                String fileUrl = assignmentService.uploadFile(file);
                assignment.setFileUrl(fileUrl);
            }

            Assignment updatedAssignment = assignmentService.saveAssignment(assignment);
            return ResponseEntity.ok(updatedAssignment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating assignment: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        try {
            assignmentService.deleteAssignment(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting assignment: " + e.getMessage());
        }
    }
}
