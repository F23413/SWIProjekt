import "./Reservation.css";
import {useEffect, useState} from "react";
import {Alert, Button, Card, Col, Container, Form, Row, Spinner, Table} from "react-bootstrap";
import type {AuthState} from "../../auth.ts";

const API_BASE_URL = "http://localhost:8080/api";

type ReservationProps = {
    authState: AuthState;
};

type ReservationRecord = {
    id: number;
    roomName?: string;
    room_name?: string;
    bookStart?: string;
    book_start?: string;
    bookEnd?: string;
    book_end?: string;
    employeeId?: number;
    employee_id?: number;
};

type EmployeeRecord = {
    id: number;
    email: string;
};

type ReservationFormState = {
    roomName: string;
    bookStart: string;
    bookEnd: string;
};

const initialFormState: ReservationFormState = {
    roomName: "",
    bookStart: "",
    bookEnd: ""
};

const formatReservationDate = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return new Intl.DateTimeFormat("cs-CZ", {
        dateStyle: "medium",
        timeStyle: "short"
    }).format(date);
};

const normalizeRoomName = (value: string) => value.trim().toLowerCase();

const getReservationRoomName = (reservation: ReservationRecord) => reservation.roomName ?? reservation.room_name ?? "";

const getReservationBookStart = (reservation: ReservationRecord) => reservation.bookStart ?? reservation.book_start ?? "";

const getReservationBookEnd = (reservation: ReservationRecord) => reservation.bookEnd ?? reservation.book_end ?? "";

const hasOverlap = (candidateStart: string, candidateEnd: string, reservation: ReservationRecord) => {
    const start = new Date(candidateStart).getTime();
    const end = new Date(candidateEnd).getTime();
    const existingStart = new Date(getReservationBookStart(reservation)).getTime();
    const existingEnd = new Date(getReservationBookEnd(reservation)).getTime();

    return start < existingEnd && end > existingStart;
};

