import React, {
  useState,
  useRef,
  useEffect,
} from "react";
import { ReusableDrawerDispatchContext } from "../../context/ReusableDrawer/reusable-drawer";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Paper from "@material-ui/core/Paper";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import { useMachine } from "@xstate/react";
import SimpleReactValidator from "simple-react-validator";
import { createUserMachine } from "../../machines/users/createUserMachine";
import { ActionBtnsContainer } from '../Common/reusable-drawer';
import Collapse from "@material-ui/core/Collapse";
import CompletedFormLayout from '../Common/CompletedFormLayout';
import Typography from "@material-ui/core/Typography";


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

const StaffMemberForm = ({ goToDatatable }) => {
  const forceUpdate = useForceUpdate();

  const reusableDrawerDispatch = React.useContext(
    ReusableDrawerDispatchContext
  );

  const classes = useStyles();

  const [current, send] = useMachine(createUserMachine);

  const handleChange = (e) => {
    const { name, value } = e.target;
    send({ type: "SETDATA", name, value });
  };

  const simpleValidator = useRef(
    new SimpleReactValidator({
      messages: {
        required: "* Este campo es requerido",
      },
    })
  );

  let nombreErrorMessage = simpleValidator.current.message(
    "nombre",
    current.context.formData.nombre,
    "required",
    { messages: { required: "El nombre es requerido" } }
  );
  let apellidoErrorMessage = simpleValidator.current.message(
    "apellido",
    current.context.formData.apellido,
    "required",
    { messages: { required: "El apellido es requerido" } }
  );
  let correoErrorMessage = simpleValidator.current.message(
    "correo",
    current.context.formData.correo,
    "required",
    { messages: { required: "El correo es requerido" } }
  );
  let contraseñaErrorMessage = simpleValidator.current.message(
    "contraseña",
    current.context.formData.contraseña,
    "required",
    { messages: { required: "La contraseña es requerida" } }
  );
  let rolErrorMessage = simpleValidator.current.message(
    "rol",
    current.context.formData.rol,
    "required",
    { messages: { required: "El rol es requerido" } }
  );

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

  const handleClose = () => {
    reusableDrawerDispatch({ type: "CLOSEDRAWER" });
  };


  useEffect(() => {
    if (current.matches("completedForm")) {
      setTimeout(() => {
        handleClose();
        goToDatatable()
      }, 2000);
    }
  }, [current]);

  return (
    <Container className={classes.formContainer}>
      <Form onSubmit={handleSubmit} className="form-row">
        {!(current.matches('completedForm')) ? (
          <>
            <Paper className={`${classes.padding} w-100`} elevation={1}>
              <Col md={12}>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <TextField
                    label="Nombre"
                    variant="outlined"
                    name="nombre"
                    onChange={handleChange}
                    fullWidth
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <TextField
                  label="Apellido"
                  variant="outlined"
                  margin="normal"
                  name="apellido"
                  onChange={handleChange}
                  fullWidth
                />
              </Col>

              <Col md={12}>
                <TextField
                  label="Correo"
                  variant="outlined"
                  margin="normal"
                  type="email"
                  name="correo"
                  onChange={handleChange}
                  fullWidth
                />
              </Col>
              <Col md={12}>
                <TextField
                  label="Contraseña"
                  variant="outlined"
                  margin="normal"
                  type="password"
                  name="contraseña"
                  onChange={handleChange}
                  fullWidth
                />
              </Col>
              <Col md={12}>
                <FormControl variant="outlined" fullWidth margin="normal">
                  <InputLabel id="demo-simple-select-outlined-label">
                    Rol
              </InputLabel>
                  <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    onChange={handleChange}
                    label="Rol"
                    name="rol"
                  >
                    <MenuItem value={0}>
                      <em>Rol</em>
                    </MenuItem>
                    <MenuItem value={3}>Usuario</MenuItem>
                    <MenuItem value={2}>Administrador</MenuItem>
                    <MenuItem value={1}>Super-Admin</MenuItem>
                  </Select>
                </FormControl>
              </Col>

              <Col xl={12} className="d-flex justify-content-center">
                <Collapse
                  in={
                    current.matches("error") ||
                    nombreErrorMessage ||
                    apellidoErrorMessage ||
                    correoErrorMessage ||
                    contraseñaErrorMessage ||
                    rolErrorMessage
                  }
                >
                  <Typography
                    color="error"
                    className="text-center"
                  >{`${current.context.responseMsg}`}</Typography>
                  {apellidoErrorMessage ? (
                    <Typography color="error" className="d-flex text-center">
                      *{apellidoErrorMessage}
                    </Typography>
                  ) : null}
                  {nombreErrorMessage ? (
                    <Typography color="error" className="d-flex text-center">
                      *{nombreErrorMessage}
                    </Typography>
                  ) : null}
                  {correoErrorMessage ? (
                    <Typography color="error" className="d-flex text-center">
                      *{correoErrorMessage}
                    </Typography>
                  ) : null}
                  {contraseñaErrorMessage ? (
                    <Typography color="error" className="d-flex text-center">
                      *{contraseñaErrorMessage}
                    </Typography>
                  ) : null}
                  {rolErrorMessage ? (
                    <Typography color="error" className="d-flex text-center">
                      *{rolErrorMessage}
                    </Typography>
                  ) : null}
                </Collapse>
              </Col>
            </Paper>

            <ActionBtnsContainer>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClose}
                className="mr-3"
                onClick={() => {
                  if (!current.matches("submittingForm")) {
                    handleClose();
                  }
                }}
              >
                Cancelar
            </Button>{" "}
              <Button
                type="submit"
                variant="contained"
                color="primary"
              //disabled={checkEmptyFields()}
              >
                Crear usuario
            </Button>
            </ActionBtnsContainer>
          </>
        ) : (
            <CompletedFormLayout message={"¡El usuario se ha creado correctamente!"} />
          )}
      </Form>
    </Container>
  );
};

export default StaffMemberForm;
