package com.lms.lms.Lecture.repository;


import com.lms.lms.Lecture.model.lectureModel;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface lectureRepository extends JpaRepository<lectureModel, Long> {
    List<lectureModel> findByCourseId(Long courseId);
}