const Reservation = ({authState}: ReservationProps) => {
    const [employeeId, setEmployeeId] = useState<number | null>(authState.employeeId);
    const [formData, setFormData] = useState<ReservationFormState>(initialFormState);
    const [allReservations, setAllReservations] = useState<ReservationRecord[]>([]);
    const [userReservations, setUserReservations] = useState<ReservationRecord[]>([]);
    const [feedback, setFeedback] = useState<{message: string; variant: "success" | "danger" | "warning"} | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const resolveEmployeeId = async () => {
            if (authState.employeeId) {
                return authState.employeeId;
            }

            const employeeResponse = await fetch(`${API_BASE_URL}/employee`);

            if (!employeeResponse.ok) {
                throw new Error("Nepodarilo se nacist seznam zamestnancu.");
            }

            const employees: EmployeeRecord[] = await employeeResponse.json();
            const matchingEmployee = employees.find((employee) => employee.email === authState.email);

            if (!matchingEmployee) {
                throw new Error("K prihlasenemu uctu se nepodarilo dohledat zamestnance.");
            }

            return matchingEmployee.id;
        };

        const loadReservations = async () => {
            if (!authState.isLoggedIn) {
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            setFeedback(null);

            try {
                const resolvedEmployeeId = await resolveEmployeeId();
                setEmployeeId(resolvedEmployeeId);

                const [allResponse, userResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/reservation`),
                    fetch(`${API_BASE_URL}/employee/${resolvedEmployeeId}/reservation`)
                ]);

                if (!allResponse.ok || !userResponse.ok) {
                    throw new Error("Nepodarilo se nacist rezervace.");
                }

                const [allData, userData] = await Promise.all([
                    allResponse.json() as Promise<ReservationRecord[]>,
                    userResponse.json() as Promise<ReservationRecord[]>
                ]);

                setAllReservations(allData);
                setUserReservations(userData);
            } catch (error) {
                console.error("Chyba pri nacitani rezervaci:", error);
                setFeedback({
                    message: error instanceof Error ? error.message : "Nepodarilo se nacist rezervace.",
                    variant: "danger"
                });
            } finally {
                setIsLoading(false);
            }
        };

        void loadReservations();
    }, [authState.email, authState.employeeId, authState.isLoggedIn]);

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const {name, value} = event.target;

        setFormData((currentState) => ({
            ...currentState,
            [name]: value
        }));
    };

    const refreshReservations = async (resolvedEmployeeId: number) => {
        const [allResponse, userResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/reservation`),
            fetch(`${API_BASE_URL}/employee/${resolvedEmployeeId}/reservation`)
        ]);

        if (!allResponse.ok || !userResponse.ok) {
            throw new Error("Rezervace byla vytvorena, ale nepodarilo se obnovit prehled.");
        }

        const [allData, userData] = await Promise.all([
            allResponse.json() as Promise<ReservationRecord[]>,
            userResponse.json() as Promise<ReservationRecord[]>
        ]);

        setAllReservations(allData);
        setUserReservations(userData);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFeedback(null);

        if (!employeeId) {
            setFeedback({
                message: "Prihlaseny uzivatel nema dostupne employee ID.",
                variant: "danger"
            });
            return;
        }

        const trimmedRoomName = formData.roomName.trim();

        if (!trimmedRoomName || !formData.bookStart || !formData.bookEnd) {
            setFeedback({
                message: "Vyplnte mistnost, zacatek i konec rezervace.",
                variant: "warning"
            });
            return;
        }

        if (new Date(formData.bookStart) >= new Date(formData.bookEnd)) {
            setFeedback({
                message: "Konec rezervace musi byt pozdeji nez zacatek.",
                variant: "warning"
            });
            return;
        }

        const conflictingReservation = allReservations.find((reservation) =>
            normalizeRoomName(getReservationRoomName(reservation)) === normalizeRoomName(trimmedRoomName) &&
            hasOverlap(formData.bookStart, formData.bookEnd, reservation)
        );

        if (conflictingReservation) {
            setFeedback({
                message: `Mistnost ${trimmedRoomName} je v tomto case uz rezervovana.`,
                variant: "danger"
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/employee/${employeeId}/reservation`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    roomName: trimmedRoomName,
                    bookStart: formData.bookStart,
                    bookEnd: formData.bookEnd
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Rezervaci se nepodarilo vytvorit.");
            }

            await refreshReservations(employeeId);
            setFormData(initialFormState);
            setFeedback({
                message: `Rezervace mistnosti ${trimmedRoomName} byla potvrzena.`,
                variant: "success"
            });
        } catch (error) {
            console.error("Chyba pri vytvareni rezervace:", error);
            setFeedback({
                message: error instanceof Error ? error.message : "Rezervaci se nepodarilo vytvorit.",
                variant: "danger"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="reservation-page py-5">
            <Container>
                <Row className="g-4">
                    <Col lg={5}>
                        <Card className="reservation-card">
                            <Card.Body className="p-4">
                                <h1 className="h3 mb-3">Rezervace mistnosti</h1>
                                <p className="text-muted mb-4">
                                    Zadejte nazev mistnosti a cas rezervace. Pokud uz ve stejnem case existuje jina rezervace,
                                    formular ji odmitne.
                                </p>

                                {feedback && <Alert variant={feedback.variant}>{feedback.message}</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="reservationRoomName">
                                        <Form.Label>Nazev mistnosti</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="roomName"
                                            value={formData.roomName}
                                            onChange={handleInputChange}
                                            placeholder="Napriklad Zasedacka A"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="reservationBookStart">
                                        <Form.Label>Zacatek rezervace</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            name="bookStart"
                                            value={formData.bookStart}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-4" controlId="reservationBookEnd">
                                        <Form.Label>Konec rezervace</Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            name="bookEnd"
                                            value={formData.bookEnd}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>

                                    <Button type="submit" className="w-100" disabled={isSubmitting || isLoading}>
                                        {isSubmitting ? "Odesilam rezervaci..." : "Vytvorit rezervaci"}
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={7}>
                        <Card className="reservation-list-card">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h2 className="h4 mb-1">Moje rezervace</h2>
                                        <p className="text-muted mb-0">Prehled rezervaci prihlaseneho uzivatele.</p>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="py-5 text-center">
                                        <Spinner animation="border" role="status" />
                                    </div>
                                ) : userReservations.length === 0 ? (
                                    <Alert variant="light" className="mb-0">
                                        Zatim nemate zadnou rezervaci.
                                    </Alert>
                                ) : (
                                    <Table striped hover responsive>
                                        <thead className="table-primary">
                                        <tr>
                                            <th>Mistnost</th>
                                            <th>Zacatek</th>
                                            <th>Konec</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {userReservations.map((reservation) => (
                                            <tr key={reservation.id}>
                                                <td className="reservation-table-cell">{getReservationRoomName(reservation)}</td>
                                                <td className="reservation-table-cell">{formatReservationDate(getReservationBookStart(reservation))}</td>
                                                <td className="reservation-table-cell">{formatReservationDate(getReservationBookEnd(reservation))}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default Reservation;
