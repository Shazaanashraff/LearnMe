package com.lms.lms.Assignment.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lms.lms.Assignment.Entity.Assignment;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    // Add custom queries if needed
    // Add this to your AssignmentRepository interface
    List<Assignment> findByStatus(String status);
    List<Assignment> findByCourseId(Long courseId);
}