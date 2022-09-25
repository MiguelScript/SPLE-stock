import React, { Fragment, useEffect } from "react";
import { ReusableDrawerDispatchContext } from "../../../../context/ReusableDrawer/reusable-drawer";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import { ActionBtnsContainer } from "../../../../components/Common/reusable-drawer";
import {
    Paper,
    SvgIcon,
    ClickAwayListener,
    Tooltip
} from "@material-ui/core";
import Zoom from "@material-ui/core/Zoom";
import {
    TooltipTitle,
    TooltipButton,
} from "../Order.styles";
import { ReactComponent as CopyIcon } from "../../../../assets/icons/bx-copy.svg";
import NumberFormat from "react-number-format";



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
    dFlex: {
        display: "flex",
        alignItems: "center"
    },
    marginDFtext: {
        marginLeft: "15px"
    }
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

const VerDatosCuenta = ({ datosCuenta, goToDatagrid }) => {
    const theme = useTheme();

    const reusableDrawerDispatch = React.useContext(
        ReusableDrawerDispatchContext
    );

    const classes = useStyles();

    const [open, setOpen] = React.useState("");

    const handleClose = () => {
        reusableDrawerDispatch({ type: "CLOSEDRAWER" });
    };

    /* useEffect(() => {
      send({
        type: "LOADDATA",
        data: {
          status: order.status,
          order_id: order.order_id,
          carrito_id: order.carrito_id
        },
      });
    }, []); */

    /* useEffect(() => {
      if (current.matches("completedForm")) {
        setTimeout(() => {
          handleClose();
          goToDatagrid();
        }, 2000);
      }
    }, [current]); */

    return (
        <Container className={classes.formContainer}>
            <Form className="form-row">
                <Fragment>
                    <Paper className={`p-0 w-100`} elevation={1}>
                        <Col md={12}>
                            <Typography variant="h6">Tipo de cuenta</Typography>
                            <Form.Group>
                                <div className={classes.dFlex}>

                                    <div className="justify-content-center">
                                    </div>
                                    <Typography className={classes.marginDFtext}>{datosCuenta.tipo_cuenta}</Typography>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Typography variant="h6">Alias Cuenta</Typography>
                            <Form.Group>
                                <div className={classes.dFlex}>

                                    <div className="justify-content-center">
                                    </div>
                                    <Typography className={classes.marginDFtext}>{datosCuenta.alias}</Typography>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Typography variant="h6">Numero cuenta</Typography>
                            <Form.Group>
                                <div className={classes.dFlex}>

                                    <div className="justify-content-center">
                                    </div>

                                    <Typography className={classes.marginDFtext}>
                                        <NumberFormat
                                            value={datosCuenta.cuenta}
                                            format={datosCuenta.tipo_cuenta == "Cuenta bancaria"
                                                ? "####-####-####-####-####"
                                                : "####-#######"}
                                            displayType={"text"}
                                        />
                                    </Typography>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Typography variant="h6">Titular de la cuenta</Typography>
                            <Form.Group>
                                <div className={classes.dFlex}>
                                    <div className="justify-content-center">
                                    </div>
                                    <Typography className={classes.marginDFtext}>{datosCuenta.titular}</Typography>
                                </div>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Typography variant="h6">Documento identificacion</Typography>
                            <Form.Group>
                                <div className={classes.dFlex}>

                                    <div className="justify-content-center">
                                    </div>

                                    <Typography className={classes.marginDFtext}>{datosCuenta.documento_identificacion}</Typography>
                                </div>
                            </Form.Group>
                        </Col>
                    </Paper>
                    <CambiarEstadoActionBtnsContainer theme={theme}>
                        <Button
                            type="button"
                            variant="contained"
                            color="primary"
                            className="mr-3"
                            onClick={() => {
                                handleClose();
                            }}
                        >
                            Volver
                        </Button>
                    </CambiarEstadoActionBtnsContainer>
                </Fragment>
            </Form>
        </Container>
    );
};

export default VerDatosCuenta;