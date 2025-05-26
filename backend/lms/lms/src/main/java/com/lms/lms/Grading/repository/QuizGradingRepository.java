package com.lms.lms.Grading.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lms.lms.Grading.model.Grading;

@Repository
public interface QuizGradingRepository extends JpaRepository<Grading, Long> {
}