import { Col, Row } from "antd";
import { Container } from "react-bootstrap";

export default function CustomFooter( ) {
    return (
        <footer className="bg-dark text-light">
        <Container>
          <Row>
            <Col md={6}>
              <h5>About Us</h5>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Col>
            <Col md={6}>
              <h5>Contact Us</h5>
              <p>Email: info@example.com</p>
              <p>Phone: 123-456-7890</p>
            </Col>
          </Row>
        </Container>
      </footer>
    )
}