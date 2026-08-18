package com.acme.paylens.employee;
import com.acme.paylens.common.NotFoundException; 
import org.springframework.data.domain.*; 
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service 
public class EmployeeService {
     private final EmployeeRepository repo; public EmployeeService(EmployeeRepository r){repo=r;}
 @Transactional(readOnly=true)
  public Page<Employee> search(String s,String d,String c,Pageable p)
  {return repo.search(blank(s),blank(d),blank(c),p);} 
 @Transactional(readOnly=true) 
 public Employee get(Long id)
 {return repo.findById(id).orElseThrow(()->new NotFoundException("Employee not found: "+id));}
 @Transactional 
 public Employee create(EmployeeRequest r)
 {Employee e=new Employee(); apply(e,r); return repo.save(e);} @Transactional public Employee update(Long id,EmployeeRequest r){Employee e=get(id);apply(e,r);return repo.save(e);} 
 @Transactional 
 public void delete(Long id){repo.delete(get(id));}
 private void apply(Employee e,EmployeeRequest r)
 {
    e.setEmployeeNumber(r.employeeNumber());
    e.setFirstName(r.firstName());
    e.setLastName(r.lastName());
    e.setEmail(r.email());
    e.setDepartment(r.department());
    e.setJobTitle(r.jobTitle());
    e.setCountry(r.country());
    e.setSalaryAmount(r.salaryAmount());
    e.setCurrency(r.currency().toUpperCase());e.setNormalizedSalaryUsd(r.normalizedSalaryUsd());
}
 private String blank(String v)
 {return v==null||v.isBlank()?null:v;}
}
