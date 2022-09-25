import React, { useRef, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import { useMachine } from "@xstate/react";
import SimpleReactValidator from "simple-react-validator";
import {
  StoreStateContext,
  StoreDispatchContext,
} from "../../../../context/store/store";
import { productFormMachine } from "../../../../machines/products/productFormMachine";
import { ActionBtnsContainer } from "../../../../components/Common/reusable-drawer";
import LoadingEllipsis from "../../../../components/Loading/loading-ellipsis";
import CompletedFormLayout from "../../../../components/Common/CompletedFormLayout";
import DropZone from "../../../../components/Common/DropzoneImg";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import NumberFormat from 'react-number-format';
import { CURRENCY_DEFAULT } from "../../../../config/constants";




const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  padding: {
    padding: "16px",
  },

}));



const useForceUpdate = () => useState()[1];

const ProductForm = ({ closeDrawer, product, goToDatagrid, isEdit = false, texts }) => {
  const forceUpdate = useForceUpdate();
  const classes = useStyles();

  const [current, send] = useMachine(productFormMachine);
  const [currency, setcurrency] = React.useState(CURRENCY_DEFAULT);
  const [toggled, setToggled] = React.useState(false);
  const SiteDataState = React.useContext(StoreStateContext);


  const simpleValidator = useRef(
    new SimpleReactValidator({
      messages: {
        required: "Este paso es requerido.",
      },
    })
  );

  let nombreErrorMessage = simpleValidator.current.message(
    "nombre",
    current.context.formData.nombre,
    "required",
    { messages: { required: "El nombre es requerido" } }

  );

  let precioCostoErrorMessage = simpleValidator.current.message(
    "precio_costo",
    current.context.formData.precio_costo,
    "required",
    { messages: { required: "El precio costo es requerido" } }

  );

  let precioVentaErrorMessage = simpleValidator.current.message(
    "precio_venta",
    current.context.formData.precio_venta,
    "required",
    { messages: { required: "El precio venta es requerido" } }

  );

  let cantidadErrorMessage = simpleValidator.current.message(
    "cantidad",
    current.context.formData.cantidad,
    "required",
    { messages: { required: "la cantidad disponible es requerida" } }

  );
  /* let fileErrorMessage = simpleValidator.current.message(
    "archivo",
    current.context.formData.archivo,
    "required",
    { messages: { required: "El archivo xls es necesario" } }
  ); */

  const calcularPrecioVenta = (porcentaje, precioCosto) => {

    return ((precioCosto * porcentaje) / 100) + parseFloat(precioCosto);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (simpleValidator.current.allValid()) {
      if (current.matches("editingForm")) {
        send({ type: "SUBMITFORM", format: isEdit ? "edit" : "create" });

      }
    } else {
      simpleValidator.current.showMessages();
      forceUpdate(e);
    }
  };

  const handleChangeCheckbox = (e) => {
    const { name, checked } = e.target;
    send({ type: "SETCHECKBOXDATA", name, checked });
    console.log(e.target.name + checked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    send({ type: "SETDATA", name, value });
  };

  const handleToggle = (toggle) => {
    console.log(toggle);
    setToggled(toggle)
  }

  useEffect(() => {
    //console.log(children);
    if (toggled == true) {
      setcurrency(
        {
          prefix: "Bs.S",
          rate: SiteDataState.dollarRate.context.dollarRate.tasa,
        }
      )
    } else {
      setcurrency(
        CURRENCY_DEFAULT
      )
    }
  }, [toggled]);

  useEffect(() => {
    if (isEdit) {
      send({
        type: "SETFORMDATA",
        id: product.product_id,
        nombre: product.nombre,
        cantidad: product.cantidad,
        precio_costo: product.precio_costo,
        porcentaje_ganancia: product.porcentaje_ganancia,
        precio_venta: product.precio_venta,
        status: product.status,
        isInHomepage: product.isInHomepage,
        image: product.imagen,
        codigo: product.codigo,
      });
    }
  }, []);


  useEffect(() => {
    if (current.matches("completedForm")) {
      setTimeout(() => {
        closeDrawer();
        goToDatagrid();
      }, 2000);
    }
  }, [current]);

  //console.log(current);

  return (
    <Container className={classes.formContainer}>
      {!current.matches("completedForm") ? (
        <Form onSubmit={handleSubmit} className="form-row">
          <Paper className={`${classes.padding} w-100`} elevation={1}>
            <Col md={12}>
              <Form.Group>
                <DropZone
                  currentState={current}
                  dispatch={send}
                  field="image"
                  editImage={isEdit ? product.imagen : null}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <TextField
                  label="Nombre del producto"
                  variant="outlined"
                  name="nombre"
                  onChange={handleChange}
                  defaultValue={isEdit ? product.nombre : ""}
                  //required={}
                  fullWidth
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <NumberFormat
                  label="Precio del costo del producto"
                  variant="outlined"
                  name="precio_costo"
                  fullWidth
                  customInput={TextField}
                  prefix={currency.prefix}
                  thousandSeparator="."
                  decimalSeparator=","
                  fixedDecimalScale={true}
                  decimalScale={2}
                  onValueChange={(e) => {
                    const name = "precio_costo";
                    const value = e.value;
                    console.log(e.value);
                    send({
                      type: "SETDATA",
                      name,
                      value
                    });
                  }}
                  //displayType='text'
                  defaultValue={isEdit ? product.precio_costo : ""}
                //value={parseFloat(product.precio_costo * currency.rate)}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <TextField
                  label="Cantidad disponible"
                  variant="outlined"
                  name="cantidad"
                  onChange={handleChange}
                  defaultValue={isEdit ? product.cantidad : ""}
                  //required={}
                  fullWidth
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput1">



                <NumberFormat
                  label="Precio de venta"
                  variant="outlined"
                  name="precio_venta"
                  fullWidth
                  customInput={TextField}
                  prefix={currency.prefix}
                  thousandSeparator="."
                  decimalSeparator=","
                  fixedDecimalScale={true}
                  decimalScale={2}
                  //displayType='text'
                  defaultValue={isEdit ? product.precio_venta : ""}
                  onValueChange={(e) => {
                    const name = "precio_venta";
                    const value = e.value;
                    console.log(e.value);
                    send({
                      type: "SETDATA",
                      name,
                      value
                    });
                  }}

                //value={parseFloat(calcularPrecioVenta(current.context.formData.porcentaje_ganancia, current.context.formData.precio_costo))}
                />

              </Form.Group>
            </Col>
            {/* <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput1">

                <NumberFormat
                  label="porcentaje ganancia"
                  variant="outlined"
                  name="porcentaje_ganancia"
                  fullWidth
                  customInput={TextField}
                  prefix={"%"}
                  thousandSeparator="."
                  decimalSeparator=","
                  fixedDecimalScale={true}
                  decimalScale={2}
                  //displayType='text'
                  value={isEdit ? product.porcentaje_ganancia : ""}
                />
                <Typography
                  variant="subtitle2"
                >
                  Mostrar montos en Bs.S:<Switch
                    color="primary"
                    checked={toggled}
                    onChange={e => handleToggle(e.target.checked)}
                  />
                </Typography> 
              </Form.Group>
            </Col> */}
            <Col xl={12} className="mt-4">
              <Typography>Opciones</Typography>
            </Col>
            <Col xl={12} className="d-flex">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={current.context.formData.isInHomepage == 1 ? true : false}
                    defaultValue={current.context.formData.isInHomepage}
                    onChange={handleChangeCheckbox}
                    name="isInHomepage"
                  />}
                label="Mostrar en pagina inicial"
              />
            </Col>
            <Col xl={12} className="d-flex justify-content-center">
              <Collapse in={
                current.matches("error")
                /* || fileErrorMessage  */
                || nombreErrorMessage
                || cantidadErrorMessage
                || precioCostoErrorMessage
                || precioVentaErrorMessage
              }>
                <Typography
                  color="error"
                  className="text-center"
                >{`${current.context.responseMsg}`}</Typography>
                {/*               {fileErrorMessage ? (
                <Typography color="error" className="d-flex text-center">
                  *{fileErrorMessage}
                </Typography>
              ) : null} */}
                {nombreErrorMessage ? (
                  <Typography color="error" className="d-flex text-center">
                    *{nombreErrorMessage}
                  </Typography>
                ) : null}
                {cantidadErrorMessage ? (
                  <Typography color="error" className="d-flex text-center">
                    *{cantidadErrorMessage}
                  </Typography>
                ) : null}
                {precioCostoErrorMessage ? (
                  <Typography color="error" className="d-flex text-center">
                    *{precioCostoErrorMessage}
                  </Typography>
                ) : null}
                {precioVentaErrorMessage ? (
                  <Typography color="error" className="d-flex text-center">
                    *{precioVentaErrorMessage}
                  </Typography>
                ) : null}
              </Collapse>
            </Col>
          </Paper>



          <ActionBtnsContainer>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (!current.matches("submittingForm")) {
                  closeDrawer();
                }
              }}
              className="mr-3"
            >
              Volver
            </Button>{" "}
            <Button
              type="submit"
              variant="contained"
              color="primary">
              {!current.matches("submittingForm") ? (
                isEdit ? "Actualizar " : "Crear"
              ) : (
                <LoadingEllipsis />
              )}
            </Button>
          </ActionBtnsContainer>
        </Form>
      ) : (
        <>
          <CompletedFormLayout
            message={"¡Se ha actualizado el producto correctamente!"}
          />
          <ActionBtnsContainer>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (!current.matches("submittingForm")) {
                  closeDrawer();
                }
              }}
              className="mr-3"
            >
              Volver
            </Button>{" "}
          </ActionBtnsContainer>
        </>
      )}
    </Container>
  );
};

export default ProductForm;
