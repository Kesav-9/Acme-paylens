package com.acme.paylens.employee;
import jakarta.validation.Valid; 
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.*; 
import org.springframework.web.bind.annotation.*;
@RestController
 @RequestMapping("/api/employees") 
 public class EmployeeController { 
    private final EmployeeService service; 
    public EmployeeController(EmployeeService s){service=s;}
 @GetMapping 
 public Page<Employee> list(@RequestParam(required=false)String search,@RequestParam(required=false)String department,@RequestParam(required=false)String country,
 @PageableDefault(size=25,sort="lastName") Pageable p)
 {return service.search(search,department,country,p);} 
 @GetMapping("/{id}") 
 public Employee get(@PathVariable Long id){return service.get(id);} 
 @PostMapping public ResponseEntity<Employee> create(@Valid @RequestBody EmployeeRequest r)
 {return ResponseEntity.status(201).body(service.create(r));}
 @PutMapping("/{id}")
  public Employee update(@PathVariable Long id,@Valid @RequestBody EmployeeRequest r)
  {return service.update(id,r);} 
  @DeleteMapping("/{id}") 
  @ResponseStatus(HttpStatus.NO_CONTENT) 
  public void delete(@PathVariable Long id)
  {service.delete(id);} 
}
