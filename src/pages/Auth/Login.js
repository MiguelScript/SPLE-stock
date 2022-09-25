import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { Container, FormControl, Col, InputGroup, Row } from "react-bootstrap";
import {
  useTheme,
  Typography,
  Button,
  SvgIcon,
  Collapse,
} from "@material-ui/core";
import { ReactComponent as CorreoIcon } from "../../assets/icons/bx-envelope.svg";
import { ReactComponent as PassIcon } from "../../assets/icons/bx-lock-alt.svg";
import { loginFormMachine } from "../../machines/login";
import SimpleReactValidator from "simple-react-validator";
import { useMachine } from "@xstate/react";
import { AuthStateContext, AuthDispatchContext } from "../../context/Auth/Auth";
import { withRouter } from "react-router-dom";
import LoadingEllipsis from '../../components/Loading/loading-ellipsis';
const Wrapper = styled(Container)`
  min-width: 100vw;
  min-height: 100vh;
  background-color: ${(props) => props.theme.palette.primary.light};
  > div {
    height: 100vh;
  }
`;

const LoginFormCard = styled.div`
  background-color: #fff;
  width: 532px;
  padding: 1.5rem 3.5rem;
  border-radius: 15px;
`;
const LoginFormHeader = styled.div`
  img {
    width: 70%;
  }
  div {
    // background-color: ${(props) => props.theme.palette.primary.main};
    h6 {
      color: ${(props) => props.theme.palette.primary.main};
    }
  }
`;
const LoginForm = styled.form``;

const StyledInput = styled(InputGroup)`
  > div.input-group-append span {
    background-color: ${(props) => props.theme.palette.primary.main};
    svg {
      color: #fff;
    }
  }
`;
const CompletedFormContainer = styled(Row)`
  div.col-xl-12 {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    img {
      height: 150px;
    }
    h3 {
      text-align: center;
    }
  }
`;
const useForceUpdate = () => useState()[1];
function Login({ history }) {
  const theme = useTheme();
  const [current, send] = useMachine(loginFormMachine);
  const authDispatchContext = React.useContext(AuthDispatchContext);
  const authStateContext = React.useContext(AuthStateContext);
  const forceUpdate = useForceUpdate();
  const simpleValidator = useRef(
    new SimpleReactValidator({
      messages: {
        email: "El correo electrónico debe ser válido",
      },
    })
  );
  let correoErrorMessage = simpleValidator.current.message(
    "correo",
    current.context.formData.correo,
    "email"
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    send({ type: "SETFORMDATA", name, value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (simpleValidator.current.allValid()) {
      {
        if (current.matches("editingForm")) {
          send({ type: "SUBMITFORM" });
        }
      }
    } else {
      send({ type: "CLEARRESPONSEMSG" });
      simpleValidator.current.showMessages();
      forceUpdate(e);
    }
  };
  useEffect(() => {
    if (current.matches("validatingAuth")) {
      authDispatchContext({ type: "LOGIN", token: current.context.token });
      send({ type: "COMPLETEFORM" });
    }
  }, [current]);
  useEffect(() => {
    if (authStateContext.matches("LoggedIn")) {
      setTimeout(() => {
        history.push("/");
      }, 2000);
    }
  }, [authStateContext]);
  useEffect(() => {
    if (authStateContext.matches("LoggedIn")) {
      history.push("/");
    }
  }, []);
  const checkEmptyFields = () =>
    current.context.formData.correo == "" ||
    current.context.formData.contrasena == "";
  return (
    <Wrapper fluid theme={theme}>
      <Container className="d-flex justify-content-center align-items-center">
        <LoginFormCard>
          {!current.matches("completedForm") ? (
            <>
              <LoginFormHeader theme={theme}>
                <img src="/images/LogoFullWhite.png"></img>
                <div>
                  <Typography variant="subtitle1" className="mt-2">
                    Ingresa tus datos para acceder
                  </Typography>
                </div>
              </LoginFormHeader>
              <LoginForm className="form-row mt-3" onSubmit={handleSubmit}>
                <Col xl={12} className="d-flex align-items-start flex-column">
                  <Typography variant="h6">Correo</Typography>
                  <StyledInput theme={theme}>
                    <FormControl
                      name="correo"
                      type="text"
                      onChange={handleChange}
                    ></FormControl>
                    <InputGroup.Append>
                      <InputGroup.Text>
                        <SvgIcon component={CorreoIcon}></SvgIcon>
                      </InputGroup.Text>
                    </InputGroup.Append>{" "}
                  </StyledInput>
                </Col>
                <Col
                  xl={12}
                  className="d-flex align-items-start flex-column mt-3"
                >
                  <Typography variant="h6">Contraseña</Typography>
                  <StyledInput theme={theme}>
                    <FormControl
                      name="contrasena"
                      type="password"
                      onChange={handleChange}
                    ></FormControl>
                    <InputGroup.Append>
                      <InputGroup.Text>
                        <SvgIcon component={PassIcon}></SvgIcon>
                      </InputGroup.Text>
                    </InputGroup.Append>{" "}
                  </StyledInput>
                </Col>
                <Col xl={12} className="d-flex justify-content-center mt-3">
                  <Collapse in={current.matches("error") || correoErrorMessage}>
                    <Typography
                      color="error"
                      className="text-center"
                    >{`${current.context.responseMsg}`}</Typography>
                    {correoErrorMessage ? (
                      <Typography color="error" className="d-flex text-center">
                        *{correoErrorMessage}
                      </Typography>
                    ) : null}
                  </Collapse>
                </Col>
                <Col xl={12} className="mt-4 text-center">
                  <Button
                    variant="contained"
                    color="primary"
                    className="w-50"
                    type="submit"
                    disabled={checkEmptyFields()}
                  >
                    {current.matches("submittingForm") ||
                      current.matches("validatingAuth") ? (
                      <LoadingEllipsis />
                    ) : (
                      "Ingresar"
                    )}
                  </Button>
                </Col>
              </LoginForm>
            </>
          ) : (
            <CompletedFormContainer>
              <Col xl={12}>
                <img src="/images/completed.png"></img>
                <Typography variant="h6">
                  ¡Inicio de sesión completado!
                </Typography>
              </Col>
            </CompletedFormContainer>
          )}
        </LoginFormCard>
      </Container>
    </Wrapper>
  );
}

export default withRouter(Login);
