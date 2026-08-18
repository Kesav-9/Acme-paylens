package com.acme.paylens.employee;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository
        extends JpaRepository<Employee, Long> {

    boolean existsByEmployeeNumber(String employeeNumber);

    boolean existsByEmail(String email);

    boolean existsByEmployeeNumberAndIdNot(
            String employeeNumber,
            Long id
    );

    boolean existsByEmailAndIdNot(
            String email,
            Long id
    );

    @Query("""
        SELECT e
        FROM Employee e
        WHERE (
            :search IS NULL
            OR :search = ''
            OR LOWER(e.employeeNumber) = LOWER(:search)
            OR LOWER(CONCAT(e.firstName, ' ', e.lastName))
                LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(e.firstName)
                LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(e.lastName)
                LIKE LOWER(CONCAT('%', :search, '%'))
        )
        AND (
            :department IS NULL
            OR :department = ''
            OR e.department = :department
        )
        AND (
            :country IS NULL
            OR :country = ''
            OR e.country = :country
        )
        """)
    Page<Employee> search(
            @Param("search") String search,
            @Param("department") String department,
            @Param("country") String country,
            Pageable pageable
    );
}