import './UpdateUser.css';
import {useEffect, useState} from "react";
import {Button, FloatingLabel, Form} from "react-bootstrap";
import {useParams, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";

const UpdateUser = ()=>{
    const {id} = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        department: ""
    })
    // event má implicitně typ any, noImplicitAny: true je chyba
    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event)=> {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    useEffect(() => {

        const fetchEmployee = async () =>{
            try{
            const response = await fetch(`http://localhost:8080/api/employee/${id}`);
            const data = await response.json();
            setFormData(data);
            }
            catch(error){
                console.error("Chyba při načtení uživatele: ", error);
            }
        }
        fetchEmployee();
    }, [id])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            const response = await fetch(`http://localhost:8080/api/employee/${id}`,{
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log("Upravená data: ", data);

            navigate("/");
        }catch(error){
            console.error("Chyba při načítání uživatele: ", error);
        }
    }

    return(
        <>
            <div className="UpdateUser">
                <div className="center-form">
                    <div className="card border-primary text-white mb-3">
                        <div className=" bg-primary card-header">
                            <h3 className="">Upravit data zaměstnance</h3>
                        </div>
                        <div className="card-body">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicName">
                                    <FloatingLabel controlId="formName" label="Jméno" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="name"
                                            placeholder="Jméno"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                        />
                                    </FloatingLabel>

                                    <FloatingLabel controlId="formEmail" label="Email" className="mb-3">
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                        />
                                    </FloatingLabel>

                                    <FloatingLabel controlId="formPhone" label="Tel. číslo" className="mb-3">
                                        <Form.Control
                                            type="number"
                                            name="phone"
                                            placeholder="Tel. číslo"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </FloatingLabel>

                                    <FloatingLabel controlId="formDepartment" label="Oddělení" className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="department"
                                            placeholder="Oddělení"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                        />
                                    </FloatingLabel>

                                </Form.Group>
                                <div className=" d-flex justify-content-between gap-2">
                                    <Button
                                        variant="secondary"
                                        type="button"
                                        className="w-100"
                                        onClick={() => navigate("/")}
                                    >
                                        Zpět
                                    </Button>
                                    <Button variant="primary" type="submit" className="w-100 text-nowrap">
                                        <FontAwesomeIcon icon={faSave} /> Uložit změny
                                    </Button>
                                </div>

                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default UpdateUser;