package com.lms.lms.Grading.controller;

import com.lms.lms.Grading.model.Grading;
import com.lms.lms.Grading.repository.AssignmentGradingRepository;
import com.lms.lms.Grading.repository.QuizGradingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grading")
public class GradingController {

    @Autowired
    private QuizGradingRepository gradingRepository;
    @Autowired
    private AssignmentGradingRepository assignmentGradingRepository;

    @GetMapping("/quiz")
    public List<Grading> getAllQuizGrading() {
        return gradingRepository.findAll();
    }
    @GetMapping("/assignment")
    public List<Grading> getAllAssignmentGrading() {
        return assignmentGradingRepository.findAll();
    }
}