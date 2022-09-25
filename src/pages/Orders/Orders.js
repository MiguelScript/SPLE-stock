import React, { useEffect, Fragment, useContext, useRef } from "react";
import styled from "styled-components";
import { Row, Col, FormControl } from "react-bootstrap";
import { Typography, SvgIcon, useTheme, Badge } from "@material-ui/core";
import { TIPO_PEDIDO, ESTADOS_PEDIDO } from "../../config/constants";
import Paginador from "../../components/Common/Paginador";
import { Button } from "@material-ui/core";
import {
  DataGridHeader,
  DataGridContainer,
  DataGrid,
  MainColumn,
} from "../../components/data-grid/data-grid.styles";
import { useMachine } from "@xstate/react";
import { ordersMachine } from "../../machines/orders/orders";
import { AuthStateContext } from "../../context/Auth/Auth";
import { isEmpty } from "lodash";
import moment from "moment";
import localization from "moment/locale/es";
import Skeleton from "react-loading-skeleton";
import Order from "./Order/Order";
const ActionsContainer = styled.div`
  display: flex;
`;

const Orders = () => {
  const theme = useTheme();
  const [current, send] = useMachine(ordersMachine);
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
    send({ type: "GOTOORDER", data: order });
  };

  useEffect(() => {
    dataGridContent.current.scrollTo(0, 0);
  }, [current.context.pageInfo.limit]);

  useEffect(() => {
    if (authState.matches("LoggedIn")) {
      send({ type: "FETCHORDERS", data: authState.context.userData.rol_id });
    }
  }, [authState]);
  useEffect(() => {
    moment.updateLocale("es", localization);
  }, []);
  return !current.context.showOrder ? (
    <Row>
      <Col xl={12}>
        <DataGridHeader className="row no-gutters">
          <Col xl={3}>
            {" "}
            <Typography variant="h6" className="font-weight-bold">
              Pedidos
            </Typography>
          </Col>
          <Col xl={9}>
            {" "}
            <ActionsContainer className="row">
              <Col xl={3}>
                {authState.matches("LoggedIn") ? (
                  <FormControl
                    as="select"
                    onChange={handleFilter}
                    name="estado"
                    defaultValue={current.context.status}
                  >
                    <option value="">Buscar por estado</option>

                    <option value="0">{ESTADOS_PEDIDO[0].estado}</option>
                    <option value="1">{ESTADOS_PEDIDO[1].estado}</option>
                    <option value="2">{ESTADOS_PEDIDO[2].estado}</option>
                    <option value="3">{ESTADOS_PEDIDO[3].estado}</option>
                    <option value="4">{ESTADOS_PEDIDO[4].estado}</option>
                    <option value="5">{ESTADOS_PEDIDO[5].estado}</option>
                  </FormControl>
                ) : (
                    <Skeleton />
                  )}
              </Col>
              <Col xl={3}>
                <FormControl
                  as="select"
                  onChange={handleFilter}
                  name="limit"
                  defaultValue={current.context.pageInfo.limit}
                >
                  <option value="">Número de pedidos</option>
                  <option value="10">{10}</option>
                  <option value="25">{25}</option>
                  <option value="50">{50}</option>
                  <option value="100">{100}</option>
                </FormControl>
              </Col>

              <Col xl={6}>
                <FormControl
                  placeholder="Buscar por código"
                  onChange={handleChangeSearch}
                  defaultValue={current.context.search}
                ></FormControl>
              </Col>
            </ActionsContainer>
          </Col>
        </DataGridHeader>
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
    </Row>
  ) : (
      <Order
        order={current.context.selectedOrder}
        sendParent={send}
        currentParent={current}
      />
    );
};

export default Orders;
