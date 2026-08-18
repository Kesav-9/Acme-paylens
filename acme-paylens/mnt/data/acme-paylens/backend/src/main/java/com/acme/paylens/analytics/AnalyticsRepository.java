package com.acme.paylens.analytics;

import com.acme.paylens.employee.Employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface AnalyticsRepository
        extends JpaRepository<Employee, Long> {

    @Query("""
        SELECT COUNT(e)
        FROM Employee e
        """)
    Long employeeCount();

    @Query("""
        SELECT COALESCE(AVG(e.normalizedSalaryUsd), 0)
        FROM Employee e
        """)
    Double averageSalaryUsd();

    @Query("""
        SELECT COALESCE(SUM(e.normalizedSalaryUsd), 0)
        FROM Employee e
        """)
    BigDecimal totalPayrollUsd();

    @Query("""
        SELECT COALESCE(MAX(e.normalizedSalaryUsd), 0)
        FROM Employee e
        """)
    BigDecimal maximumSalaryUsd();

    @Query("""
        SELECT COALESCE(MIN(e.normalizedSalaryUsd), 0)
        FROM Employee e
        """)
    BigDecimal minimumSalaryUsd();

    @Query("""
        SELECT
            e.department,
            AVG(e.normalizedSalaryUsd)
        FROM Employee e
        GROUP BY e.department
        ORDER BY AVG(e.normalizedSalaryUsd) DESC
        """)
    List<Object[]> averageSalaryByDepartment();
}