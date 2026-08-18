package com.acme.paylens.employee;

import java.math.BigDecimal;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record EmployeeRequest(
    @NotBlank String employeeNumber,
    @NotBlank String firstName,
    @NotBlank String lastName,

    @Email
    @NotBlank
    String email,

    @NotBlank String department,
    @NotBlank String jobTitle,
    @NotBlank String country,

    @NotNull
    @Positive
    BigDecimal salaryAmount,

    @NotBlank
    @Size(min = 3, max = 3)
    String currency,

    @NotNull
    @Positive
    BigDecimal normalizedSalaryUsd
) {}