package com.lms.lms.QuizManage.Entity;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class QuestionTest {

    private Question question;
    private Quiz quiz;

    @BeforeEach
    void setUp() {
        // Initialize test data
        question = new Question();
        question.setTitle("Test Question");
        question.setAnswer1("Answer 1");
        question.setAnswer2("Answer 2");
        question.setAnswer3("Answer 3");
        question.setAnswer4("Answer 4");
        question.setCorrectAnswer(1);

        // Create test quiz
        quiz = new Quiz();
        quiz.setId("123456");
        quiz.setName("Test Quiz");
        quiz.setDifficulty("Medium");
    }

    @Test
    void testQuestionCreation() {
        assertNotNull(question);
        assertEquals("Test Question", question.getTitle());
        assertEquals("Answer 1", question.getAnswer1());
        assertEquals("Answer 2", question.getAnswer2());
        assertEquals("Answer 3", question.getAnswer3());
        assertEquals("Answer 4", question.getAnswer4());
        assertEquals(1, question.getCorrectAnswer());
        assertNull(question.getQuiz());
    }

    @Test
    void testQuestionConstructor() {
        Question constructedQuestion = new Question(
            "Constructor Question",
            "A1", "A2", "A3", "A4",
            2
        );
        assertEquals("Constructor Question", constructedQuestion.getTitle());
        assertEquals("A1", constructedQuestion.getAnswer1());
        assertEquals("A2", constructedQuestion.getAnswer2());
        assertEquals("A3", constructedQuestion.getAnswer3());
        assertEquals("A4", constructedQuestion.getAnswer4());
        assertEquals(2, constructedQuestion.getCorrectAnswer());
    }

    @Test
    void testSetAndGetQuiz() {
        question.setQuiz(quiz);
        assertEquals(quiz, question.getQuiz());
    }

    @Test
    void testSettersAndGetters() {
        // Test Title
        question.setTitle("Updated Question");
        assertEquals("Updated Question", question.getTitle());

        // Test Answers
        question.setAnswer1("Updated A1");
        assertEquals("Updated A1", question.getAnswer1());

        question.setAnswer2("Updated A2");
        assertEquals("Updated A2", question.getAnswer2());

        question.setAnswer3("Updated A3");
        assertEquals("Updated A3", question.getAnswer3());

        question.setAnswer4("Updated A4");
        assertEquals("Updated A4", question.getAnswer4());

        // Test Correct Answer
        question.setCorrectAnswer(3);
        assertEquals(3, question.getCorrectAnswer());
    }

    @Test
    void testQuestionWithQuizRelationship() {
        question.setQuiz(quiz);
        assertEquals(quiz, question.getQuiz());
        
        // Test bidirectional relationship
        quiz.addQuestion(question);
        assertTrue(quiz.getQuestions().contains(question));
        assertEquals(quiz, question.getQuiz());
    }
} 