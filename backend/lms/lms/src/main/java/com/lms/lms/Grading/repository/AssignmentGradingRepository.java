package com.lms.lms.Grading.repository;

import com.lms.lms.Grading.model.Grading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AssignmentGradingRepository extends JpaRepository<Grading, Long> {
}
