package com.lms.lms.QuizManage.Entity;

import com.lms.lms.Course.model.courseModel;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quizzes")
public class Quiz {

    @Id
    @Column(name = "quiz_id", length = 6)
    private String id;

    @Column(name = "quiz_name", nullable = false)
    private String name;

    @Column(name = "difficulty", nullable = false)
    private String difficulty;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false) // Foreign key to courseModel
    private courseModel course;

    public Quiz() {
    }

    public Quiz(String id, String name, String difficulty) {
        this.id = id;
        this.name = name;
        this.difficulty = difficulty;
    }

    // Add question to quiz
    public void addQuestion(Question question) {
        questions.add(question);
        question.setQuiz(this);
    }

    // Remove question from quiz
    public void removeQuestion(Question question) {
        questions.remove(question);
        question.setQuiz(null);
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public courseModel getCourse() {
        return course;
    }

    public void setCourse(courseModel course) {
        this.course = course;
    }
}