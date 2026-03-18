package cz.osu.swi.employeemanagement.service;

import cz.osu.swi.employeemanagement.dto.EmployeeView;
import cz.osu.swi.employeemanagement.entity.Employee;
import cz.osu.swi.employeemanagement.repository.EmployeeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public Employee postEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public List<EmployeeView> getEmployees() {
        return employeeRepository.findAllWithLogin()
                .stream()
                .map(this::toView)
                .toList();
    }

    public void deleteEmployee(Long id) {
        if(!employeeRepository.existsById(id)){
            throw new EntityNotFoundException("Employee with id " + id + " not found");
        }

        employeeRepository.deleteById(id);
    }

    public EmployeeView getEmployeeByID(Long id) {
        return employeeRepository.findByIdWithLogin(id)
                .map(this::toView)
                .orElse(null);
    }

    public Employee updateEmployee(Long id, Employee employee) {
        Optional<Employee> employeeOptional = employeeRepository.findById(id);
        if(employeeOptional.isPresent()){
            Employee existingEmployee = employeeOptional.get();
            existingEmployee.setName(employee.getName());
            existingEmployee.setPhone(employee.getPhone());
            existingEmployee.setDepartment(employee.getDepartment());

            return employeeRepository.save(existingEmployee);
        }
        return null;
    }

    private EmployeeView toView(Employee employee) {
        return new EmployeeView(
                employee.getId(),
                employee.getName(),
                employee.getPhone(),
                employee.getDepartment(),
                employee.getLogin().getEmail()
        );
    }

}
