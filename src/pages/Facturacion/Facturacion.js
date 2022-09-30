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
import { adminFacturacionMachine } from "../../machines/facturacion/adminFacturacionMachine";
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

const Facturacion = () => {

  // const reusableDrawerDispatch = React.useContext(
  //   ReusableDrawerDispatchContext
  // );

  const theme = useTheme();
  const [current, send] = useMachine(adminFacturacionMachine);
  // const authState = useContext(AuthStateContext);
  let history = useHistory();

  const handleChangeSearch = (e) => {
    const { value } = e.target;
    send({ type: "SEARCH", value });
  };

  const dataGridContent = useRef();

  const handleFilter = (e) => {
    const { value } = e.target;
    if (value !== "") {
      send({ type: "FETCHBYLIMIT", value });
    }
  };

  const handleCreate = () => {
    history.push('facturacion/nuevo');
  }
  const handleViewInvoice = (invoice) => {
    history.push("facturacion/" + String(invoice.id), {
      "invoice": invoice
    });
  };

  /*  const handleProduct = (product) => {
     //if (authState.context.userData.rol_id == ROLES_USUARIOS[1].id || authState.context.userData.rol_id == ROLES_USUARIOS[0].id) {
     reusableDrawerDispatch({
       type: "OPENDRAWER",
       drawerProps: {
         layout: {
           title: "Editar producto",
         },
         producto: {
           nombre: product.nombre,
           cantidad: product.cantidad,
           precio_costo: product.precio_costo,
           porcentaje_ganancia: product.porcentaje_ganancia,
           status: product.status,
           imagen: product.imagen,
           isInHomepage: product.pagina_principal,
           product_id: product.id,
           codigo: product.codigo,
         },
         goToDatagrid: () => {
           send({ type: "GOTODATATABLE" });
         },
       },
       drawerOptions: {
         backdrop: "static",
         keyboard: false,
       },
 
       component: EditarProducto,
     });
 
     //}
 
   } */

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
              Ventas realizadas
            </Typography>
          </Col>
          <Col xl={9}>
            {" "}
            <ActionsContainer className="row">
              <Col xl={3}>
                <FormControl as="select" onChange={handleFilter} name="limit">
                  <option value="">Número de filas</option>
                  <option value="10">{10}</option>
                  <option value="25">{25}</option>
                  <option value="50">{50}</option>
                  <option value="100">{100}</option>
                </FormControl>
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
                  Nueva venta
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
                    <div
                      className="cell"
                      onClick={() => {
                        handleViewInvoice(invoice);
                      }}>
                      <Typography>{parseFloat(invoice.status)}</Typography>

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
            total={current.context.totalProductos}
            actualPage={current.context.pageInfo.actualPage}
            sendParent={send}
            hasPageNumbers={false}
          />
        </Col>
      )}
    </Row>
    // ) : (
    //   <ViewInvoice
    //     invoice={current.context.selectedInvoice}
    //     currentParent={current}
    //     sendParent={send}
    //     viewInvoice={true}
    //   />
    // )
  )
};

export default Facturacion;
