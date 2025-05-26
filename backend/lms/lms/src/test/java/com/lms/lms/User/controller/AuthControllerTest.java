package com.lms.lms.User.controller;

import com.lms.lms.User.DTO.*;
import com.lms.lms.User.Entity.User;
import com.lms.lms.User.Service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private AuthController authController;

    private UserDTO userDTO;
    private SignupRequestDTO signupRequest;
    private LoginRequestDTO loginRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Setup user DTO
        userDTO = new UserDTO();
        userDTO.setId(1L);
        userDTO.setEmail("test@example.com");
        userDTO.setFirstName("John");
        userDTO.setLastName("Doe");
        userDTO.setUserRole(User.UserRole.STUDENT);
        userDTO.setAddress("123 Test St");
        userDTO.setPhoneNumber("1234567890");
        userDTO.setUserId("USER123");

        // Setup signup request
        signupRequest = new SignupRequestDTO();
        signupRequest.setEmail("new@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setFirstName("Jane");
        signupRequest.setLastName("Smith");
        signupRequest.setUserRole(User.UserRole.TEACHER);
        signupRequest.setAddress("456 Test Ave");
        signupRequest.setPhoneNumber("9876543210");
        signupRequest.setUserId("USER456");

        // Setup login request
        loginRequest = new LoginRequestDTO();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");
        loginRequest.setUserId("USER123");
    }

    @Test
    void testSignup_Success() {
        when(userService.registerUser(any(SignupRequestDTO.class))).thenReturn(userDTO);

        ResponseEntity<AuthResponseDTO> response = authController.signup(signupRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        assertNotNull(response.getBody().getUser());
        assertEquals(userDTO.getEmail(), response.getBody().getUser().getEmail());
    }

    @Test
    void testSignup_Failure() {
        when(userService.registerUser(any(SignupRequestDTO.class)))
            .thenThrow(new RuntimeException("Email already exists"));

        ResponseEntity<AuthResponseDTO> response = authController.signup(signupRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Email already exists", response.getBody().getMessage());
    }

    @Test
    void testLogin_Success() {
        when(userService.loginUser(any(LoginRequestDTO.class))).thenReturn(userDTO);

        ResponseEntity<AuthResponseDTO> response = authController.login(loginRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        assertNotNull(response.getBody().getUser());
        assertEquals(userDTO.getEmail(), response.getBody().getUser().getEmail());
    }

    @Test
    void testLogin_Failure() {
        when(userService.loginUser(any(LoginRequestDTO.class)))
            .thenThrow(new RuntimeException("Invalid credentials"));

        ResponseEntity<AuthResponseDTO> response = authController.login(loginRequest);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
        assertEquals("Invalid credentials", response.getBody().getMessage());
    }

    @Test
    void testGetProfile_Success() {
        when(userService.getUserById(anyLong())).thenReturn(userDTO);

        ResponseEntity<UserDTO> response = authController.getProfile(1L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(userDTO.getEmail(), response.getBody().getEmail());
    }

    @Test
    void testGetProfile_Failure() {
        when(userService.getUserById(anyLong()))
            .thenThrow(new RuntimeException("User not found"));

        ResponseEntity<UserDTO> response = authController.getProfile(1L);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void testGetAllUsers_Success() {
        List<UserDTO> users = Arrays.asList(userDTO);
        when(userService.getAllUsers()).thenReturn(users);

        ResponseEntity<List<UserDTO>> response = authController.getAllUsers();

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        assertEquals(userDTO.getEmail(), response.getBody().get(0).getEmail());
    }

    @Test
    void testGetAllUsers_Failure() {
        when(userService.getAllUsers())
            .thenThrow(new RuntimeException("Error fetching users"));

        ResponseEntity<List<UserDTO>> response = authController.getAllUsers();

        assertNotNull(response);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void testUpdateProfile_Success() {
        when(userService.updateUser(anyLong(), any(UserDTO.class))).thenReturn(userDTO);

        ResponseEntity<UserDTO> response = authController.updateProfile(1L, userDTO);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(userDTO.getEmail(), response.getBody().getEmail());
    }

    @Test
    void testUpdateProfile_Failure() {
        when(userService.updateUser(anyLong(), any(UserDTO.class)))
            .thenThrow(new RuntimeException("User not found"));

        ResponseEntity<UserDTO> response = authController.updateProfile(1L, userDTO);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void testDeleteProfile_Success() {
        doNothing().when(userService).deleteUser(anyLong());

        ResponseEntity<?> response = authController.deleteProfile(1L);

        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("User deleted successfully.", response.getBody());
    }

    @Test
    void testDeleteProfile_Failure() {
        doThrow(new RuntimeException("User not found")).when(userService).deleteUser(anyLong());

        ResponseEntity<?> response = authController.deleteProfile(1L);

        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Error deleting user: User not found", response.getBody());
    }
} 