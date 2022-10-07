import React, { useEffect, Fragment, useContext, useRef } from "react";
import styled from "styled-components";
import { Row, Col, FormControl } from "react-bootstrap";
import { Typography, SvgIcon, useTheme, Badge } from "@material-ui/core";
import { TIPO_PEDIDO, ESTADOS_PEDIDO, ESTADOS_FACTURA } from "../../../config/constants";
import Paginador from "../../../components/Common/Paginador";
import { Button } from "@material-ui/core";
import {
  DataGridHeader,
  DataGridContainer,
  DataGridCustomerOrders,
  MainColumn,
} from "../../../components/data-grid/data-grid.styles";
import { useMachine } from "@xstate/react";
import { customerOrdersMachine } from "../../../machines/customers/customerOrders";
import { AuthStateContext } from "../../../context/Auth/Auth";
import { isEmpty } from "lodash";
import Skeleton from "react-loading-skeleton";
import Order from "../../Orders/Order/Order";
import LoadingSpinner from "../../../components/Loading/LoadingSpinner";
import NumberFormat from "react-number-format";
import { DateTime } from "luxon";
import { useHistory } from "react-router-dom";
const ActionsContainer = styled.div`
  display: flex;
`;

const CustomerOrders = ({ sendParent, currentParent }) => {
  const theme = useTheme();
  const [current, send] = useMachine(customerOrdersMachine);
  const authState = useContext(AuthStateContext);
  let history = useHistory();
  const dataGridContent = useRef();
  const handleChangeSearch = (e) => {
    const { name, value } = e.target;
    send({ type: "SEARCH", value });
  };


  const handleFilter = (e) => {
    const { name, value } = e.target;
    if (name == "limit") {
      if (value != "") {
        send({ type: "FETCHBYLIMIT", value });
      }
    } else {
      send({ type: "FETCHBYSTATUS", value });
    }
  };

  useEffect(() => {
    dataGridContent.current.scrollTo(0, 0);
  }, [current.context.pageInfo.limit]);


  useEffect(() => {
    send({ type: "SETORDERS", orders: currentParent.context.customer.sales });

    if (authState.matches("LoggedIn")) {
      // send({ type: "FETCHORDERS", data: authState.context.userData.rol_id,customer_id:currentParent.context.selectedCustomer.id });
    }
  }, []);

  const handleViewInvoice = (invoice) => {
    history.push("/facturacion/" + String(invoice.id));
  };

  return (
    <>
      <Col xl={12}>
        {/* <DataGridHeader className="row no-gutters">
          <Col xl={3}>
            {" "}
            <Typography variant="h6" className="font-weight-bold">
              Ventas realizadas
            </Typography>
          </Col>
          <Col xl={9}>
            {" "}
            <ActionsContainer className="row">
              <Col xl={3}>
                
              </Col>
              <Col xl={6}>
                <FormControl
                  placeholder="Buscar por nombre"
                  onChange={handleChangeSearch}
                ></FormControl>

              </Col>
              <Col xl={3}>
                
              </Col>
            </ActionsContainer>
          </Col>
        </DataGridHeader> */}
        <DataGridContainer ref={dataGridContent}>
          <DataGridCustomerOrders theme={theme}>
            <div className="header-column">
              <Typography>Código</Typography>
            </div>
            <div className="header-column">
              <Typography>Fecha</Typography>
            </div>
            <div className="header-column">
              <Typography>Monto facturado</Typography>
            </div>
            <div className="header-column">
              <Typography>Estado</Typography>
            </div>

            {!current.matches("dataError") ? (
              !isEmpty(current.context.invoices) ? (
                current.context.invoices.map((invoice, index) => (
                  <Fragment
                    key={index}
                  >
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewInvoice(invoice);
                      }}>
                      <Typography>{invoice.codigo}</Typography>
                    </div>
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewInvoice(invoice);
                      }}>
                      <Typography variant="subtitle1">
                        {DateTime.fromISO(invoice.created_at)
                          .setLocale("es")
                          .toLocaleString(DateTime.DATE_HUGE)}
                      </Typography>
                    </div>
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewInvoice(invoice);
                      }}>

                      <Typography className="font-weight-bold">
                        <NumberFormat
                          //customInput={TextField}
                          prefix="$"
                          thousandSeparator="."
                          decimalSeparator=","
                          fixedDecimalScale={true}
                          decimalScale={2}
                          displayType={"text"}
                          value={parseFloat(invoice.monto_venta)}
                        />

                      </Typography>
                    </div>
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewInvoice(invoice);
                      }}>
                      <Typography>{ESTADOS_FACTURA[parseInt(invoice.status) - 1].estado}</Typography>
                    </div>
                  </Fragment>
                ))
              ) : (
                <MainColumn>
                  <Row className="w-100">
                    <Col
                      className="text-center d-flex justify-content-center align-items-center loading"
                      xl={12}
                    >
                      {current.matches("dataReady") ? (
                        <Typography variant="h5" className="mt-3">
                          {current.context.responseMsg}
                        </Typography>
                      ) : (
                        <LoadingSpinner />

                      )}
                    </Col>
                  </Row>
                </MainColumn>
              )
            ) : (
              <MainColumn>
                <Row className="w-100">
                  <Col
                    className="text-center d-flex justify-content-center align-items-center flex-column"
                    xl={12}
                  >
                    <Typography variant="h4" className="mt-4 mb-3">
                      {current.context.responseMsg}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        send({ type: "FETCHPRODUCTS" });
                      }}
                    >
                      Reintentar
                    </Button>
                  </Col>
                </Row>
              </MainColumn>
            )}
          </DataGridCustomerOrders>
        </DataGridContainer>
      </Col>
      {!current.matches("dataError") && (
        <Col xl={12} className="mt-3">
          <Paginador
            limit={current.context.pageInfo.limit}
            total={current.context.totalPedidos}
            actualPage={current.context.pageInfo.actualPage}
            sendParent={send}
            hasPageNumbers={false}
          />
        </Col>
      )}
    </>
  );
};

export default CustomerOrders;
