import "./PostUser.css"
import {useState} from "react";
import {Button, Form} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";

const PostUser = () => {

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
            <div className="PostUser">
<div className="center-form">
    <div className="card border-success text-white mb-3">
        <div className="card-header bg-success">
            <h3 className="">Přidání nového zaměstnance</h3>
        </div>
        <div className="card-body">
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName">
                    <Form.Control type="text" name="name" placeholder="Jméno" value={formData.name} onChange={handleInputChange}></Form.Control>
                    <Form.Control type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange}></Form.Control>
                    <Form.Control type="number" name="phone" placeholder="Tel. číslo" value={formData.phone} onChange={handleInputChange}></Form.Control>
                    <Form.Control type="text" name="department" placeholder="Oddělení" value={formData.department} onChange={handleInputChange}></Form.Control>
                </Form.Group>
                <Button variant="success" type="submit" className="w-100">
                    <FontAwesomeIcon icon={faSave} /> Uložit nového zaměstnance
                </Button>
            </Form>
        </div>
    </div>
</div>
            </div>
        </>
    )
}
export default PostUser;