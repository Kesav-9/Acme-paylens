package com.acme.paylens.analytics;

import java.math.BigDecimal;

public record DepartmentSalaryResponse(
        String department,
        BigDecimal averageSalaryUsd
) {
}