package com.lms.lms.Course.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.lms.Course.exception.courseNotFoundException;
import com.lms.lms.Course.model.courseModel;
import com.lms.lms.Course.repository.courseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class courseController {
    @Autowired
    private courseRepository courseRepository;

    @Autowired
    private Cloudinary cloudinary;

    // Endpoint to add a course
    @PostMapping("/api/course")
    public ResponseEntity<courseModel> addCourse(
            @RequestPart("courseDetails") String courseDetails,
            @RequestPart("image") MultipartFile imageFile) throws IOException {

        // Parse course details from JSON
        ObjectMapper mapper = new ObjectMapper();
        courseModel course = mapper.readValue(courseDetails, courseModel.class);

        // Upload image to Cloudinary
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
            imageFile.getBytes(),
            ObjectUtils.asMap("resource_type", "auto")
        );

        // Get the secure URL from Cloudinary response
        String imageUrl = (String) uploadResult.get("secure_url");
        course.setImageUrl(imageUrl);

        // Save the course to the database
        courseModel savedCourse = courseRepository.save(course);
        // Prevent circular reference in JSON
        savedCourse.setLectures(null);
        return new ResponseEntity<>(savedCourse, HttpStatus.CREATED);
    }

    // Endpoint to fetch all courses
    @GetMapping("/api/course")
    public List<courseModel> getAllCourses() {
        List<courseModel> courses = courseRepository.findAll();
        // Prevent circular reference in JSON
        courses.forEach(course -> course.setLectures(null));
        return courses;
    }

    @GetMapping("/api/course/{id}")
    public courseModel getItemId(@PathVariable Long id) {
        courseModel course = courseRepository.findById(id)
                .orElseThrow(() -> new courseNotFoundException(id));
        // Prevent circular reference in JSON
        course.setLectures(null);
        return course;
    }

    // Update course details and optionally update image
    @PutMapping("/api/course/{id}")
    public courseModel updateCourse(
            @RequestPart("courseDetails") String courseDetails,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @PathVariable Long id
    ) {
        ObjectMapper mapper = new ObjectMapper();
        courseModel newCourse;
        try {
            newCourse = mapper.readValue(courseDetails, courseModel.class);
        } catch (Exception e) {
            throw new RuntimeException("Course details not valid", e);
        }

        return courseRepository.findById(id).map(existingCourse -> {
            existingCourse.setTitle(newCourse.getTitle());
            existingCourse.setDescription(newCourse.getDescription());
            existingCourse.setPrice(newCourse.getPrice());

            if (file != null && !file.isEmpty()) {
                try {
                    // Upload new image to Cloudinary
                    Map<?, ?> uploadResult = cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap("resource_type", "auto")
                    );

                    // Get the secure URL from Cloudinary response
                    String imageUrl = (String) uploadResult.get("secure_url");
                    existingCourse.setImageUrl(imageUrl);

                } catch (IOException e) {
                    throw new RuntimeException("Error uploading file to Cloudinary: ", e);
                }
            }

            courseModel savedCourse = courseRepository.save(existingCourse);
            // Prevent circular reference in JSON
            savedCourse.setLectures(null);
            return savedCourse;
        }).orElseThrow(() -> new courseNotFoundException(id));
    }

    @DeleteMapping("/api/course/{id}")
    String deleteCourse(@PathVariable Long id) {
        courseModel courseItem = courseRepository.findById(id)
            .orElseThrow(() -> new courseNotFoundException(id));

        // Delete the image from Cloudinary if needed
        String imageUrl = courseItem.getImageUrl();
        if (imageUrl != null && !imageUrl.isEmpty()) {
            try {
                // Extract public_id from the URL
                String publicId = imageUrl.substring(imageUrl.lastIndexOf("/") + 1, imageUrl.lastIndexOf("."));
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            } catch (IOException e) {
                System.out.println("Error deleting image from Cloudinary: " + e.getMessage());
            }
        }

        // Delete the course from the database
        courseRepository.deleteById(id);
        return "Course with id " + id + " deleted successfully";
    }

    @GetMapping("/api/course/search")
    public List<courseModel> searchCourses(@RequestParam String title) {
        List<courseModel> courses = courseRepository.findByTitleContainingIgnoreCase(title);
        // Prevent circular reference in JSON
        courses.forEach(course -> course.setLectures(null));
        return courses;
    }
}
