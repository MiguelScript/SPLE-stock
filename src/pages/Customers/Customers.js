import React, { useEffect, Fragment, useContext, useRef } from "react";
import styled from "styled-components";
import { Row, Col, FormControl } from "react-bootstrap";
import { Typography, SvgIcon, useTheme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Paginador from "../../components/Common/Paginador";
import { Button } from "@material-ui/core";
import {
  DataGridHeader,
  DataGridContainer,
  DataGrid,
  MainColumn,
} from "../../components/data-grid/data-grid.styles";
import { useMachine } from "@xstate/react";
import { adminCustomersMachine } from "../../machines/customers/adminCustomersMachine";
import { AuthStateContext } from "../../context/Auth/Auth";
import { isEmpty } from "lodash";
import Skeleton from "react-loading-skeleton";
import Customer from "./Customer/Customer";
import { ESTADOS_CLIENTES } from "../../config/constants";
import Order from '../../pages/Orders/Order/Order';
import { useHistory } from "react-router-dom";
import { ReusableDrawerDispatchContext } from "../../context/ReusableDrawer/reusable-drawer";
import CustomerForm from "./Drawer/CustomerForm";
const ActionsContainer = styled.div`
  display: flex;
`;

const useStyles = makeStyles((theme) => ({
  email: {
    textAlign: "center",
    wordBreak: "break-all"
  },

}));

const Customers = () => {
  const classes = useStyles();
  const theme = useTheme();
  const reusableDrawerDispatch = React.useContext(
    ReusableDrawerDispatchContext
  );
  let history = useHistory();
  const [current, send] = useMachine(adminCustomersMachine);
  const authState = useContext(AuthStateContext);
  const dataGridContent = useRef();
  
  const handleChangeSearch = (e) => {
    const { value } = e.target;
    send({ type: "SEARCH", value });
  };

  const handleCreate = () => {
    reusableDrawerDispatch({
      type: "OPENDRAWER",
      drawerProps: {
        layout: {
          title: "Crear cliente",
        },
        goToDatagrid: () => {
          send({ type: "GOTODATAGRID" });
        },
      },
      component: CustomerForm,
    });
  };

  const handleViewCustomer = (customer) => {
    history.push("customers/" + String(customer.id));
  };

  useEffect(() => {
    dataGridContent.current.scrollTo(0, 0);
  }, [current.context.pageInfo.limit]);

  useEffect(() => {
    if (authState.matches("LoggedIn")) {
      send({ type: "FETCHCUSTOMERS", data: authState.context.userData.rol_id });
    }
  }, [authState]);

  return (
    <Row>
      <Col xl={12}>
        <DataGridHeader className="row no-gutters">
          <Col xl={3}>
            {" "}
            <Typography variant="h6" className="font-weight-bold">
              Clientes
            </Typography>
          </Col>
          <Col xl={9}>
            {" "}
            <ActionsContainer className="row">
              <Col xl={3}>
                {/* <FormControl
                      as="select"
                      onChange={handleFilter}
                      name="status"
                    >
                      <option value="">Buscar por estado</option>
                      <option value="1">{ESTADOS_CLIENTES[0].estado}</option>
                      <option value="2">{ESTADOS_CLIENTES[1].estado}</option>
                    </FormControl> */}
              </Col>
              <Col xl={6}>
                <FormControl
                  placeholder="Buscar por Nombre"
                  onChange={handleChangeSearch}
                ></FormControl>
              </Col>
              <Col xl={3}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCreate}
                >
                  Nuevo cliente
                </Button>
              </Col>
            </ActionsContainer>
          </Col>
        </DataGridHeader>
        <DataGridContainer ref={dataGridContent}>
          <DataGrid theme={theme}>
            <div className="header-column">
              <Typography>Codigo</Typography>
            </div>
            <div className="header-column">
              <Typography>Nombre</Typography>
            </div>
            <div className="header-column">
              <Typography>Documento</Typography>
            </div>
            <div className="header-column">
              <Typography>Contacto</Typography>
            </div>
            <div className="header-column">
              <Typography>Estado</Typography>
            </div>

            {!current.matches("dataError") ? (
              !isEmpty(current.context.clientes) ? (
                current.context.clientes.map((cliente, index) => (
                  <Fragment key={index}>
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewCustomer(cliente);
                      }}
                    >
                      <Typography>{cliente.codigo}</Typography>
                    </div>
                    <div
                      className="cell"  
                      onClick={() => {
                        handleViewCustomer(cliente);
                      }}
                    >
                      <Typography>{cliente.nombre}</Typography>
                    </div>                    
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewCustomer(cliente);
                      }}
                    >
                      <Typography className={classes.email}>{`${cliente.tipo_documento}-${cliente.documento}`}</Typography>
                    </div>
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewCustomer(cliente);
                      }}
                    >
                      <Typography>{cliente.telefono}</Typography>
                    </div>
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewCustomer(cliente);
                      }}
                    >
                      <Typography>
                        {
                          ESTADOS_CLIENTES[parseInt(cliente.status) - 1]
                            .estado
                        }
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
                        send({ type: "FETCHCUSTOMERS" });
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
            total={current.context.totalClientes}
            actualPage={current.context.pageInfo.actualPage}
            sendParent={send}
            hasPageNumbers={false}
          />
        </Col>
      )}
    </Row>
  );
};

export default Customers;
