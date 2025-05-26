package com.lms.lms.Lecture.model;

import com.lms.lms.Course.model.courseModel;
import jakarta.persistence.*;
import lombok.Getter;



@Getter
@Entity
public class lectureModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String videoUrl;
    private int duration; // duration in minutes or seconds

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false) // Foreign key to courseModel
    private courseModel course;


    public lectureModel() {
    }

    public lectureModel(String title, String videoUrl, int duration, courseModel course) {
        this.title = title;
        this.videoUrl = videoUrl;
        this.duration = duration;
        this.course = course;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public void setCourse(courseModel course) {
        this.course = course;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public int getDuration() {
        return duration;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public courseModel getCourse() {
        return course;
    }
}
