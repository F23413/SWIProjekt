import "./PostUser.css"
import {useState} from "react";
import {Button, Form} from "react-bootstrap";

const PostUser = () => {
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

    return(
        <>
<div className="center-form">
    <div className="bg-dark">
        <h1 className=" text-danger-emphasis">Přidání nového zaměstnance</h1>
    </div>
    <Form>
        <Form.Group controlId="formBasicName">
            <Form.Control type="text" name="name" placeholder="Jméno" value={formData.name} onChange={handleInputChange}></Form.Control>
            <Form.Control type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange}></Form.Control>
            <Form.Control type="text" name="phone" placeholder="Tel. číslo" value={formData.phone} onChange={handleInputChange}></Form.Control>
            <Form.Control type="text" name="department" placeholder="Oddělení" value={formData.department} onChange={handleInputChange}></Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
            Uložit nového zaměstnance
        </Button>
    </Form>
</div>
        </>
    )
}
export default PostUser;