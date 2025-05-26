package com.lms.lms.QuizManage.Entity;

import com.lms.lms.Course.model.courseModel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class QuizTest {

    private Quiz quiz;
    private Question question1;
    private Question question2;
    private courseModel course;

    @BeforeEach
    void setUp() {
        // Initialize test data
        quiz = new Quiz();
        quiz.setId("123456");
        quiz.setName("Test Quiz");
        quiz.setDifficulty("Medium");

        // Create test questions
        question1 = new Question();
        question1.setTitle("Question 1");
        question1.setAnswer1("Answer 1");
        question1.setAnswer2("Answer 2");
        question1.setAnswer3("Answer 3");
        question1.setAnswer4("Answer 4");
        question1.setCorrectAnswer(1);

        question2 = new Question();
        question2.setTitle("Question 2");
        question2.setAnswer1("Answer 1");
        question2.setAnswer2("Answer 2");
        question2.setAnswer3("Answer 3");
        question2.setAnswer4("Answer 4");
        question2.setCorrectAnswer(2);

        // Create test course
        course = new courseModel();
        course.setId(1L);
        course.setTitle("Test Course");
    }

    @Test
    void testQuizCreation() {
        assertNotNull(quiz);
        assertEquals("123456", quiz.getId());
        assertEquals("Test Quiz", quiz.getName());
        assertEquals("Medium", quiz.getDifficulty());
        assertNotNull(quiz.getQuestions());
        assertTrue(quiz.getQuestions().isEmpty());
    }

    @Test
    void testQuizConstructor() {
        Quiz constructedQuiz = new Quiz("654321", "Constructor Quiz", "Hard");
        assertEquals("654321", constructedQuiz.getId());
        assertEquals("Constructor Quiz", constructedQuiz.getName());
        assertEquals("Hard", constructedQuiz.getDifficulty());
    }

    @Test
    void testAddQuestion() {
        quiz.addQuestion(question1);
        assertEquals(1, quiz.getQuestions().size());
        assertEquals(question1, quiz.getQuestions().get(0));
        assertEquals(quiz, question1.getQuiz());
    }

    @Test
    void testRemoveQuestion() {
        quiz.addQuestion(question1);
        quiz.removeQuestion(question1);
        assertTrue(quiz.getQuestions().isEmpty());
        assertNull(question1.getQuiz());
    }

    @Test
    void testSetAndGetCourse() {
        quiz.setCourse(course);
        assertEquals(course, quiz.getCourse());
    }

    @Test
    void testSetAndGetQuestions() {
        List<Question> questions = new ArrayList<>();
        questions.add(question1);
        questions.add(question2);
        quiz.setQuestions(questions);
        assertEquals(2, quiz.getQuestions().size());
        assertTrue(quiz.getQuestions().contains(question1));
        assertTrue(quiz.getQuestions().contains(question2));
    }

    @Test
    void testSettersAndGetters() {
        // Test ID
        quiz.setId("789012");
        assertEquals("789012", quiz.getId());

        // Test Name
        quiz.setName("Updated Quiz");
        assertEquals("Updated Quiz", quiz.getName());

        // Test Difficulty
        quiz.setDifficulty("Easy");
        assertEquals("Easy", quiz.getDifficulty());
    }
} 