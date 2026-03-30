package cz.osu.swi.employeemanagement.repository;

import cz.osu.swi.employeemanagement.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    boolean existsByRoomNameAndBookStartAndBookEnd(String roomName, LocalDateTime bookStart, LocalDateTime bookEnd);

    boolean existsByRoomNameAndBookStartLessThanAndBookEndGreaterThan(
            String roomName,
            LocalDateTime bookEnd,
            LocalDateTime bookStart
    );

    List<Reservation> findAllByEmployeeId(Long employeeId);
}
