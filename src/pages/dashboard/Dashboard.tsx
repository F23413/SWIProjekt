import {useEffect, useState} from "react";
import {Alert, Button, Col, Container, Row, Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import type {UserRole} from "../../auth.ts";

type Employee = {
    id: number;
    name: string;
    email: string;
    phone: string;
    department: string;
};

type DashboardProps = {
    isLoggedIn: boolean;
    role: UserRole | null;
};

const Dashboard = ({isLoggedIn, role}: DashboardProps) => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const navigate = useNavigate();
    const canManageEmployees = role === "ADM";

    useEffect(() => {
        if (!isLoggedIn) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setEmployees([]);
            return;
        }

        const fetchEmployees = async () => {
            try{
                const response = await fetch("http://localhost:8080/api/employee");
                const data = await response.json();
                setEmployees(data);
            }catch(error){
                console.error("Chyba při hledání zaměstnanců: ", error);
            }
        }

        fetchEmployees();
    }, [isLoggedIn])

    const handleDelete = async (employeeId: number) => {
        if (!canManageEmployees) {
            return;
        }

        try{
            const response = await fetch(`http://localhost:8080/api/employee/${employeeId}`,{
                method: "DELETE"
            } );

            if(response.ok){
                setEmployees((prevEmployees) =>
                    prevEmployees.filter((employee)=> employee.id !== employeeId)
                )
            }

            console.log(`Zaměstnanec s ID: ${employeeId} byl odstraněn`);
        }catch(error){
            console.error("Nastala chyba s odstraňováním: ",error);
        }
    }

    const handleUpdate = (employeeId: number) => {
        if (!canManageEmployees) {
            return;
        }

        navigate(`/employee/${employeeId}`);
    }

    if (!isLoggedIn) {
        return (
            <Container className="mt-5">
                <Alert variant="warning">Pro zobrazení seznamu zaměstnanců se musíte nejdřív přihlásit.</Alert>
            </Container>
        );
    }

    return (
        <>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col>
                        <h1 className="mb-5">Zaměstnanci</h1>
                        <Table striped bordered hover responsive>
                            <thead className="table-primary">
                            <tr>
                                <th scope="col" className="w-100">Jméno</th>
                                <th scope="col">Email</th>
                                <th scope="col" className="text-nowrap ">Tel. číslo</th>
                                <th scope="col">Oddělení</th>
                                <th scope="col" className="text-nowrap">Činnost</th>
                            </tr>
                            </thead>
                            <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.department}</td>
                                    <td className="gap-1 d-flex text-nowrap">
                                        <Button
                                            variant="outline-primary"
                                            disabled={!canManageEmployees}
                                            onClick={()=>handleUpdate(employee.id)}
                                        >
                                            Upravit
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            disabled={!canManageEmployees}
                                            onClick={()=>handleDelete(employee.id)}
                                        >
                                            Odstranit
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Dashboard;
