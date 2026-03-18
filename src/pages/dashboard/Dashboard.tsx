import {useEffect, useState} from "react";
import {Button, Col, Container, Row, Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";


type Employee = {
    id: number;
    name: string;
    email: string;
    phone: string;
    department: string;
};

const Dashboard = () => {

    const [employees, setEmployees] = useState<Employee[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () =>{
            try{
                const response = await fetch("http://localhost:8080/api/employee");
                const data = await response.json();
                setEmployees(data);
            }catch(error){
                console.error("Chyba při hledání zaměstnanců: ", error);
            }}
        fetchEmployees();
    }, [])
    const handleDelete = async (employeeId: number)=>{
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
        navigate(`/employee/${employeeId}`);
    }

    return (
        <>
            <Container className="mt-5">
                <Row className="justify-content-center">
                    <Col className="">
                        <h1 className="mb-5">Zaměstnanci</h1>
                        <Table striped bordered hover responsive>
                            <thead className="table-primary">
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
                                    <td className="gap-1 d-flex">
                                    <Button variant="outline-primary" onClick={()=>handleUpdate(employee.id)}>Upravit</Button>
                                    <Button variant="outline-danger" onClick={()=>handleDelete(employee.id)}>Odstranit</Button>
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