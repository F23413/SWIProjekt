package cz.osu.swi.employeemanagement.controller;

import cz.osu.swi.employeemanagement.entity.Reservation;
import cz.osu.swi.employeemanagement.service.ReservationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping("/employee/{employeeId}/reservation")
    public ResponseEntity<?> createReservation(@PathVariable Long employeeId, @RequestBody Reservation reservation) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(reservationService.createReservation(employeeId, reservation));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/employee/{employeeId}/reservation")
    public ResponseEntity<?> getEmployeeReservations(@PathVariable Long employeeId) {
        try {
            return ResponseEntity.ok(reservationService.getReservationsByEmployee(employeeId));
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping("/reservation")
    public List<Reservation> getReservations() {
        return reservationService.getReservations();
    }

    @DeleteMapping("/reservation/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        try {
            reservationService.deleteReservation(id);
            return ResponseEntity.ok("reservation deleted " + id);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
