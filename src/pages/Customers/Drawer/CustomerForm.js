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
import { customerFormMachine } from "../../../machines/customers/customerFormMachine";
import { ActionBtnsContainer } from "../../../components/Common/reusable-drawer";
import LoadingEllipsis from "../../../components/Loading/loading-ellipsis";
import CompletedFormLayout from "../../../components/Common/CompletedFormLayout";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { SwicthContainer } from "../../../components/NewInvoice/NewInvoice.styles";
import { Row } from "react-bootstrap";
import { FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";




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

const CustomerForm = ({ closeDrawer, customer, goToDatagrid, isEdit = false, texts }) => {
  const forceUpdate = useForceUpdate();
  const classes = useStyles();

  const [current, send] = useMachine(customerFormMachine);

  const simpleValidator = useRef(
    new SimpleReactValidator({
      messages: {
        required: "Este paso es requerido.",
      },
    })
  );

  let nombreErrorMessage = simpleValidator.current.message(
    "nombre",
    current.context.formData.name,
    "required",
    { messages: { required: "El nombre es requerido" } }

  );

  let precioCostoErrorMessage = simpleValidator.current.message(
    "documento",
    current.context.formData.document,
    "required",
    { messages: { required: "El documento es requerido" } }

  );

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    send({ type: "SETDATA", name, value });
  };

  // useEffect(() => {
  //   //console.log(children);
  //   if (toggled === true) {
  //     setcurrency(
  //       {
  //         prefix: "Bs.S",
  //         rate: SiteDataState.dollarRate.context.dollarRate.tasa,
  //       }
  //     )
  //   } else {
  //     setcurrency(
  //       CURRENCY_DEFAULT
  //     )
  //   }
  // }, [toggled]);

  useEffect(() => {
    if (isEdit) {
      send({
        type: "SETFORMDATA",
        id: customer.id,
        name: customer.nombre,
        typeDocument: customer.tipo_documento,
        document: customer.documento,
        address: customer.direccion,
        phone: customer.telefono,
        status: customer.status,
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
              <Form.Group controlId="exampleForm.ControlInput1">
                <TextField
                  label="Nombre del cliente"
                  variant="outlined"
                  name="name"
                  onChange={handleChange}
                  defaultValue={isEdit ? customer.nombre : ""}
                  //required={}
                  fullWidth
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Row>
                  <Col md={3}>
                    {/* <TextField
                      label="tipo de documento"
                      variant="outlined"
                      name="typeDocument"
                      onChange={handleChange}
                      defaultValue={isEdit ? customer.tipo_documento : ""}
                      //required={}
                      fullWidth
                    /> */}

                    <FormControl variant="outlined" fullWidth>
                      <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        defaultValue={isEdit ? customer.tipo_documento : ""}
                        label="Age"
                        name="typeDocument"
                        onChange={handleChange}
                      >
                        <MenuItem value={"v"}>V</MenuItem>
                        <MenuItem value={"j"}>J</MenuItem>
                        <MenuItem value={"e"}>E</MenuItem>
                      </Select>
                    </FormControl>
                  </Col>
                  <Col md={9}>
                    <TextField
                      label="documento"
                      variant="outlined"
                      name="document"
                      onChange={handleChange}
                      defaultValue={isEdit ? customer.documento : ""}
                      //required={}
                      fullWidth
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <TextField
                  label="telefono"
                  variant="outlined"
                  name="phone"
                  onChange={handleChange}
                  defaultValue={isEdit ? customer.telefono : ""}
                  //required={}
                  fullWidth
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <TextField
                  label="Dirección"
                  variant="outlined"
                  name="address"
                  onChange={handleChange}
                  defaultValue={isEdit ? customer.direccion : ""}
                  //required={}
                  fullWidth
                />
              </Form.Group>
            </Col>
            {isEdit && (
              <>
                {/* <Col xl={12} className="mt-4">
                  <Typography variant='h6'>Opciones</Typography>
                </Col>
                <Col xl={12} className="d-flex">

                  <SwicthContainer>
                    <Switch
                      name="status"
                      color="primary"
                      checked={current.context.formData.status === 1 ? true : false}
                    // onChange={handleToggle}
                    />
                    <Typography
                      variant="subtitle2"
                    >
                      Activo
                    </Typography>
                  </SwicthContainer>
                </Col> */}
              </>
            )}
            <Col xl={12} className="d-flex justify-content-center">
              <Collapse in={
                current.matches("error")
                /* || fileErrorMessage  */
                || nombreErrorMessage
                || precioCostoErrorMessage
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
                {nombreErrorMessage && (
                  <Typography color="error" className="d-flex text-center">
                    *{nombreErrorMessage}
                  </Typography>
                )}
                {precioCostoErrorMessage && (
                  <Typography color="error" className="d-flex text-center">
                    *{precioCostoErrorMessage}
                  </Typography>
                )}
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
            message={"¡Se ha actualizado el cliente correctamente!"}
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

export default CustomerForm;
