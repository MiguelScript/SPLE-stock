import React, { useRef, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Collapse from "@material-ui/core/Collapse";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useMachine } from "@xstate/react";
import SimpleReactValidator from "simple-react-validator";
import {
  metodosPagoMachine,
  cambiarMetodoPagoMachine,
} from "../../../../machines/orders/cambiarMetodoPago";
import { ActionBtnsContainer } from "../../../../components/Common/reusable-drawer";
import Skeleton from "react-loading-skeleton";
import { isEmpty } from "lodash";
import LoadingEllipsis from "../../../../components/Loading/loading-ellipsis";
import CompletedFormLayout from "../../../../components/Common/CompletedFormLayout";
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
const CambiarMetodoPago = ({ order, goToDatagrid, closeDrawer }) => {
  const forceUpdate = useForceUpdate();
  const classes = useStyles();

  const [currentMetodosPago, sendMetodosPago] = useMachine(metodosPagoMachine);
  const [current, send] = useMachine(cambiarMetodoPagoMachine);

  const handleSelectedPayment = (e) => {
    let payment = e.target.value;
    if (payment.nombre == "Efectivo" || payment.nombre == "Punto de venta") {
      send({
        type: "SELECTPAYMENT",
        payment: payment,
        accountId: "",
        referencia: "No aplica",
      });
    } else {
      send({
        type: "SELECTPAYMENT",
        payment: payment,
        accountId: "",
        referencia: "",
      });
    }
  };

  const simpleValidator = useRef(
    new SimpleReactValidator({
      messages: {
        required: "Este paso es requerido.",
      },
    })
  );
  let referenciaErrorMessage = simpleValidator.current.message(
    "referencia",
    current.context.formData.referencia,
    "required",
    { messages: { required: "La referencia es requerida" } }
  );
  let accountIdErrorMessage = simpleValidator.current.message(
    "accountId",
    current.context.formData.accountId,
    "required",
    { messages: { required: "La forma de pago es requerida" } }
  );
  let motivoErrorMessage = simpleValidator.current.message(
    "motivo",
    current.context.formData.motivo,
    "required",
    { messages: { required: "El motivo es requerido" } }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    send({ type: "SETFORMDATA", name, value });
  };

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

  useEffect(() => {
    send({ type: "LOADDATA", data: { order_id: order.order_id } });
  }, []);
  useEffect(() => {
    if (current.matches("completedForm")) {
      // closeDrawer();
      setTimeout(() => {
        closeDrawer();
        goToDatagrid();
      }, 2000);
    }
  }, [current]);
  return (
    <Container className={classes.formContainer}>
      {!current.matches("completedForm") ? (
        <Form onSubmit={handleSubmit} className="form-row">
          <Paper className={`${classes.padding} w-100`} elevation={1}>
            {currentMetodosPago.matches("paymentMethodsLoaded") ? (
              <>
                <Col md={12}>
                  <FormControl variant="outlined" fullWidth margin="normal">
                    <InputLabel id="demo-simple-select-outlined-label">
                      Método de pago
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      onChange={handleSelectedPayment}
                      label="Método de pago"
                      name="metodoPago"
                    >
                      {Object.values(
                        currentMetodosPago.context.paymentMethods
                      ).map((payment) => (
                        <MenuItem value={payment}>{payment.nombre}</MenuItem>
                      ))}
                      {/* <MenuItem value={0}>
                  <em>Rol</em>
                </MenuItem>
                <MenuItem value={3}>Gerente</MenuItem>
                <MenuItem value={4}>Administrador</MenuItem>
                <MenuItem value={1}>Super-Admin</MenuItem> */}
                    </Select>
                  </FormControl>
                </Col>
              </>
            ) : (
              <Skeleton />
            )}
            {!isEmpty(current.context.selectedPayment) && (
              <Col md={12}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Formas de pago
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    onChange={handleChange}
                    label="Método de pago"
                    name="accountId"
                  >
                    {current.context.selectedPayment.cuentas.map((cuenta) => (
                      <MenuItem
                        key={cuenta.account_id}
                        value={cuenta.account_id}
                      >
                        {cuenta.alias}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Col>
            )}
            <Col md={12}>
              <Typography>Motivo</Typography>
              <Form.Group>
                <TextField
                  label="Motivo"
                  variant="outlined"
                  name="motivo"
                  onChange={handleChange}
                  fullWidth
                />
              </Form.Group>
            </Col>
            {!isEmpty(current.context.selectedPayment) &&
              current.context.selectedPayment.nombre != "Efectivo" && (
                <Col md={12}>
                  <Typography>Referencia</Typography>
                  <Form.Group>
                    <TextField
                      label="Referencia"
                      variant="outlined"
                      name="referencia"
                      onChange={handleChange}
                      fullWidth
                    />
                  </Form.Group>
                </Col>
              )}

            <Col xl={12} className="d-flex justify-content-center">
              <Collapse
                in={
                  current.matches("error") ||
                  referenciaErrorMessage ||
                  accountIdErrorMessage ||
                  motivoErrorMessage
                }
              >
                <Typography
                  color="error"
                  className="text-center"
                >{`${current.context.responseMsg}`}</Typography>
                {accountIdErrorMessage ? (
                  <Typography color="error" className="d-flex text-center">
                    *{accountIdErrorMessage}
                  </Typography>
                ) : null}
                {referenciaErrorMessage ? (
                  <Typography color="error" className="d-flex text-center">
                    *{referenciaErrorMessage}
                  </Typography>
                ) : null}
                {motivoErrorMessage ? (
                  <Typography color="error" className="d-flex text-center">
                    *{motivoErrorMessage}
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
            <Button type="submit" variant="contained" color="primary">
              {!current.matches("submittingForm") ? (
                "Cambiar método de pago"
              ) : (
                <LoadingEllipsis />
              )}
            </Button>
          </ActionBtnsContainer>
        </Form>
      ) : (
        <CompletedFormLayout
          message={"¡El cambio de método de pago se ha realizado correctamente!"}
        />
      )}
    </Container>
  );
};

export default CambiarMetodoPago;
