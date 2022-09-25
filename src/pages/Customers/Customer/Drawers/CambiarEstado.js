import React, { Fragment, useEffect } from "react";
import { ReusableDrawerDispatchContext } from "../../../../context/ReusableDrawer/reusable-drawer";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import { useMachine } from "@xstate/react";
import { cambiarEstadoPedidoMachine } from "../../../../machines/orders/cambiarEstadoPedido";
import { ActionBtnsContainer } from "../../../../components/Common/reusable-drawer";
import { ESTADOS_PEDIDO } from "../../../../config/constants";
import LoadingEllipsis from "../../../../components/Loading/loading-ellipsis";
import CompletedFormLayout from '../../../../components/Common/CompletedFormLayout';
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
    padding: "0rem 1rem",
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

const InstruccionesBox = styled(Col)`
  border-radius: 10px;
  background-color: ${(props) => props.theme.palette.primary.main};
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  h6 {
    color: white;
  }
`;

const CambiarEstadoActionBtnsContainer = styled(ActionBtnsContainer)`
  button.success {
    background-color: ${(props) => props.theme.palette.success.main};
    color: white;
    &:hover {
      background-color: ${(props) => props.theme.palette.success.dark};
    }
  }
`;

const CambiarEstado = ({ order, goToDatagrid }) => {
  const theme = useTheme();

  const reusableDrawerDispatch = React.useContext(
    ReusableDrawerDispatchContext
  );

  const classes = useStyles();

  const [current, send] = useMachine(cambiarEstadoPedidoMachine);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (current.matches("editingForm")) {
      send({ type: "SUBMITFORM" });
    }
  };

  const handleClose = () => {
    reusableDrawerDispatch({ type: "CLOSEDRAWER" });
  };

  const handleStatus = () => {
    if (order.status == "1" && order.tipo == "2") {
      return (
        <>
          <span>{ESTADOS_PEDIDO[parseInt(order.status) + 2].estado}</span>.
          Recuerda,{" "}
          <span>
            {ESTADOS_PEDIDO[parseInt(order.status) + 2].instrucciones}
          </span>
        </>
      );
    }
    if (order.status == "2" && order.tipo == "1") {
      return (
        <>
          <span>{ESTADOS_PEDIDO[parseInt(order.status) + 2].estado}</span>.
          Recuerda,{" "}
          <span>
            {ESTADOS_PEDIDO[parseInt(order.status) + 2].instrucciones}
          </span>
        </>
      );
    }

    return (
      <>
        <span>{ESTADOS_PEDIDO[parseInt(order.status) + 1].estado}</span>.
        Recuerda,{" "}
        <span>{ESTADOS_PEDIDO[parseInt(order.status) + 1].instrucciones}</span>
      </>
    );
  };

  useEffect(() => {
    send({
      type: "LOADDATA",
      data: {
        status: order.status,
        order_id: order.order_id,
        order_tipo: order.tipo,
      },
    });
  }, []);

  useEffect(() => {
    if (current.matches("completedForm")) {
        setTimeout(() => {
          handleClose();
          goToDatagrid();
        }, 2000);
    }
  }, [current]);

  return (
    <Container className={classes.formContainer}>
      <Form onSubmit={handleSubmit} className="form-row">
        {!(current.matches('completedForm')) ? (
          <Fragment>
          <InstruccionesBox xl={12} theme={theme}>
          <Typography variant="h6">
            Estás a punto de cambiar el estado del pedido. El siguiente estado
            es: {handleStatus()}
          </Typography>
        </InstruccionesBox>
        <CambiarEstadoActionBtnsContainer theme={theme}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={() => {
              if (!current.matches("submittingForm")) {
                handleClose();
              }
            }}
            className="mr-3"
          >
            Volver
          </Button>{" "}
          <Button type="submit" variant="contained" className="success">
            {!current.matches("submittingForm") ? (
              "Cambiar el estado del pedido"
            ) : (
              <LoadingEllipsis />
            )}
          </Button>
        </CambiarEstadoActionBtnsContainer>
          </Fragment>
        ) : (
          <CompletedFormLayout message={"¡El estado se ha cambiado correctamente!"}/>
        )}
      </Form>
    </Container>
  );
};

export default CambiarEstado;
