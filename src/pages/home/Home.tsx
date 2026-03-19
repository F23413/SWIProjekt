import "./Home.css";
import {Alert, Card, Col, Container, Row} from "react-bootstrap";
import {AUTH_STORAGE_KEY, defaultAuthState} from "../../auth.ts";
import type {AuthState} from "../../auth.ts";

const formatDisplayName = (email: string) => {
    const localPart = email.split("@")[0]?.trim();

    if (!localPart) {
        return "návštěvníku";
    }

    return localPart
        .split(/[._-]+/)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(" ");
};

const getGreetingName = () => {
    const savedAuthState = localStorage.getItem(AUTH_STORAGE_KEY);

    if (!savedAuthState) {
        return "návštěvníku";
    }

    try {
        const authState = JSON.parse(savedAuthState) as AuthState;

        if (!authState.isLoggedIn || !authState.email) {
            return "návštěvníku";
        }

        return formatDisplayName(authState.email);
    } catch (error) {
        console.error("Nepodařilo se načíst uživatele pro domovskou stránku:", error);
        return defaultAuthState.email ? formatDisplayName(defaultAuthState.email) : "návštěvníku";
    }
};

const Home = () => {
    const greetingName = getGreetingName();

    return (
        <div className="Home">
            <Container className="py-5">
                <Row className="justify-content-center">
                    <Col xl={10}>
                        <Card className="home-card shadow-lg border-0">
                            <Card.Body className="p-4 p-md-5">
                                <Row className="g-4 align-items-center">
                                    <Col lg={7}>
                                        <span className="badge bg-primary mb-3 home-badge">Employee Management</span>
                                        <h1 className="display-6 fw-bold mb-3">Vítejte, {greetingName}</h1>
                                        <p className="lead text-muted mb-3">
                                            Tato aplikace slouží ke správě zaměstnanců, jejich kontaktních údajů a oddělení
                                            v přehledném interním systému.
                                        </p>
                                        <p className="mb-4">
                                            Na stránce <strong>Dashboard</strong> najdete seznam zaměstnanců. Přihlášený
                                            administrátor může vytvářet nové záznamy, upravovat je a mazat, zatímco
                                            nepřihlášený uživatel uvidí jen bezpečné veřejné rozhraní.
                                        </p>
                                        <Alert variant="primary" className="mb-4">
                                            Použijte navigaci nahoře pro přechod na domovskou stránku, dashboard nebo přihlášení. Přihlášený uživatel má přístup k tabulce uživatelů.
                                        </Alert>
                                    </Col>
                                    <Col lg={5}>
                                        <Card className="h-100 border-primary-subtle home-image-card">
                                            <Card.Img variant="top" src="https://i.pinimg.com/originals/05/81/3c/05813c7bb3803d751fd2412bc4a4f9d6.jpg" alt="Ukázkový vizuál aplikace" className="home-preview-image" />
                                            <Card.Body>
                                                <Card.Title>Náhled projektu</Card.Title>
                                                <Card.Text className="text-muted mb-0">
                                                    Ilustrační obrázek pro představu, jak si představujeme finanční budoucnost projektu.
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row className="g-4 mt-2">
                                    <Col md={4}>
                                        <Card className="h-100 border-success-subtle home-info-card">
                                            <Card.Body>
                                                <Card.Title>Evidence zaměstnanců</Card.Title>
                                                <Card.Text className="mb-0">
                                                    Ukládejte jména, e-maily, telefonní čísla a oddělení v jednom místě.
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4}>
                                        <Card className="h-100 border-warning-subtle home-info-card">
                                            <Card.Body>
                                                <Card.Title>Role a přístupy</Card.Title>
                                                <Card.Text className="mb-0">
                                                    Administrátor spravuje data, nepřihlášený uživatel nevidí chráněnou tabulku.
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col md={4}>
                                        <Card className="h-100 border-info-subtle home-info-card">
                                            <Card.Body>
                                                <Card.Title>Softwarové inženýrství</Card.Title>
                                                <Card.Text className="mb-0">
                                                    Projekt vznikl propojením Spring Bootu, Reactu a databázemi MySQL a MariaDB.
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Home;
