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
            <h5>95LAB IDEAL </h5>
            <p>Công ty cung cấp giải pháp về R&D hiệu quả nhất</p>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <h5>Contact Us</h5>
            <p>Email: 95LABIDEAL@gmail.com</p>
            <p>Phone: 123-456-7890</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
