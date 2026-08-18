package com.acme.paylens.analytics;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "http://localhost:3000")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(
            AnalyticsService service
    ) {
        this.service = service;
    }

    @GetMapping("/summary")
    public SummaryResponse summary() {
        return service.getSummary();
    }

    @GetMapping("/departments")
    public List<DepartmentSalaryResponse>
    departments() {
        return service.getDepartmentAnalytics();
    }
}