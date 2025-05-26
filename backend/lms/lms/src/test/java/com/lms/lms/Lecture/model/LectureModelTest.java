package com.lms.lms.Lecture.model;

import com.lms.lms.Course.model.courseModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class LectureModelTest {
    private lectureModel lecture;
    private courseModel course;

    @BeforeEach
    void setUp() {
        course = new courseModel();
        course.setId(1L);
        course.setTitle("Test Course");

        lecture = new lectureModel();
        lecture.setId(1L);
        lecture.setTitle("Test Lecture");
        lecture.setVideoUrl("http://example.com/video.mp4");
        lecture.setDuration(45);
        lecture.setCourse(course);
    }

    @Test
    void testLectureCreation() {
        assertNotNull(lecture);
        assertEquals(1L, lecture.getId());
        assertEquals("Test Lecture", lecture.getTitle());
        assertEquals("http://example.com/video.mp4", lecture.getVideoUrl());
        assertEquals(45, lecture.getDuration());
        assertNotNull(lecture.getCourse());
        assertEquals(1L, lecture.getCourse().getId());
    }

    @Test
    void testLectureConstructor() {
        lectureModel newLecture = new lectureModel("New Lecture", "http://example.com/new-video.mp4", 60, course);
        assertEquals("New Lecture", newLecture.getTitle());
        assertEquals("http://example.com/new-video.mp4", newLecture.getVideoUrl());
        assertEquals(60, newLecture.getDuration());
        assertEquals(course, newLecture.getCourse());
    }

    @Test
    void testSettersAndGetters() {
        // Test setters
        lecture.setTitle("Updated Lecture");
        lecture.setVideoUrl("http://example.com/updated-video.mp4");
        lecture.setDuration(90);
        
        courseModel newCourse = new courseModel();
        newCourse.setId(2L);
        lecture.setCourse(newCourse);

        // Test getters
        assertEquals("Updated Lecture", lecture.getTitle());
        assertEquals("http://example.com/updated-video.mp4", lecture.getVideoUrl());
        assertEquals(90, lecture.getDuration());
        assertEquals(2L, lecture.getCourse().getId());
    }

    @Test
    void testCourseRelationship() {
        // Test course relationship
        assertNotNull(lecture.getCourse());
        assertEquals(1L, lecture.getCourse().getId());
        assertEquals("Test Course", lecture.getCourse().getTitle());

        // Test setting new course
        courseModel newCourse = new courseModel();
        newCourse.setId(2L);
        newCourse.setTitle("New Course");
        lecture.setCourse(newCourse);

        assertEquals(2L, lecture.getCourse().getId());
        assertEquals("New Course", lecture.getCourse().getTitle());
    }
} 