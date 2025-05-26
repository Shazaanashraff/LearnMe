package com.lms.lms.Assignment.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import com.lms.lms.Assignment.DTO.AssignmentDTO;
import com.lms.lms.Assignment.Entity.Assignment;
import com.lms.lms.Assignment.Repository.AssignmentRepository;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    private final Path fileStorageLocation = Paths.get("uploads/assignments");

    public AssignmentService() {
        try {
            Files.createDirectories(fileStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory!", e);
        }
    }

    public String uploadFile(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path targetLocation = fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation);
            return fileName;
        } catch (IOException e) {
            throw new RuntimeException("Could not store file. Please try again!", e);
        }
    }

    public Assignment saveAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Assignment getAssignmentById(Long id) {
        return assignmentRepository.findById(id).orElse(null);
    }

    public List<Assignment> getAssignmentsByCourse(Long courseId) {
        return assignmentRepository.findByCourseId(courseId);
    }

    public void deleteAssignment(Long id) {
        Assignment assignment = getAssignmentById(id);
        if (assignment != null && assignment.getFileUrl() != null) {
            try {
                Path filePath = fileStorageLocation.resolve(assignment.getFileUrl());
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                throw new RuntimeException("Error deleting file", e);
            }
        }
        assignmentRepository.deleteById(id);
    }

    public List<AssignmentDTO> getAssignmentsByStatus(String status) {
        return assignmentRepository.findByStatus(status).stream()
                .map(assignment -> {
                    AssignmentDTO dto = new AssignmentDTO();
                    BeanUtils.copyProperties(assignment, dto);
                    dto.setTimeRemaining(assignment.getTimeRemaining());
                    return dto;
                })
                .collect(Collectors.toList());
    }
}
