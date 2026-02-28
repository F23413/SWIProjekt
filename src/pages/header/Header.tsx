import {Container, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import "./Header.css"

const Header = () => {
    return(
        <>
<Navbar bg="primary" variant="dark">
    <Container>
        <Navbar.Brand href="/"><strong>Systém pro správu zaměstnanců</strong></Navbar.Brand>
        <Nav className="ml-auto">
            <Nav.Link as={Link} to="/" className="nav-link text-light">Zaměstnanci</Nav.Link>
            <Nav.Link as={Link} to="/employee" className="nav-link text-light">Nový zaměstnanec</Nav.Link>
        </Nav>
    </Container>
</Navbar>
</>
    )
}
export default Header;