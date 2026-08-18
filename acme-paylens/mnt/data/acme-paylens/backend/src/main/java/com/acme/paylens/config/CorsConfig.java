package com.acme.paylens.config; import org.springframework.context.annotation.*; import org.springframework.web.servlet.config.annotation.*;
@Configuration public class CorsConfig implements WebMvcConfigurer { public void addCorsMappings(CorsRegistry r){r.addMapping("/api/**").allowedOrigins("http://localhost:5173","http://localhost:3000").allowedMethods("GET","POST","PUT","DELETE");} }
