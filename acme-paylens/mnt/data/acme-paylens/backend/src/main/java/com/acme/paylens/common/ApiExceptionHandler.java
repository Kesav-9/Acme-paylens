package com.acme.paylens.common;
import org.springframework.http.*; import org.springframework.web.bind.MethodArgumentNotValidException; import org.springframework.web.bind.annotation.*; import java.time.Instant; import java.util.*;
@RestControllerAdvice public class ApiExceptionHandler {
 @ExceptionHandler(NotFoundException.class) ResponseEntity<?> nf(NotFoundException e){return ResponseEntity.status(404).body(Map.of("timestamp",Instant.now(),"status",404,"error","NOT_FOUND","message",e.getMessage()));}
 @ExceptionHandler(MethodArgumentNotValidException.class) ResponseEntity<?> validation(MethodArgumentNotValidException e){Map<String,String> f=new LinkedHashMap<>();e.getBindingResult().getFieldErrors().forEach(x->f.put(x.getField(),x.getDefaultMessage()));Map<String,Object> b=new LinkedHashMap<>();b.put("timestamp",Instant.now());b.put("status",400);b.put("error","VALIDATION_ERROR");b.put("fields",f);return ResponseEntity.badRequest().body(b);}
}
