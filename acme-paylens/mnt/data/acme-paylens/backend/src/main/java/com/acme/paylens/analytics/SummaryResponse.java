package com.acme.paylens.analytics;

import java.math.BigDecimal;

public record SummaryResponse(
        Long employeeCount,
        BigDecimal totalPayrollUsd,
        BigDecimal averageSalaryUsd,
        BigDecimal minimumSalaryUsd,
        BigDecimal maximumSalaryUsd
) {
}