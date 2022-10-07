import React, { useEffect } from "react";
import { Row, Col, } from "react-bootstrap";
import CustomerInfo from "./CustomerInfo";
import CustomerSidebar from "./CustomerSidebar";
import CustomerHeader from "./CustomerHeader";
import { useMachine } from "@xstate/react";
import { viewCustomerMachine } from "../../../machines/customers/viewCustomerMachine";
import { useHistory, useParams } from "react-router-dom";

const Customer = ({ sendParent, currentParent, customer }) => {

  let { id } = useParams();
  const [current, send] = useMachine(viewCustomerMachine);

  useEffect(() => {
    send({ type: "FETCHTCUSTOMER", customerId: id });
  }, []);

  return current.matches('dataReady') ? (
    <Row>
      <Col xl={12}>
        <CustomerHeader nombre={`${current.context.customer.nombre} ${current.context.customer.apellido}`} cantidad_pedidos={current.context.customer.cantidad_pedidos} total_compras={current.context.customer.total_compras} fechaCreacion={current.context.customer.created_at} />
      </Col>
      <Col xl={9}>
        <CustomerInfo currentParent={current} sendParent={send} />
      </Col>
      <Col xl={3}>
        <CustomerSidebar sendParent={sendParent} customer={current.context.customer} />
      </Col>
    </Row>
  ) : (
    <></>
  )
};

export default Customer;
