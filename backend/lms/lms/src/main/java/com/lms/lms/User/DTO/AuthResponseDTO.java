package com.lms.lms.User.DTO;

public class AuthResponseDTO {
    private boolean success;
    private UserDTO user;
    private String message;


    // Constructors
    public AuthResponseDTO() {
        this.success = false;
    }

    public AuthResponseDTO(boolean success, UserDTO user) {
        this.success = success;
        this.user = user;

    }

    public AuthResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getters and Setters

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}