package com.lms.lms.Course.exception;

public class courseNotFoundException extends RuntimeException {
 public courseNotFoundException(Long id) {
     super("course " + id + " not found");
 }
 public courseNotFoundException(String message){
     super(message);
 }
}
