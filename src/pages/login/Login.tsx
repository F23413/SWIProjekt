import "./Login.css";
import {useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import { faCapricorn } from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


const Login = () => {

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

    //const navigate = useNavigate();

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        console.log(formData);
        try {
            const response = await fetch(`http://localhost:8080/api/employee`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Chyba při ukládání uživatele");
            }

            const data = await response.json();
            console.log("Uživatel uložen: ", data);
            navigate("/");

        } catch (error) {
            console.error("Došlo k chybě: ", error);
        }
    };


    return(
        <>
            <div className="Login">
                <div className="center-form">
                    <div className="card">
                        <div className="card-header">
                            <h3 className=" text-primary-emphasis">Přihlášení</h3>
                        </div>
                        <div className="card-body">
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicName">
                                    <Form.Control type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange}></Form.Control>
                                    <Form.Control type="text" name="password" placeholder="Heslo" value={formData.department} onChange={handleInputChange}></Form.Control>
                                </Form.Group>
                                <Button variant="success" type="submit" className="w-100">
                                    Přihlásit <FontAwesomeIcon icon={faCapricorn} />
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Login;