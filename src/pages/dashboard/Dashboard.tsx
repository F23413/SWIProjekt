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

    /*useEffect(() => {
        const fetchEmployees = async () =>{
            try{
                const response = await fetch("http://localhost:8080/api/employees");
                const data = await response.json();
                setEmployees(data);
            }catch(error){
                console.error("Chyba při hledání zaměstnanců: ", error);
            }}fetchEmployees();
    }, [])*/

    useEffect(() => {
        const fetchEmployees = async () => {
            const staticData: Employee[] = [
                {
                    id: 1,
                    name: "bob",
                    email: "dan@mama.com",
                    phone: "007",
                    department: "www"
                },
                {
                    id: 2,
                    name: "Pavel Suk",
                    email: "pavel.suk@wisnet.cz",
                    phone: "777738110",
                    department: "Wisnet"
                }
            ];

            setEmployees(staticData);
        };

        fetchEmployees();
    }, []);

    /*const handleDelete = async (employeeId: number)=>{
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
    }*/

    const handleDelete = (employeeId: number) => {
        setEmployees(prevEmployees =>
            prevEmployees.filter(emp => emp.id !== employeeId)
        );

        console.log(`Zaměstnanec s ID: ${employeeId} byl odstraněn`);
    };

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
                                    <Button variant="outline-success">Aktualizovat</Button>
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