import React, {
  useRef,
  useEffect,
  useState
} from "react";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import { useMachine } from "@xstate/react";
import SimpleReactValidator from "simple-react-validator";
import { updateUserMachine } from "../../machines/users/updateUserMachine";
import { ReusableDrawerDispatchContext } from "../../context/ReusableDrawer/reusable-drawer";
import { ActionBtnsContainer } from '../Common/reusable-drawer';
import Typography from "@material-ui/core/Typography";
import CompletedFormLayout from '../Common/CompletedFormLayout';
import Collapse from "@material-ui/core/Collapse";

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

const StaffMemberFormUpdate = ({ user, goToDatatable }) => {
  const forceUpdate = useForceUpdate();

  const reusableDrawerDispatch = React.useContext(
    ReusableDrawerDispatchContext
  );

  const classes = useStyles();

  const [current, send] = useMachine(updateUserMachine);

  const handleChange = (e) => {
    const { name, value } = e.target;
    send({ type: "SETDATA", name, value });
  };

  const simpleValidator = useRef(
    new SimpleReactValidator({
      messages: {
        email: "El correo electrónico debe ser válido",
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
    { messages: { required: "El correo es requerido." } }
  );
  let confirmPasswordErrorMessage = simpleValidator.current.message(
    "repcontrasena",
    current.context.formData.repcontrasena,
    `in:${current.context.formData.contraseña}`,
    {
      messages: {
        in: "Las contraseñas deben coincidir.",
        required: "Repetir la contraseña es necesario",
      },
    }
  );
  let passwordErrorMessage = simpleValidator.current.message(
    "contrasena",
    current.context.formData.contraseña,
    `min:8`,
    {
      messages: {
        min: "La contraseña es muy corta.",
        required: "La contraseña es requerida",
      },
    }
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
    send({
      type: "SETFORMDATA",
      usuarioId: user.id,
      nombre: user.name,
      apellido: user.last_name,
      correo: user.email,
      contraseña: user.contraseña,
      rol: user.role_id,
      imagen: user.imagen,
    });
  }, []);

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
                    defaultValue={user.name}
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
                  defaultValue={user.last_name}
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
                  defaultValue={user.email}
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
                    defaultValue={user.role}
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
              <Col md={12}>
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={handleClose}
                  className="mr-3 mt-3"
                >
                  Cambiar Contraseña
              </Button> */}
                <Typography>Cambiar contraseña</Typography>
              </Col>
              <Col md={12}>
                <TextField
                  label="Nueva contraseña"
                  variant="outlined"
                  margin="normal"
                  name="contraseña"
                  onChange={handleChange}
                  fullWidth
                />
              </Col>
              <Col md={12}>
                <TextField
                  label="Repite la contraseña"
                  variant="outlined"
                  margin="normal"
                  name="repcontrasena"
                  onChange={handleChange}
                  fullWidth
                />
              </Col>
              <Col xl={12} className="d-flex justify-content-center mt-2">
                <Collapse
                  in={
                    current.matches("error") ||
                    nombreErrorMessage ||
                    apellidoErrorMessage ||
                    correoErrorMessage ||
                    confirmPasswordErrorMessage ||
                    passwordErrorMessage
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
                  {confirmPasswordErrorMessage ? (
                    <Typography color="error" className="d-flex text-center">
                      *{confirmPasswordErrorMessage}
                    </Typography>
                  ) : null}
                  {passwordErrorMessage ? (
                    <Typography color="error" className="d-flex text-center">
                      *{passwordErrorMessage}
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
                Actualizar usuario
            </Button>
            </ActionBtnsContainer>
          </>
        ) : (
            <CompletedFormLayout message={"¡El usuario se ha actualizado correctamente!"} />
          )}
      </Form>
    </Container>
  );
};

export default StaffMemberFormUpdate;
