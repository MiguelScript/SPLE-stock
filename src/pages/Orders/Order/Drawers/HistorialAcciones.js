import React, { Fragment, useEffect } from "react";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Container from "react-bootstrap/Container";
import { ActionBtnsContainer } from "../../../../components/Common/reusable-drawer";
import moment from "moment";
import localization from "moment/locale/es";
//Timelapse imports
import Timeline from "@material-ui/lab/Timeline";
import TimelineItem from "@material-ui/lab/TimelineItem";
import TimelineSeparator from "@material-ui/lab/TimelineSeparator";
import TimelineConnector from "@material-ui/lab/TimelineConnector";
import TimelineContent from "@material-ui/lab/TimelineContent";
import TimelineDot from "@material-ui/lab/TimelineDot";
import TimelineOppositeContent from "@material-ui/lab/TimelineOppositeContent";
import { isEmpty } from "lodash";
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
  paper: {
    padding: "6px 16px",
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

const CambiarEstadoActionBtnsContainer = styled(ActionBtnsContainer)`
  button.success {
    background-color: ${(props) => props.theme.palette.success.main};
    color: white;
    &:hover {
      background-color: ${(props) => props.theme.palette.success.dark};
    }
  }
`;

const HistorialAcciones = ({ order, goToDatagrid, closeDrawer }) => {
  const theme = useTheme();
  useEffect(() => {
    moment.updateLocale("es", localization);
  }, []);
  const classes = useStyles();

  return (
    <Container className={classes.formContainer}>
      {!isEmpty(order.historial) ? (
        <Timeline align="alternate" className="w-100">
          {order.historial.map((accion) => (
            <TimelineItem>
              <TimelineOppositeContent>
                <Typography color="textSecondary">
                  {`${moment(new Date(accion.fecha_accion))
                    .format("LL")} ${moment(new Date(accion.fecha_accion))
                    .locale("en")
                    .format("LT")}`}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Paper elevation={3} className={classes.paper}>
                  <Typography variant="h6" component="h1">
                    {accion.accion}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {`Realizada por: ${accion.usuario_nombre} ${accion.usuario_apellido}`}
                  </Typography>
                  <Typography variant="subtitle1" component="h4">
                    {accion.motivo}
                  </Typography>
                </Paper>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      ) : (
        <div className="w-100">
          <Typography>El historial está actualmente vacío.</Typography>
        </div>
      )}
      <CambiarEstadoActionBtnsContainer theme={theme}>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={closeDrawer}
          className="mr-3"
        >
          Volver
        </Button>
      </CambiarEstadoActionBtnsContainer>
    </Container>
  );
};

export default HistorialAcciones;
