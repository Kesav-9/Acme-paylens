package com.acme.paylens.employee;
import jakarta.persistence.*; import java.math.BigDecimal; import java.time.Instant;
@Entity @Table(name="employees", indexes={@Index(name="idx_emp_department",columnList="department"),@Index(name="idx_emp_country",columnList="country"),@Index(name="idx_emp_salary",columnList="normalized_salary_usd")})
public class Employee {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
 @Column(name="employee_number",unique=true,nullable=false) private String employeeNumber;
 @Column(name="first_name",nullable=false) private String firstName; @Column(name="last_name",nullable=false) private String lastName;
 @Column(unique=true,nullable=false) private String email; @Column(nullable=false) private String department; @Column(nullable=false) private String jobTitle;
 @Column(nullable=false) private String country; @Column(name="salary_amount",precision=19,scale=2,nullable=false) private BigDecimal salaryAmount;
 @Column(length=3,nullable=false) private String currency; @Column(name="normalized_salary_usd",precision=19,scale=2,nullable=false) private BigDecimal normalizedSalaryUsd;
 @Column(nullable=false,updatable=false) private Instant createdAt; @Column(nullable=false) private Instant updatedAt;
 @PrePersist void prePersist(){createdAt=Instant.now();updatedAt=createdAt;} @PreUpdate void preUpdate(){updatedAt=Instant.now();}
 public Long getId(){return id;} public void setId(Long v){id=v;} public String getEmployeeNumber(){return employeeNumber;} public void setEmployeeNumber(String v){employeeNumber=v;}
 public String getFirstName(){return firstName;} public void setFirstName(String v){firstName=v;} public String getLastName(){return lastName;} public void setLastName(String v){lastName=v;}
 public String getEmail(){return email;} public void setEmail(String v){email=v;} public String getDepartment(){return department;} public void setDepartment(String v){department=v;}
 public String getJobTitle(){return jobTitle;} public void setJobTitle(String v){jobTitle=v;} public String getCountry(){return country;} public void setCountry(String v){country=v;}
 public BigDecimal getSalaryAmount(){return salaryAmount;} public void setSalaryAmount(BigDecimal v){salaryAmount=v;} public String getCurrency(){return currency;} public void setCurrency(String v){currency=v;}
 public BigDecimal getNormalizedSalaryUsd(){return normalizedSalaryUsd;} public void setNormalizedSalaryUsd(BigDecimal v){normalizedSalaryUsd=v;} public Instant getCreatedAt(){return createdAt;} public Instant getUpdatedAt(){return updatedAt;}
}
