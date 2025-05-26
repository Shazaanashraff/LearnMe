package com.lms.lms.User.repository;

import com.lms.lms.User.Entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveUser() {
        // Create a test user
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setUserRole(User.UserRole.STUDENT);
        user.setAddress("123 Test St");
        user.setPhoneNumber("1234567890");
        user.setUserId("USER123");

        // Save the user
        User savedUser = userRepository.save(user);

        // Verify the user was saved
        assertNotNull(savedUser.getId());
        assertEquals(user.getEmail(), savedUser.getEmail());
        assertEquals(user.getFirstName(), savedUser.getFirstName());
        assertEquals(user.getLastName(), savedUser.getLastName());
    }

    @Test
    void testFindByEmail() {
        // Create and save a test user
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setUserRole(User.UserRole.STUDENT);
        user.setAddress("123 Test St");
        user.setPhoneNumber("1234567890");
        user.setUserId("USER123");
        entityManager.persist(user);
        entityManager.flush();

        // Find the user by email
        Optional<User> foundUser = userRepository.findByEmail("test@example.com");

        // Verify the user was found
        assertTrue(foundUser.isPresent());
        assertEquals(user.getEmail(), foundUser.get().getEmail());
        assertEquals(user.getFirstName(), foundUser.get().getFirstName());
    }

    @Test
    void testExistsByEmail() {
        // Create and save a test user
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setUserRole(User.UserRole.STUDENT);
        user.setAddress("123 Test St");
        user.setPhoneNumber("1234567890");
        user.setUserId("USER123");
        entityManager.persist(user);
        entityManager.flush();

        // Test existing email
        assertTrue(userRepository.existsByEmail("test@example.com"));

        // Test non-existing email
        assertFalse(userRepository.existsByEmail("nonexistent@example.com"));
    }

    @Test
    void testFindById() {
        // Create and save a test user
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setUserRole(User.UserRole.STUDENT);
        user.setAddress("123 Test St");
        user.setPhoneNumber("1234567890");
        user.setUserId("USER123");
        entityManager.persist(user);
        entityManager.flush();

        // Find the user by ID
        Optional<User> foundUser = userRepository.findById(user.getId());

        // Verify the user was found
        assertTrue(foundUser.isPresent());
        assertEquals(user.getId(), foundUser.get().getId());
        assertEquals(user.getEmail(), foundUser.get().getEmail());
    }

    @Test
    void testDeleteUser() {
        // Create and save a test user
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setUserRole(User.UserRole.STUDENT);
        user.setAddress("123 Test St");
        user.setPhoneNumber("1234567890");
        user.setUserId("USER123");
        entityManager.persist(user);
        entityManager.flush();

        // Delete the user
        userRepository.delete(user);

        // Verify the user was deleted
        assertFalse(userRepository.existsById(user.getId()));
    }

    @Test
    void testUpdateUser() {
        // Create and save a test user
        User user = new User();
        user.setEmail("test@example.com");
        user.setPassword("password123");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setUserRole(User.UserRole.STUDENT);
        user.setAddress("123 Test St");
        user.setPhoneNumber("1234567890");
        user.setUserId("USER123");
        entityManager.persist(user);
        entityManager.flush();

        // Update the user
        user.setFirstName("Updated");
        user.setLastName("Name");
        User updatedUser = userRepository.save(user);

        // Verify the user was updated
        assertEquals("Updated", updatedUser.getFirstName());
        assertEquals("Name", updatedUser.getLastName());
    }
} 