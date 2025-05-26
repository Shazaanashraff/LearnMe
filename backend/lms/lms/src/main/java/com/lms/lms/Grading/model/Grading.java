package com.lms.lms.Grading.model;


import jakarta.persistence.*;

@Entity
@Table(name = "quiz_grading")

public class Grading {

    @Id
    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "quiz_id", length = 6)
    private String id;

    @Column(name ="quiz_marks")
    private Integer quiz_marks;

    @Column(name ="assingment_id")
    private Integer assingment_id;

//    @Column(name = "assignment_id")
//    private Assignment assignment;

    @Column(name = "assingment_marks")
    private Integer assingment_marks;

    // Constructors
    public Grading() {}

    public Grading(String studentId, String id, Integer quiz_marks, Integer assingment_id, Integer assingment_marks) {
        this.studentId = studentId;
        this.id = id;
        this.quiz_marks = quiz_marks;
        this.assingment_id = assingment_id;
        this.assingment_marks = assingment_marks;
    }

    // Getters and Setters


    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getId() {
        return id ;
    }

    public void setId(String id ) {
        this.id = id ;
    }

    public Integer getQuizMarks() {
        return quiz_marks;
    }

    public void setQuizMarks(Integer quiz_marks) {
        this.quiz_marks = quiz_marks;
    }

    public Integer getAssignmentId() {
        return assingment_id;
    }

    public void setAssignmentId(Integer assingment_id) {
        this.assingment_id = assingment_id;
    }

    public Integer getAssignmentMarks() {
        return assingment_marks;
    }

    public void setAssignmentMarks(Integer assingment_marks) {
        this.assingment_marks = assingment_marks;
    }

}