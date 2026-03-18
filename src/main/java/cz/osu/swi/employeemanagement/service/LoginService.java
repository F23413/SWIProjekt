package cz.osu.swi.employeemanagement.service;

import cz.osu.swi.employeemanagement.dto.LoginRequest;
import cz.osu.swi.employeemanagement.dto.LoginResponse;
import cz.osu.swi.employeemanagement.entity.Login;
import cz.osu.swi.employeemanagement.repository.LoginRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final LoginRepository loginRepository;

    public LoginResponse authenticate(LoginRequest request) {
        Login login = loginRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (request.getPassword() == null || !request.getPassword().equals(login.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        return new LoginResponse(login.getEmail(), login.getRole());
    }
}
