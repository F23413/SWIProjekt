import "./Login.css";
import {useState} from "react";
import {Alert, Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {faCapricorn} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import type {AuthState, UserRole} from "../../auth.ts";

type LoginProps = {
    authState: AuthState;
    onLogin: (authState: AuthState) => void;
};

type LoginResponse = {
    email?: string;
    role?: UserRole;
    user?: {
        email?: string;
        role?: UserRole;
    };
};

const Login = ({authState, onLogin}: LoginProps) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: authState.email,
        password: ""
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event)=> {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error("Přihlášení se nezdařilo");
            }

            const data: LoginResponse = await response.json();
            const role = data.role ?? data.user?.role;

            if (role !== "ADM" && role !== "USR") {
                throw new Error("Server nevrátil platnou roli uživatele");
            }

            onLogin({
                email: data.email ?? data.user?.email ?? formData.email,
                isLoggedIn: true,
                role
            });

            navigate("/");
        } catch (error) {
            console.error("Došlo k chybe: ", error);
            setErrorMessage(error instanceof Error ? error.message : "Přihlášení se nezdařilo");
        }
    };

    return(
        <>
            <div className="Login">
                <div className="center-form">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-primary-emphasis">Přihlášení</h3>
                        </div>
                        <div className="card-body">
                            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formBasicName">
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    ></Form.Control>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Heslo"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    ></Form.Control>
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
