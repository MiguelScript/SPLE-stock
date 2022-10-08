import React, { useRef, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Collapse from "@material-ui/core/Collapse";
import Paper from "@material-ui/core/Paper";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import { useMachine } from "@xstate/react";
import SimpleReactValidator from "simple-react-validator";
import { CreateTasaDolarMachine } from "../../../machines/tasaDolar/createTasaDolarMachine";
import { adminTasaDolarMachine } from "../../../machines/tasaDolar/adminTasaDolarMachine";
import { ActionBtnsContainer } from "../../../components/Common/reusable-drawer";
import LoadingEllipsis from "../../../components/Loading/loading-ellipsis";
import CompletedFormLayout from "../../../components/Common/CompletedFormLayout";

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

const TasaDolar = ({ closeDrawer }) => {
  const forceUpdate = useForceUpdate();
  const classes = useStyles();

  const [current, send] = useMachine(CreateTasaDolarMachine);
  const [currentParent, sendParent] = useMachine(adminTasaDolarMachine);


  const simpleValidator = useRef(
    new SimpleReactValidator({
      messages: {
        required: "Este paso es requerido.",
      },
    })
  );
  let tasaDolarErrorMessage = simpleValidator.current.message(
    "rate",
    current.context.formData.rate,
    "required",
    { messages: { required: "La tasa del dolar es necesaria" } }
  );
  // let referenciaErrorMessage = simpleValidator.current.message(
  //   "referencia",
  //   current.context.formData.referencia,
  //   "required",
  //   { messages: { required: "La referencia es requerida" } }
  // );

  const handleChange = (e) => {
    const { name, value } = e.target;
    send({ type: "SETDATA", name, value });
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
    sendParent({ type: 'FETCH' })
  }, []);

  useEffect(() => {
    if (current.matches("completedForm")) {
      // closeDrawer();
      // setTimeout(() => {
      //   closeDrawer();
      // }, 2000);
    }
  }, [current]);

  return (
    <Container className={classes.formContainer}>
      {!current.matches("completedForm") ? (
        <Form onSubmit={handleSubmit} className="form-row">
          <Paper className={`${classes.padding} w-100`} elevation={1}>
            <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput5">
                <Typography>
                  La tasa actual del dolar manejada es: Bs. {currentParent.context.dollarRate.tasa}
                </Typography>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput4">
                <Typography>
                  Cambiar la tasa del dolar y euro
                </Typography>
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <TextField
                  label="Nueva tasa dolar y euro"
                  variant="outlined"
                  name="rate"
                  onChange={handleChange}
                  required={tasaDolarErrorMessage}
                  fullWidth
                />
              </Form.Group>
            </Col>
            <Col xl={12} className="d-flex justify-content-center">
              <Collapse in={current.matches("error") || tasaDolarErrorMessage}>
                <Typography
                  color="error"
                  className="text-center"
                >{`${current.context.responseMsg}`}</Typography>
                {tasaDolarErrorMessage ? (
                  {/* <Typography color="error" className="d-flex text-center">
                    *{tasaDolarErrorMessage}
                  </Typography> */}
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
                "Cambiar tasa"
              ) : (
                  <LoadingEllipsis />
                )}
            </Button>
          </ActionBtnsContainer>
        </Form>
      ) : (
          <>
            <CompletedFormLayout
              message={"¡La tasa se ha cambiado correctamente!"}
            />
            <Typography
              className="text-center"
              variant="subtitle1"
            >{`${current.context.responseMsg}`}</Typography>
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

export default TasaDolar;
