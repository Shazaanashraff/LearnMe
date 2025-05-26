package com.lms.lms.Course.repository;

import com.lms.lms.Course.model.courseModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface courseRepository extends JpaRepository<courseModel, Long> {
    List<courseModel> findByTitleContainingIgnoreCase(String title);
}
