package com.lms.lms.Assignment.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lms.lms.Assignment.Entity.Submission;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByAssignmentId(Long assignmentId);
    List<Submission> findByStudentId(String studentId);
    List<Submission> findByAssignmentIdAndStudentId(Long assignmentId, String studentId);
    Integer countByAssignmentIdAndStudentId(Long assignmentId, String studentId);
}