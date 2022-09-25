import React from "react";
import { Row, Col,  } from "react-bootstrap";
import OrderInfo from "./OrderInfo";
import OrderSidebar from "./OrderSidebar";
import OrderHeader from "./OrderHeader";

const Order = ({ sendParent, currentParent, order }) => {
  return (
    <Row>
      <Col xl={12}>
        <OrderHeader estado={order.status} tipo={order.tipo} fechaCreacion={order.fecha_creacion} codigo={order.codigo}  />
      </Col>
      <Col xl={9}>
        <OrderInfo order={order} sendParent={sendParent}/>
      </Col>
      <Col xl={3}>
        <OrderSidebar sendParent={sendParent} order={order}/>
      </Col>
    </Row>
  );
};

export default Order;
