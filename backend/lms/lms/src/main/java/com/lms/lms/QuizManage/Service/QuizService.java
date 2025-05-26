package com.lms.lms.QuizManage.Service;

import com.lms.lms.Course.model.courseModel;
import com.lms.lms.Course.repository.courseRepository;
import com.lms.lms.QuizManage.DTO.QuestionDTO;
import com.lms.lms.QuizManage.DTO.QuizDTO;
import com.lms.lms.QuizManage.Entity.Question;
import com.lms.lms.QuizManage.Entity.Quiz;
import com.lms.lms.QuizManage.Exception.ResourceNotFoundException;
import com.lms.lms.QuizManage.Repository.QuizRepository;
import com.lms.lms.QuizManage.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class QuizService {

    private final courseRepository courseRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;

    @Autowired
    public QuizService(QuizRepository quizRepository, QuestionRepository questionRepository, courseRepository courseRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.courseRepository = courseRepository;
    }

    @Transactional
    public QuizDTO createQuiz(QuizDTO quizDTO) {
        // Check if ID is provided or generate a new one
        if (quizDTO.getId() == null || quizDTO.getId().isEmpty()) {
            quizDTO.setId(generateUniqueQuizId());
        } else if (quizDTO.getId().length() != 6) {
            throw new IllegalArgumentException("Quiz ID must be 6 digits");
        }

        // Check if quiz with this ID already exists
        if (quizRepository.existsById(quizDTO.getId())) {
            throw new IllegalArgumentException("Quiz with ID " + quizDTO.getId() + " already exists");
        }

    
// Fetch the course from the database
courseModel course = courseRepository.findById(Long.parseLong(quizDTO.getCourseId()))
        .orElseThrow(() -> new ResourceNotFoundException("Course", "id", quizDTO.getCourseId()));

        Quiz quiz = new Quiz();
        quiz.setId(quizDTO.getId());
        quiz.setName(quizDTO.getName());
        quiz.setDifficulty(quizDTO.getDifficulty());
        quiz.setCourse(course);

        Quiz savedQuiz = quizRepository.save(quiz);

        if (quizDTO.getQuestions() != null) {
            for (QuestionDTO questionDTO : quizDTO.getQuestions()) {
                Question question = new Question();
                question.setTitle(questionDTO.getTitle());
                question.setAnswer1(questionDTO.getAnswer1());
                question.setAnswer2(questionDTO.getAnswer2());
                question.setAnswer3(questionDTO.getAnswer3());
                question.setAnswer4(questionDTO.getAnswer4());
                question.setCorrectAnswer(questionDTO.getCorrectAnswer());
                question.setQuiz(savedQuiz);
                questionRepository.save(question);
                savedQuiz.getQuestions().add(question);
            }
        }

        return convertToDTO(savedQuiz);
    }

    public QuizDTO getQuizById(String quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));

        return convertToDTO(quiz);
    }

    public boolean checkQuizExists(String quizId) {
        return quizRepository.existsById(quizId);
    }

    public String generateUniqueQuizId() {
        Random random = new Random();
        String quizId;
        boolean exists;

        do {
            int number = 100000 + random.nextInt(900000); // 6-digit number
            quizId = String.valueOf(number);
            exists = quizRepository.existsById(quizId);
        } while (exists);

        return quizId;
    }

    @Transactional
    public QuizDTO updateQuiz(String quizId, QuizDTO quizDTO) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz", "id", quizId));

        // Update basic quiz information
        quiz.setName(quizDTO.getName());
        quiz.setDifficulty(quizDTO.getDifficulty());

        // Delete all existing questions
        questionRepository.deleteAllByQuizId(quizId);
        quiz.getQuestions().clear();

        // Add new questions
        if (quizDTO.getQuestions() != null) {
            for (QuestionDTO questionDTO : quizDTO.getQuestions()) {
                Question question = new Question();
                question.setTitle(questionDTO.getTitle());
                question.setAnswer1(questionDTO.getAnswer1());
                question.setAnswer2(questionDTO.getAnswer2());
                question.setAnswer3(questionDTO.getAnswer3());
                question.setAnswer4(questionDTO.getAnswer4());
                question.setCorrectAnswer(questionDTO.getCorrectAnswer());
                question.setQuiz(quiz);

                questionRepository.save(question);
                quiz.getQuestions().add(question);
            }
        }

        Quiz updatedQuiz = quizRepository.save(quiz);
        return convertToDTO(updatedQuiz);
    }

    @Transactional
    public void deleteQuiz(String quizId) {
        if (!quizRepository.existsById(quizId)) {
            throw new ResourceNotFoundException("Quiz", "id", quizId);
        }

        // Delete questions first (can also be handled with cascade type)
        questionRepository.deleteAllByQuizId(quizId);

        // Delete the quiz
        quizRepository.deleteById(quizId);
    }

    // Helper method to convert Quiz entity to QuizDTO
    private QuizDTO convertToDTO(Quiz quiz) {
        QuizDTO quizDTO = new QuizDTO();
        quizDTO.setId(quiz.getId());
        quizDTO.setName(quiz.getName());
        quizDTO.setDifficulty(quiz.getDifficulty());

        List<QuestionDTO> questionDTOs = quiz.getQuestions().stream()
                .map(question -> {
                    QuestionDTO questionDTO = new QuestionDTO();
                    questionDTO.setId(question.getId());
                    questionDTO.setTitle(question.getTitle());
                    questionDTO.setAnswer1(question.getAnswer1());
                    questionDTO.setAnswer2(question.getAnswer2());
                    questionDTO.setAnswer3(question.getAnswer3());
                    questionDTO.setAnswer4(question.getAnswer4());
                    questionDTO.setCorrectAnswer(question.getCorrectAnswer());
                    return questionDTO;
                })
                .collect(Collectors.toList());

        quizDTO.setQuestions(questionDTOs);
        return quizDTO;
    }
}