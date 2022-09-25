import React, { useEffect, Fragment, useContext, useRef } from "react";
import styled from "styled-components";
import { Row, Col, FormControl } from "react-bootstrap";
import { Typography, SvgIcon, useTheme, Badge } from "@material-ui/core";
import { TIPO_PEDIDO, ESTADOS_PEDIDO } from "../../../config/constants";
import Paginador from "../../../components/Common/Paginador";
import { Button } from "@material-ui/core";
import {
  DataGridHeader,
  DataGridContainer,
  DataGrid,
  MainColumn,
} from "../../../components/data-grid/data-grid.styles";
import { useMachine } from "@xstate/react";
import { customerOrdersMachine } from "../../../machines/customers/customerOrders";
import { AuthStateContext } from "../../../context/Auth/Auth";
import { isEmpty } from "lodash";
import moment from "moment";
import localization from "moment/locale/es";
import Skeleton from "react-loading-skeleton";
import Order from "../../Orders/Order/Order";
const ActionsContainer = styled.div`
  display: flex;
`;

const CustomerOrders = ({sendParent,currentParent}) => {
  const theme = useTheme();
  const [current, send] = useMachine(customerOrdersMachine);
  const authState = useContext(AuthStateContext);
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

  const handleDateReFormat = (date) => {
    return moment(new Date(date)).fromNow();
  };

  const handleOrder = (order) => {
    sendParent({ type: "GOTOORDER", data: order });
  };

  useEffect(() => {
    dataGridContent.current.scrollTo(0, 0);
  }, [current.context.pageInfo.limit]);


  useEffect(() => {
    if (authState.matches("LoggedIn")) {
      send({ type: "FETCHORDERS", data: authState.context.userData.rol_id,customer_id:currentParent.context.selectedCustomer.id });
    }
  }, [authState]);
  useEffect(() => {
    moment.updateLocale("es", localization);
  }, []);
  return (
       <>
      <Col xl={12}>
        <DataGridContainer ref={dataGridContent}>
          <DataGrid theme={theme}>
            <div className="header-column">
              <Typography>Código</Typography>
            </div>
            <div className="header-column">
              <Typography>Tipo</Typography>
            </div>
            <div className="header-column">
              <Typography>Fecha</Typography>
            </div>
            <div className="header-column">
              <Typography>Contacto</Typography>
            </div>
            <div className="header-column">
              <Typography>Estado</Typography>
            </div>

            {!current.matches("dataError") ? (
              !isEmpty(current.context.pedidos) ? (
                current.context.pedidos.map((pedido, index) => (
                  <Fragment key={index}>
                    <div
                      onClick={() => {
                        handleOrder(pedido);
                      }}
                      className="justify-content-center"
                    >
                      {pedido.nuevo && (<Badge badgeContent={"¡Nueva!"} color="error">
                      </Badge>)}
                      <Typography className="ml-3">{pedido.codigo}</Typography>
                    </div>
                    <div
                      onClick={() => {
                        handleOrder(pedido);
                      }}
                    >
                      <SvgIcon
                        component={TIPO_PEDIDO[parseInt(pedido.tipo) - 1].icon}
                        className="mr-2 delivery-icon"
                      ></SvgIcon>
                      <Typography>
                        {TIPO_PEDIDO[parseInt(pedido.tipo) - 1].tipo}
                      </Typography>
                    </div>
                    <div
                      onClick={() => {
                        handleOrder(pedido);
                      }}
                    >
                      <Typography>
                        {handleDateReFormat(pedido.fecha_creacion)}
                      </Typography>
                    </div>
                    <div
                      onClick={() => {
                        handleOrder(pedido);
                      }}
                    >
                      <Typography>{pedido.contacto_numero}</Typography>
                    </div>
                    <div
                      onClick={() => {
                        handleOrder(pedido);
                      }}
                    >
                      <span
                        className={`dot ${ESTADOS_PEDIDO[pedido.status].class}`}
                      ></span>
                      <Typography>
                        {ESTADOS_PEDIDO[pedido.status].estado}
                      </Typography>
                    </div>
                  </Fragment>
                ))
              ) : (
                <MainColumn>
                  <Row className="w-100">
                    <Col
                      className="text-center d-flex justify-content-center"
                      xl={12}
                    >
                      {current.matches("dataReady") && (
                        <Typography variant="h5" className="mt-3">
                          {current.context.responseMsg}
                        </Typography>
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
                        send({ type: "FETCHORDERS" });
                      }}
                    >
                      Reintentar
                    </Button>
                  </Col>
                </Row>
              </MainColumn>
            )}
          </DataGrid>
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
