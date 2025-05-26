package com.lms.lms.QuizManage.Cotroller;

import com.lms.lms.QuizManage.DTO.AttemptQuizDTO;
import com.lms.lms.QuizManage.DTO.QuizDTO;
import com.lms.lms.QuizManage.Entity.Quiz;
import com.lms.lms.QuizManage.Repository.QuizRepository;
import com.lms.lms.QuizManage.Service.QuizService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class QuizControllerTest {

    @Mock
    private QuizService quizService;

    @Mock
    private QuizRepository quizRepository;

    @InjectMocks
    private QuizController quizController;

    private Quiz quiz;
    private QuizDTO quizDTO;
    private AttemptQuizDTO attemptQuizDTO;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Initialize test data
        quiz = new Quiz();
        quiz.setId("123456");
        quiz.setName("Test Quiz");
        quiz.setDifficulty("Easy");

        quizDTO = new QuizDTO();
        quizDTO.setId("123456");
        quizDTO.setName("Test Quiz");
        quizDTO.setDifficulty("Easy");

        attemptQuizDTO = new AttemptQuizDTO();
        attemptQuizDTO.setQuizId("123456");
    }

    @Test
    void testCreateQuiz_Success() {
        when(quizService.createQuiz(any(QuizDTO.class))).thenReturn(quizDTO);

        ResponseEntity<QuizDTO> response = quizController.createQuiz(quizDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(quizDTO, response.getBody());
        verify(quizService).createQuiz(quizDTO);
    }

    @Test
    void testGetQuizById_Success() {
        when(quizService.getQuizById("123456")).thenReturn(quizDTO);

        ResponseEntity<QuizDTO> response = quizController.getQuizById("123456");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(quizDTO, response.getBody());
        verify(quizService).getQuizById("123456");
    }

    @Test
    void testValidateQuizId_Success() {
        when(quizService.checkQuizExists("123456")).thenReturn(true);

        ResponseEntity<Boolean> response = quizController.validateQuizId(attemptQuizDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());
        verify(quizService).checkQuizExists("123456");
    }

    @Test
    void testValidateQuizId_NotFound() {
        when(quizService.checkQuizExists("123456")).thenReturn(false);

        ResponseEntity<Boolean> response = quizController.validateQuizId(attemptQuizDTO);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertFalse(response.getBody());
        verify(quizService).checkQuizExists("123456");
    }

    @Test
    void testGenerateQuizId_Success() {
        when(quizService.generateUniqueQuizId()).thenReturn("123456");

        ResponseEntity<String> response = quizController.generateQuizId();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("123456", response.getBody());
        verify(quizService).generateUniqueQuizId();
    }

    @Test
    void testGetQuizzesByCourseId_Success() {
        List<Quiz> quizzes = new ArrayList<>();
        quizzes.add(quiz);
        when(quizRepository.findByCourseId(1L)).thenReturn(quizzes);

        ResponseEntity<List<Quiz>> response = quizController.getQuizzesByCourseId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(quizzes, response.getBody());
        verify(quizRepository).findByCourseId(1L);
    }

    @Test
    void testGetQuizzesByCourseId_Empty() {
        when(quizRepository.findByCourseId(1L)).thenReturn(new ArrayList<>());

        ResponseEntity<List<Quiz>> response = quizController.getQuizzesByCourseId(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isEmpty());
        verify(quizRepository).findByCourseId(1L);
    }
} 