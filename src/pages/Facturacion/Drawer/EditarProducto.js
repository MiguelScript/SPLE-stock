import React, { useRef, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import { useMachine } from "@xstate/react";
import SimpleReactValidator from "simple-react-validator";
import { updateProductoMachine } from "../../../machines/products/updateProductsMachine";
import { ActionBtnsContainer } from "../../../components/Common/reusable-drawer";
import LoadingEllipsis from "../../../components/Loading/loading-ellipsis";
import CompletedFormLayout from "../../../components/Common/CompletedFormLayout";
import DropZone from "../../../components/Common/DropzoneImg";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  container: {
    backgroundColor: "#f2f3f8",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  padding: {
    padding: "16px",
  },
  formButtoms: {
    position: "absolute",
    bottom: "0",
    width: "100%",
    textAlign: "center",
  },
  flexButtoms: {
    padding: "30px",
  },
}));

const useForceUpdate = () => useState()[1];

const EditarProducto = ({ closeDrawer, producto, goToDatagrid }) => {
  const forceUpdate = useForceUpdate();
  const classes = useStyles();

  const [current, send] = useMachine(updateProductoMachine);

  const simpleValidator = useRef(
    new SimpleReactValidator({
      messages: {
        required: "Este paso es requerido.",
      },
    })
  );
  /* let fileErrorMessage = simpleValidator.current.message(
    "archivo",
    current.context.formData.archivo,
    "required",
    { messages: { required: "El archivo xls es necesario" } }
  ); */

  const handleSubmit = (e) => {
    e.preventDefault();
    if (simpleValidator.current.allValid()) {
      if (current.matches("editingForm")) {
        send({ type: "SUBMITFORM" });
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

  useEffect(() => {
    send({
      type: "SETFORMDATA",
      id: producto.product_id,
      nombre: producto.nombre,
      cantidad: producto.cantidad,
      precio_costo: producto.precio_costo,
      porcentaje_ganancia: producto.porcentaje_ganancia,
      status: producto.status,
      isInHomepage: producto.isInHomepage,
      image: producto.imagen,
      codigo: producto.codigo,
    });
    console.log(current);
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
                  editImage={producto.imagen}
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
                  defaultValue={producto.nombre}
                  //required={}
                  fullWidth
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <TextField
                  label="Precio del costo del producto"
                  variant="outlined"
                  name="precio_costo"
                  onChange={handleChange}
                  defaultValue={producto.precio_costo}
                  //required={}
                  fullWidth
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
                  defaultValue={producto.cantidad}
                  //required={}
                  fullWidth
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                {/* <Typography>%</Typography> */}
                <TextField
                  label="porcentaje ganancia"
                  variant="outlined"
                  name="porcentaje_ganancia"
                  onChange={handleChange}
                  defaultValue={producto.porcentaje_ganancia}
                />
              </Form.Group>
            </Col>
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
              <Collapse in={current.matches("error") /* || fileErrorMessage */}>
                <Typography
                  color="error"
                  className="text-center"
                >{`${current.context.responseMsg}`}</Typography>
                {/*               {fileErrorMessage ? (
                <Typography color="error" className="d-flex text-center">
                  *{fileErrorMessage}
                </Typography>
              ) : null} */}
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
                "Actualizar producto"
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

export default EditarProducto;
