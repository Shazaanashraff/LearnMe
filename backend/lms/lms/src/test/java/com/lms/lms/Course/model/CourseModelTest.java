package com.lms.lms.Course.model;

import com.lms.lms.Lecture.model.lectureModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CourseModelTest {
    private courseModel course;

    @BeforeEach
    void setUp() {
        course = new courseModel();
        course.setId(1L);
        course.setTitle("Test Course");
        course.setDescription("Test Description");
        course.setImageUrl("http://example.com/image.jpg");
        course.setPrice(99);
    }

    @Test
    void testCourseCreation() {
        assertNotNull(course);
        assertEquals(1L, course.getId());
        assertEquals("Test Course", course.getTitle());
        assertEquals("Test Description", course.getDescription());
        assertEquals("http://example.com/image.jpg", course.getImageUrl());
        assertEquals(99, course.getPrice());
    }

    @Test
    void testCourseConstructor() {
        courseModel newCourse = new courseModel("New Course", "New Description", "http://example.com/new-image.jpg");
        assertEquals("New Course", newCourse.getTitle());
        assertEquals("New Description", newCourse.getDescription());
        assertEquals("http://example.com/new-image.jpg", newCourse.getImageUrl());
    }

    @Test
    void testCourseWithPrice() {
        courseModel priceCourse = new courseModel(199, 2L);
        assertEquals(199, priceCourse.getPrice());
        assertEquals(2L, priceCourse.getId());
    }

    @Test
    void testLecturesList() {
        assertNotNull(course.getLectures());
        assertTrue(course.getLectures().isEmpty());
        
        // Test adding a lecture
        lectureModel lecture = new lectureModel();
        course.getLectures().add(lecture);
        assertEquals(1, course.getLectures().size());
    }

    @Test
    void testSettersAndGetters() {
        // Test setters
        course.setTitle("Updated Title");
        course.setDescription("Updated Description");
        course.setImageUrl("http://example.com/updated.jpg");
        course.setPrice(149);

        // Test getters
        assertEquals("Updated Title", course.getTitle());
        assertEquals("Updated Description", course.getDescription());
        assertEquals("http://example.com/updated.jpg", course.getImageUrl());
        assertEquals(149, course.getPrice());
    }
} 