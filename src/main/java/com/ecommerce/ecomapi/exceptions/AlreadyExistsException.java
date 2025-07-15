package com.ecommerce.ecomapi.exceptions;

public class AlreadyExistsException extends RuntimeException{
    public AlreadyExistsException(String message) {
        super(message);
    }
}
