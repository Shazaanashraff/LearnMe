package com.lms.lms.User.DTO;


import com.lms.lms.User.Entity.User;

public class SignupRequestDTO {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private User.UserRole userRole;
    private String address;
    private String phoneNumber;
    private String userId;

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public com.lms.lms.User.Entity.User.UserRole getUserRole() {
        return userRole;
    }

    public void setUserRole(com.lms.lms.User.Entity.User.UserRole userRole) {
        this.userRole = userRole;
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

}
