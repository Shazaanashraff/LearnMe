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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @Mock
    private QuestionRepository questionRepository;

    @Mock
    private courseRepository courseRepository;

    @InjectMocks
    private QuizService quizService;

    private QuizDTO quizDTO;
    private Quiz quiz;
    private courseModel course;
    private QuestionDTO questionDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup test course
        course = new courseModel();
        course.setId(1L);
        course.setTitle("Test Course");

        // Setup test quiz
        quiz = new Quiz();
        quiz.setId("123456");
        quiz.setName("Test Quiz");
        quiz.setDifficulty("Medium");
        quiz.setCourse(course);

        // Setup test question
        Question question = new Question();
        question.setId(1L);
        question.setTitle("Test Question");
        question.setAnswer1("Answer 1");
        question.setAnswer2("Answer 2");
        question.setAnswer3("Answer 3");
        question.setAnswer4("Answer 4");
        question.setCorrectAnswer(1);
        question.setQuiz(quiz);
        quiz.getQuestions().add(question);

        // Setup test DTOs
        quizDTO = new QuizDTO();
        quizDTO.setId("123456");
        quizDTO.setName("Test Quiz");
        quizDTO.setDifficulty("Medium");
        quizDTO.setCourseId("1");

        questionDTO = new QuestionDTO();
        questionDTO.setTitle("Test Question");
        questionDTO.setAnswer1("Answer 1");
        questionDTO.setAnswer2("Answer 2");
        questionDTO.setAnswer3("Answer 3");
        questionDTO.setAnswer4("Answer 4");
        questionDTO.setCorrectAnswer(1);

        List<QuestionDTO> questions = new ArrayList<>();
        questions.add(questionDTO);
        quizDTO.setQuestions(questions);
    }

    @Test
    void testCreateQuiz_Success() {
        when(courseRepository.findById(anyLong())).thenReturn(Optional.of(course));
        when(quizRepository.existsById(anyString())).thenReturn(false);
        when(quizRepository.save(any(Quiz.class))).thenReturn(quiz);
        when(questionRepository.save(any(Question.class))).thenReturn(new Question());

        QuizDTO result = quizService.createQuiz(quizDTO);

        assertNotNull(result);
        assertEquals(quizDTO.getId(), result.getId());
        assertEquals(quizDTO.getName(), result.getName());
        assertEquals(quizDTO.getDifficulty(), result.getDifficulty());
        verify(quizRepository).save(any(Quiz.class));
    }

    @Test
    void testCreateQuiz_ExistingId() {
        when(quizRepository.existsById(anyString())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> quizService.createQuiz(quizDTO));
        verify(quizRepository, never()).save(any(Quiz.class));
    }

    @Test
    void testGetQuizById_Success() {
        when(quizRepository.findById(anyString())).thenReturn(Optional.of(quiz));

        QuizDTO result = quizService.getQuizById("123456");

        assertNotNull(result);
        assertEquals(quiz.getId(), result.getId());
        assertEquals(quiz.getName(), result.getName());
    }

    @Test
    void testGetQuizById_NotFound() {
        when(quizRepository.findById(anyString())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> quizService.getQuizById("123456"));
    }

    @Test
    void testCheckQuizExists() {
        when(quizRepository.existsById(anyString())).thenReturn(true);

        boolean exists = quizService.checkQuizExists("123456");
        assertTrue(exists);
    }

    @Test
    void testGenerateUniqueQuizId() {
        when(quizRepository.existsById(anyString())).thenReturn(false);

        String quizId = quizService.generateUniqueQuizId();
        assertNotNull(quizId);
        assertEquals(6, quizId.length());
    }

    @Test
    void testUpdateQuiz_Success() {
        when(quizRepository.findById(anyString())).thenReturn(Optional.of(quiz));
        when(quizRepository.save(any(Quiz.class))).thenReturn(quiz);
        when(questionRepository.save(any(Question.class))).thenReturn(new Question());

        QuizDTO updatedQuizDTO = new QuizDTO();
        updatedQuizDTO.setName("Updated Quiz");
        updatedQuizDTO.setDifficulty("Hard");
        updatedQuizDTO.setQuestions(new ArrayList<>());

        QuizDTO result = quizService.updateQuiz("123456", updatedQuizDTO);

        assertNotNull(result);
        assertEquals(updatedQuizDTO.getName(), result.getName());
        assertEquals(updatedQuizDTO.getDifficulty(), result.getDifficulty());
        verify(questionRepository).deleteAllByQuizId("123456");
    }

    @Test
    void testUpdateQuiz_NotFound() {
        when(quizRepository.findById(anyString())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> quizService.updateQuiz("123456", quizDTO));
    }

    @Test
    void testDeleteQuiz_Success() {
        when(quizRepository.existsById(anyString())).thenReturn(true);
        doNothing().when(questionRepository).deleteAllByQuizId(anyString());
        doNothing().when(quizRepository).deleteById(anyString());

        assertDoesNotThrow(() -> quizService.deleteQuiz("123456"));
        verify(questionRepository).deleteAllByQuizId("123456");
        verify(quizRepository).deleteById("123456");
    }

    @Test
    void testDeleteQuiz_NotFound() {
        when(quizRepository.existsById(anyString())).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> quizService.deleteQuiz("123456"));
        verify(questionRepository, never()).deleteAllByQuizId(anyString());
        verify(quizRepository, never()).deleteById(anyString());
    }
} 