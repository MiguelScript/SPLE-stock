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
import { subirInventarioMachine } from "../../../machines/subirInventario";
import { ActionBtnsContainer } from "../../../components/Common/reusable-drawer";
import LoadingEllipsis from "../../../components/Loading/loading-ellipsis";
import CompletedFormLayout from "../../../components/Common/CompletedFormLayout";
import DropZone from "../../../components/Common/DropzoneXls";
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
const SubirInventario = ({ closeDrawer }) => {
  const forceUpdate = useForceUpdate();
  const classes = useStyles();

  const [current, send] = useMachine(subirInventarioMachine);

  const simpleValidator = useRef(
    new SimpleReactValidator({
      messages: {
        required: "Este paso es requerido.",
      },
    })
  );
  let fileErrorMessage = simpleValidator.current.message(
    "archivo",
    current.context.formData.archivo,
    "required",
    { messages: { required: "El archivo xls es necesario" } }
  );
  // let referenciaErrorMessage = simpleValidator.current.message(
  //   "referencia",
  //   current.context.formData.referencia,
  //   "required",
  //   { messages: { required: "La referencia es requerida" } }
  // );
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
    if (current.matches("completedForm")) {
      // closeDrawer();
      // setTimeout(() => {
      //   closeDrawer();
      // }, 2000);
    }
  }, [current]);

console.log(current);

  return (
    <Container className={classes.formContainer}>
      {!current.matches("completedForm") ? (
        <Form onSubmit={handleSubmit} className="form-row">
          <Paper className={`${classes.padding} w-100`} elevation={1}>
            <DropZone
              required={fileErrorMessage}
              currentState={current}
              dispatch={send}
              field="archivo"
            />
            <Col xl={12} className="d-flex justify-content-center">
            <Collapse in={current.matches("error") || fileErrorMessage}>
              <Typography
                color="error"
                className="text-center"
              >{`${current.context.responseMsg}`}</Typography>
              {fileErrorMessage ? (
                <Typography color="error" className="d-flex text-center">
                  *{fileErrorMessage}
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
                "Subir inventario"
              ) : (
                <LoadingEllipsis />
              )}
            </Button>
          </ActionBtnsContainer>
        </Form>
      ) : (
        <>
          <CompletedFormLayout
            message={"¡El inventario se ha subido correctamente!"}
          />
          <Typography
            className="text-center"
            variant="subtitle1"
          >{`${current.context.responseMsg}`}</Typography>
          {/* <Typography
            className="text-center"
            variant="subtitle1"
          >{`${current.context.responseLogs}`}</Typography> */}
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

export default SubirInventario;
