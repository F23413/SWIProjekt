package cz.osu.swi.employeemanagement.service;

import cz.osu.swi.employeemanagement.entity.Employee;
import cz.osu.swi.employeemanagement.entity.Reservation;
import cz.osu.swi.employeemanagement.repository.EmployeeRepository;
import cz.osu.swi.employeemanagement.repository.ReservationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final EmployeeRepository employeeRepository;

    public Reservation createReservation(Long employeeId, Reservation reservation) {
        if (reservation.getBookStart() == null || reservation.getBookEnd() == null) {
            throw new IllegalArgumentException("bookStart and bookEnd are required");
        }

        if (reservation.getRoomName() == null || reservation.getRoomName().isBlank()) {
            throw new IllegalArgumentException("roomName is required");
        }

        if (!reservation.getBookStart().isBefore(reservation.getBookEnd())) {
            throw new IllegalArgumentException("bookStart must be before bookEnd");
        }

        if (reservationRepository.existsByRoomNameAndBookStartAndBookEnd(
                reservation.getRoomName(),
                reservation.getBookStart(),
                reservation.getBookEnd()
        )) {
            throw new IllegalArgumentException("This room is already reserved for the selected time");
        }

        if (reservationRepository.existsByRoomNameAndBookStartLessThanAndBookEndGreaterThan(
                reservation.getRoomName(),
                reservation.getBookEnd(),
                reservation.getBookStart()
        )) {
            throw new IllegalArgumentException("This room already has an overlapping reservation");
        }

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("Employee with id " + employeeId + " not found"));

        reservation.setId(null);
        reservation.setEmployee(employee);
        return reservationRepository.save(reservation);
    }

    public List<Reservation> getReservationsByEmployee(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new EntityNotFoundException("Employee with id " + employeeId + " not found");
        }

        return reservationRepository.findAllByEmployeeId(employeeId);
    }

    public List<Reservation> getReservations() {
        return reservationRepository.findAll();
    }

    public void deleteReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new EntityNotFoundException("Reservation with id " + id + " not found");
        }

        reservationRepository.deleteById(id);
    }
}
