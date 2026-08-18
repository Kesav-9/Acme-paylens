package com.acme.paylens.employee;
import org.junit.jupiter.api.*;
 import java.math.*; 
 import java.util.*; 
 import static org.junit.jupiter.api.Assertions.*; 
 import static org.mockito.Mockito.*;
class EmployeeServiceTest { 
    EmployeeRepository repo; EmployeeService service; 
    @BeforeEach void setup(){repo=mock(EmployeeRepository.class);
        service=new EmployeeService(repo);} 
        @Test void getThrowsWhenMissing()
        {
            when(repo.findById(99L)).thenReturn(Optional.empty());
            assertThrows(RuntimeException.class,()->service.get(99L));
        }
 @Test void createsEmployee(){
    EmployeeRequest r=new EmployeeRequest("ACME-1","A","B",
    "a@b.com","Engineering","Engineer","USA",new BigDecimal("100000"),
    "USD",new BigDecimal("100000"));when(repo.save(any())).thenAnswer(i->i.getArgument(0));
    Employee e=service.create(r);assertEquals(new BigDecimal("100000"),e.getSalaryAmount());assertEquals("USD",e.getCurrency());
}
}
