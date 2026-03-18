import {Container, Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";
import "./Header.css"
import type {AuthState} from "../../auth.ts";

type HeaderProps = {
    authState: AuthState;
    onLogout: () => void;
};

const Header = ({authState, onLogout}: HeaderProps) => {
    return(
        <>
            <Navbar bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand href="/"><strong>Systém pro správu zaměstnanců</strong></Navbar.Brand>
                    <Nav className="ml-auto">
                        <Nav.Link as={Link} to="/" className="nav-link text-light">Zaměstnanci</Nav.Link>
                        {authState.role === "ADM" && (
                            <Nav.Link as={Link} to="/employee" className="nav-link text-light">Nový zaměstnanec</Nav.Link>
                        )}
                        {!authState.isLoggedIn && (
                            <Nav.Link as={Link} to="/login" className="nav-link text-light">Login</Nav.Link>
                        )}
                        {authState.isLoggedIn && (
                            <Nav.Link as={Link} to="/" className="nav-link text-light" onClick={onLogout}>Logout</Nav.Link>
                        )}
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}

export default Header;
