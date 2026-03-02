import {useEffect, useState} from "react";
import {Button, Col, Container, Row, Table} from "react-bootstrap";

type Employee = {
    id: number;
    name: string;
    email: string;
    phone: string;
    department: string;
};

const Dashboard = () => {

    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        const fetchEmployees = async () =>{
            try{
                const response = await fetch("http://localhost:8080/api/employees");
                const data = await response.json();

                setEmployees(data);
            }catch(error){
                console.error("Chyba při hledání zaměstnanců: ", error);
            }
        }
        fetchEmployees();
    }, [])

    return (
        <>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col className="text-center">
                        <h1 className="mb-5">Zaměstnanci</h1>
                        <Table striped bordered hover responsive>
                            <thead>
                            <tr>
                                <th scope="col">Jméno</th>
                                <th scope="col">Email</th>
                                <th scope="col">Tel. číslo</th>
                                <th scope="col">Oddělení</th>
                                <th scope="col">Činnost</th>
                            </tr>
                            </thead>
                            <tbody>
                            {employees.map((employee) => (
                                <tr key={employee.id}>
                                    <td>{employee.name}</td>
                                    <td>{employee.email}</td>
                                    <td>{employee.phone}</td>
                                    <td>{employee.department}</td>
                                    <Button variant="outline-primary">Uložit</Button>{" "}
                                    <Button variant="outline-danger">Odstranit</Button>
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