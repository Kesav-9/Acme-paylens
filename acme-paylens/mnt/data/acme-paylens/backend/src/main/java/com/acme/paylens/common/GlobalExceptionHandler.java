package com.acme.paylens.common;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(
            ConflictException ex
    ) {

        Map<String, Object> body =
                new LinkedHashMap<>();

        body.put(
                "status",
                HttpStatus.CONFLICT.value()
        );

        body.put(
                "error",
                "CONFLICT"
        );

        body.put(
                "message",
                ex.getMessage()
        );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(body);
    }


    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleValidation(
            MethodArgumentNotValidException ex
    ) {

        Map<String, String> fields =
                new LinkedHashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        fields.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );


        Map<String, Object> body =
                new LinkedHashMap<>();

        body.put(
                "status",
                HttpStatus.BAD_REQUEST.value()
        );

        body.put(
                "error",
                "VALIDATION_ERROR"
        );

        body.put(
                "message",
                "Request validation failed."
        );

        body.put(
                "fields",
                fields
        );


        return ResponseEntity
                .badRequest()
                .body(body);
    }


    @ExceptionHandler(
            DataIntegrityViolationException.class
    )
    public ResponseEntity<Map<String, Object>>
    handleDatabaseConflict(
            DataIntegrityViolationException ex
    ) {

        Map<String, Object> body =
                new LinkedHashMap<>();

        body.put(
                "status",
                HttpStatus.CONFLICT.value()
        );

        body.put(
                "error",
                "DATA_CONFLICT"
        );

        body.put(
                "message",
                "Employee number or email already exists."
        );


        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(body);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>>
    handleUnexpectedException(
            Exception ex
    ) {

        ex.printStackTrace();


        Map<String, Object> body =
                new LinkedHashMap<>();

        body.put(
                "status",
                HttpStatus.INTERNAL_SERVER_ERROR.value()
        );

        body.put(
                "error",
                "INTERNAL_SERVER_ERROR"
        );

        body.put(
                "message",
                "An unexpected server error occurred."
        );


        return ResponseEntity
                .status(
                        HttpStatus.INTERNAL_SERVER_ERROR
                )
                .body(body);
    }
}