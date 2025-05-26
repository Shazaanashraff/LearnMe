package com.lms.lms.Lecture.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.lms.Course.exception.courseNotFoundException;
import com.lms.lms.Lecture.model.lectureModel;
import com.lms.lms.Lecture.repository.lectureRepository;
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
public class lectureController {

    @Autowired
    private lectureRepository lectureRepository;

    @Autowired
    private courseRepository courseRepository;

    @Autowired
    private Cloudinary cloudinary;

    // Get all lectures
    @GetMapping("/api/lectures")
    public List<lectureModel> getAllLectures() {
        List<lectureModel> lectures = lectureRepository.findAll();
        // Prevent circular reference in JSON
        lectures.forEach(lecture -> {
            if (lecture.getCourse() != null) {
                lecture.getCourse().setLectures(null);
            }
        });
        return lectures;
    }

    // Add a new lecture
    @PostMapping("/api/lecture")
    public ResponseEntity<lectureModel> addLecture(
            @RequestPart("lectureDetails") String lectureDetails,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestParam Long courseId
    ) throws IOException {
        // Parse lecture details from JSON
        ObjectMapper mapper = new ObjectMapper();
        lectureModel lecture = mapper.readValue(lectureDetails, lectureModel.class);

        // Link the lecture to the course
        courseModel course = courseRepository.findById(courseId)
                .orElseThrow(() -> new courseNotFoundException(courseId));
        lecture.setCourse(course);

        // Upload video to Cloudinary if provided
        if (file != null && !file.isEmpty()) {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "resource_type", "video",
                    "folder", "lecture-videos"
                )
            );

            // Get the secure URL from Cloudinary response
            String videoUrl = (String) uploadResult.get("secure_url");
            lecture.setVideoUrl(videoUrl);
        }

        // Save the lecture to the database
        lectureModel savedLecture = lectureRepository.save(lecture);
        // Prevent circular reference in JSON
        if (savedLecture.getCourse() != null) {
            savedLecture.getCourse().setLectures(null);
        }
        return new ResponseEntity<>(savedLecture, HttpStatus.CREATED);
    }

    // Get lecture by ID
    @GetMapping("/api/lecture/{id}")
    public lectureModel getLectureById(@PathVariable Long id) {
        lectureModel lecture = lectureRepository.findById(id)
                .orElseThrow(() -> new courseNotFoundException(id));
        // Prevent circular reference in JSON
        if (lecture.getCourse() != null) {
            lecture.getCourse().setLectures(null);
        }
        return lecture;
    }

    @GetMapping("/api/lecture")
    public List<lectureModel> getLecturesByCourseId(@RequestParam Long courseId) {
        List<lectureModel> lectures = lectureRepository.findByCourseId(courseId);
        // Prevent circular reference in JSON
        lectures.forEach(lecture -> {
            if (lecture.getCourse() != null) {
                lecture.getCourse().setLectures(null);
            }
        });
        return lectures;
    }

    // Update lecture
    @PutMapping("/api/lecture/{id}")
    public lectureModel updateLecture(
            @RequestPart("lectureDetails") String lectureDetails,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @PathVariable Long id
    ) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        lectureModel updatedLecture;
        try {
            updatedLecture = mapper.readValue(lectureDetails, lectureModel.class);
        } catch (Exception e) {
            throw new RuntimeException("Lecture details not valid", e);
        }

        return lectureRepository.findById(id).map(existingLecture -> {
            existingLecture.setTitle(updatedLecture.getTitle());
            existingLecture.setDuration(updatedLecture.getDuration());

            if (file != null && !file.isEmpty()) {
                try {
                    // Delete old video from Cloudinary if exists
                    String oldVideoUrl = existingLecture.getVideoUrl();
                    if (oldVideoUrl != null && !oldVideoUrl.isEmpty()) {
                        String publicId = oldVideoUrl.substring(oldVideoUrl.lastIndexOf("/") + 1, oldVideoUrl.lastIndexOf("."));
                        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                    }

                    // Upload new video to Cloudinary
                    Map<?, ?> uploadResult = cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                            "resource_type", "video",
                            "folder", "lecture-videos"
                        )
                    );

                    // Get the secure URL from Cloudinary response
                    String videoUrl = (String) uploadResult.get("secure_url");
                    existingLecture.setVideoUrl(videoUrl);

                } catch (IOException e) {
                    throw new RuntimeException("Error uploading file to Cloudinary: ", e);
                }
            }

            lectureModel savedLecture = lectureRepository.save(existingLecture);
            // Prevent circular reference in JSON
            if (savedLecture.getCourse() != null) {
                savedLecture.getCourse().setLectures(null);
            }
            return savedLecture;
        }).orElseThrow(() -> new courseNotFoundException(id));
    }

    // Delete lecture
    @DeleteMapping("/api/lecture/{id}")
    public String deleteLecture(@PathVariable Long id) throws IOException {
        lectureModel lectureItem = lectureRepository.findById(id)
                .orElseThrow(() -> new courseNotFoundException(id));

        // Delete the video from Cloudinary if exists
        String videoUrl = lectureItem.getVideoUrl();
        if (videoUrl != null && !videoUrl.isEmpty()) {
            try {
                String publicId = videoUrl.substring(videoUrl.lastIndexOf("/") + 1, videoUrl.lastIndexOf("."));
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            } catch (IOException e) {
                System.out.println("Error deleting video from Cloudinary: " + e.getMessage());
            }
        }

        // Delete the lecture from the database
        lectureRepository.deleteById(id);
        return "Lecture with id " + id + " deleted successfully";
    }
}
