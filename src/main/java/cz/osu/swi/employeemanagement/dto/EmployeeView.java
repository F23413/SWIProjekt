package cz.osu.swi.employeemanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class EmployeeView {
    private Long id;
    private String name;
    private String phone;
    private String department;
    private String email;
}
