package com.lms.lms.Assignment.Service;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.lms.lms.Assignment.DTO.SubmissionDTO;
import com.lms.lms.Assignment.Entity.Submission;
import com.lms.lms.Assignment.Entity.Assignment;
import com.lms.lms.Assignment.Repository.SubmissionRepository;
import com.lms.lms.Assignment.Repository.AssignmentRepository;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Transactional
    public SubmissionDTO submitAssignment(SubmissionDTO submissionDTO, MultipartFile file) throws IOException {
        // Get the assignment
        Assignment assignment = assignmentRepository.findById(submissionDTO.getAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Create new submission
        Submission submission = new Submission();
        submission.setAssignment(assignment);
        submission.setStudentId(submissionDTO.getStudentId());
        submission.setComment(submissionDTO.getComment());
        submission.setFileName(file.getOriginalFilename());
        submission.setFileType(file.getContentType());
        submission.setFileContent(file.getBytes());

        // Set attempt number
        Integer attemptCount = submissionRepository.countByAssignmentIdAndStudentId(
            submissionDTO.getAssignmentId(), 
            submissionDTO.getStudentId()
        );
        submission.setAttemptNumber(attemptCount + 1);

        // Save submission
        Submission savedSubmission = submissionRepository.save(submission);

        // Convert to DTO and return
        return convertToDTO(savedSubmission);
    }

    @Transactional(readOnly = true)
    public List<SubmissionDTO> getSubmissionsByAssignment(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<SubmissionDTO> getSubmissionsByStudent(String studentId) {
        return submissionRepository.findByStudentId(studentId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SubmissionDTO getSubmissionById(Long id) {
        return submissionRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }

    @Transactional(readOnly = true)
    public byte[] getFileContent(Long id) {
        return submissionRepository.findById(id)
                .map(Submission::getFileContent)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }

    @Transactional(readOnly = true)
    public String getFileName(Long id) {
        return submissionRepository.findById(id)
                .map(Submission::getFileName)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }

    @Transactional(readOnly = true)
    public String getFileType(Long id) {
        return submissionRepository.findById(id)
                .map(Submission::getFileType)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
    }

    private SubmissionDTO convertToDTO(Submission submission) {
        SubmissionDTO dto = new SubmissionDTO();
        dto.setId(submission.getId());
        dto.setAssignmentId(submission.getAssignment().getId());
        dto.setStudentId(submission.getStudentId());
        dto.setComment(submission.getComment());
        dto.setSubmissionTime(submission.getSubmissionTime());
        dto.setSubmissionStatus(submission.getSubmissionStatus());
        dto.setGradingStatus(submission.getGradingStatus());
        dto.setAttemptNumber(submission.getAttemptNumber());
        return dto;
    }
}