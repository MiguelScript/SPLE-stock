import React, { useState, useRef, useEffect } from "react";
import {
  LogoWrapper,
  AuthInput,
  AuthFormCol,
  StyledButton,
  Img
} from "./StyledAuth";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LogoFarmaOnline from '../../assets/img/LogoFullWhite.jpg';
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import { Typography, makeStyles, Collapse } from "@material-ui/core";
import { withRouter } from "react-router-dom";
//import { useMachine } from "@xstate/react";

//import { loginformMachine } from '../../machines/';
//import Alert from '../../components/Alert';
//import { GlobalStateContext, GlobalDispatchContext } from "../../context/global"
const useStyles = makeStyles(theme => ({
  link: {
    color: theme.palette.primary.main
  },
  padding: {
    padding: '20px 40px',
  },
  mgTop: {
    marginTop: '20px'
  },
  title: {
    marginTop: '15px',
  }
}));


const useForceUpdate = () => useState()[1];
function LoginForm({ authData, history }) {
  const classes = useStyles();
  const forceUpdate = useForceUpdate();
  // const [current, send] = useMachine(loginformMachine);
  //const globalDispatch = React.useContext(GlobalDispatchContext);
  //const globalContext = React.useContext(GlobalStateContext);
  const simpleValidator = useRef(
    new SimpleReactValidator({
      messages: {
        required: "* Este campo es requerido",
        email: "El correo electrónico debe ser válido",
        numeric: "El número de teléfono debe ser válido",
      },
    })
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name + "" + value);
    //send({ type: "SETDATA", name, value });
  };
  /* useEffect(()=>{
    if(current.matches('completedForm')){
      globalDispatch({type:'LOGIN',data:current.context.token});
      history.push("/");
    }
},[current]); */

  //const checkEmptyFields = () => current.context.formData.email == "" || current.context.formData.password == "";

  return (
    <div className="d-flex align-items-center justify-content-center flex-column">
      <Container className={classes.padding}>
        <Row>
          <Col>
            <LogoWrapper>
              <Img src={LogoFarmaOnline}></Img>
            </LogoWrapper>

            <Typography variant="h5" className={classes.title}>
              Iniciar sesión en admin
            </Typography>
          </Col>
        </Row>


        <Row>
          <Col>
            <form
              className={classes.mgTop}
              onSubmit={e => {
                e.preventDefault();
                history.push("/");
                /* if (simpleValidator.current.allValid()) {
                  {
                    if (current.matches("editingForm")) {
                    send({ type: "SUBMITFORM" });
                    }
                  }
                } else {
                  simpleValidator.current.showMessages();
                  forceUpdate(e);
                } */
              }}
            >
              <div className="mb-4">
                <AuthFormCol>
                  <i className="fas fa-user"></i>
                  <AuthInput
                    name="email"
                    type="text"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                    label="Correo electrónico"
                  />
                </AuthFormCol>
              </div>
              <div className="mt-3">
                <AuthFormCol>
                  <i className="fas fa-lock"></i>
                  <AuthInput
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange}
                    label="Contraseña"
                  />
                </AuthFormCol>
              </div>

              <AuthFormCol className="auth-form auth-forgot mt-2 ">
                <a href={`wha`}>
                  ¿Has olvidado la contraseña?
          </a>
              </AuthFormCol>
              <div className="d-flex justify-content-center align-items-center flex-column">

                <StyledButton variant="contained" color="primary"
                  type="submit"
                >
                  Ingresar
                </StyledButton>
                {/* <div className="mt-2 d-flex flex-column justify-content-center align-items-center">
            <Typography variant="subtitle1" component="span">
              ¿No tienes una cuenta?
            </Typography>

            <Link to="/registro">
              <Typography
                variant="subtitle1"
                component="span"
                color="primary"
                className={classes.link}
              >
                ¡Regístrate aquí!
              </Typography>
            </Link>
          </div> */}
              </div>
              <div className="col-md-12 d-flex justify-content-center mb-3">
                {/* <Collapse
            in={current.matches("error") || (emailErrorMessage)}
            className={`w-100 `}
            classes={{ wrapperInner: classes.collapseError }}
          >
            <Alert className="w-100 mt-4">
                        {(current.matches("error")) && current.context.responseMsg }
                        {(emailErrorMessage) ? (<Typography variant="body2" component="p" className={classes.helperText}>{simpleValidator.current.errorMessages.email}</Typography>) :('')}
                      </Alert> 
          </Collapse> */}
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default withRouter(LoginForm);
