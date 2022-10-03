import React, { useEffect, Fragment, useRef } from "react";
import styled from "styled-components";
import { DateTime } from "luxon";
import { Row, Col, FormControl } from "react-bootstrap";
import { Typography, useTheme } from "@material-ui/core";
import Paginador from "../../components/Common/Paginador";
import { Button } from "@material-ui/core";
import {
  DataGridHeader,
  DataGridContainer,
  DataGrid,
  MainColumn,
} from "../../components/data-grid/data-grid.styles";
import { useMachine } from "@xstate/react";
import { adminBuysMachine } from "../../machines/buys/adminBuysMachine";
// import { AuthStateContext } from "../../context/Auth/Auth";
import { isEmpty } from "lodash";
// import { ReusableDrawerDispatchContext } from "../../context/ReusableDrawer/reusable-drawer";
import NumberFormat from 'react-number-format';
import { ESTADOS_FACTURA } from "../../config/constants";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import { useHistory } from "react-router-dom";


const ActionsContainer = styled.div`
  display: flex;
`;

const Buys = () => {

  // const reusableDrawerDispatch = React.useContext(
  //   ReusableDrawerDispatchContext
  // );

  const theme = useTheme();
  const [current, send] = useMachine(adminBuysMachine);
  // const authState = useContext(AuthStateContext);
  let history = useHistory();
  const dataGridContent = useRef();

  const handleChangeSearch = (e) => {
    const { value } = e.target;
    send({ type: "SEARCH", value });
  };


  const handleCreate = () => {
    history.push('compras/nuevo');
  }
  const handleViewInvoice = (buy) => {
    console.log(buy)
    history.push("compras/" + String(buy.id), {
      "buy": buy
    });
  };


  useEffect(() => {
    send({ type: "FETCHPRODUCTS" });
  }, []);

  useEffect(() => {
    dataGridContent.current.scrollTo(0, 0);
  }, [current.context.pageInfo.limit]);

  return (
    <Row>
      <Col xl={12}>
        <DataGridHeader className="row no-gutters">
          <Col xl={3}>
            {" "}
            <Typography variant="h6" className="font-weight-bold">
              Compras realizadas
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
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreate}
                >
                  Nueva compra
                </Button>
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
              <Typography>Nombre</Typography>
            </div>
            <div className="header-column">
              <Typography>Monto facturado</Typography>
            </div>
            <div className="header-column">
              <Typography>Estado</Typography>
            </div>
            <div className="header-column">
              <Typography>Acciones</Typography>
            </div>

            {!current.matches("dataError") ? (
              !isEmpty(current.context.buys) ? (
                current.context.buys.map((buy, index) => (
                  <Fragment
                    key={index}
                  >
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewInvoice(buy);
                      }}>
                      <Typography>{buy.codigo}</Typography>
                    </div>
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewInvoice(buy);
                      }}>
                      <Typography variant="subtitle1">
                        {DateTime.fromISO(buy.created_at)
                          .setLocale("es")
                          .toLocaleString(DateTime.DATE_HUGE)}
                      </Typography>
                    </div>
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewInvoice(buy);
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
                          value={parseFloat(buy.subtotal)}
                        />

                      </Typography>
                    </div>

                    <div
                      className="cell"
                      onClick={() => {
                        handleViewInvoice(buy);
                      }}>
                      <Typography>{ESTADOS_FACTURA[parseInt(buy.status) - 1].estado}</Typography>
                    </div>
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewInvoice(buy);
                      }}>
                      <Typography>{parseFloat(buy.status)}</Typography>

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
          </DataGrid>
        </DataGridContainer>
      </Col>
      {!current.matches("dataError") && (
        <Col xl={12} className="mt-3">
          <Paginador
            limit={current.context.pageInfo.limit}
            total={current.context.totalBuys}
            actualPage={current.context.pageInfo.actualPage}
            sendParent={send}
            hasPageNumbers={false}
          />
        </Col>
      )}
    </Row>
  )
};

export default Buys;
