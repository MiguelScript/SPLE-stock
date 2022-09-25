import React from "react";
import { Row, Col,  } from "react-bootstrap";
import CustomerInfo from "./CustomerInfo";
import CustomerSidebar from "./CustomerSidebar";
import CustomerHeader from "./CustomerHeader";

const Order = ({ sendParent, currentParent, customer }) => {
  return (
    <Row>
      <Col xl={12}>
        <CustomerHeader nombre={`${customer.nombre} ${customer.apellido}`} cantidad_pedidos={customer.cantidad_pedidos} total_compras={customer.total_compras} fechaCreacion={customer.created_at} />
      </Col>
      <Col xl={9}>
        <CustomerInfo currentParent={currentParent} sendParent={sendParent}/>
      </Col>
      <Col xl={3}>
        <CustomerSidebar sendParent={sendParent} customer={customer}/>
      </Col>
    </Row>
  );
};

export default Order;
