package com.acme.paylens.common;

public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}