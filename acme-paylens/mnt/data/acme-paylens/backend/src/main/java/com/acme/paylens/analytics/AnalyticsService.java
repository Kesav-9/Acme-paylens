package com.acme.paylens.analytics; 
 
import org.springframework.stereotype.Service; 
 
import java.math.BigDecimal; 
import java.util.List; 
 
@Service 
public class AnalyticsService { 
 
    private final AnalyticsRepository repository; 
 
    public AnalyticsService( 
            AnalyticsRepository repository 
    ) { 
        this.repository = repository; 
    } 
 
    public SummaryResponse getSummary() { 
 
        Double average = 
                repository.averageSalaryUsd(); 
 
        return new SummaryResponse( 
                repository.employeeCount(), 
                repository.totalPayrollUsd(), 
                BigDecimal.valueOf( 
                        average == null ? 0 : average 
                ), 
                repository.minimumSalaryUsd(), 
                repository.maximumSalaryUsd() 
        ); 
    } 
 
    public List<DepartmentSalaryResponse> 
    getDepartmentAnalytics() { 
 
        return repository 
                .averageSalaryByDepartment() 
                .stream() 
                .map(row -> { 
 
                    String department = 
                            (String) row[0]; 
 
                    Number average = 
                            (Number) row[1]; 
 
                    return new DepartmentSalaryResponse( 
                            department, 
                            BigDecimal.valueOf( 
                                    average.doubleValue() 
                            ) 
                    ); 
                }) 
                .toList(); 
    } 
} 