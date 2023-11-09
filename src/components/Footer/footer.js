import { Col, Row } from "antd";
import { Container } from "react-bootstrap";

export default function CustomFooter() {
  return (
    <footer
      className="bg-dark text-light"
      style={{
        textAlign: "center",
        position: "fixed",
        bottom: "0",
        right: "0",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <Container>
        <Row>
          <Col xs={24} sm={24} md={12}>
            <h5>95IDEAL TECHNOLOGY SOLUTIONS COMPANY</h5>
            <p>Công ty cung cấp giải pháp về R&D hiệu quả nhất</p>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <h5>Contact Us</h5>
            <p>Email: customerservice.95ideal@gmail.com</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
