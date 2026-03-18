package cz.osu.swi.employeemanagement.repository;

import cz.osu.swi.employeemanagement.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    @Query("select e from Employee e join fetch e.login")
    List<Employee> findAllWithLogin();

    @Query("select e from Employee e join fetch e.login where e.id = :id")
    Optional<Employee> findByIdWithLogin(Long id);
}
