import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useTheme, Typography } from "@material-ui/core";
import { Header, StatusIndicator } from "./Order.styles";
import moment from "moment";
import localization from "moment/locale/es";
import { TIPO_PEDIDO, ESTADOS_PEDIDO } from "../../../config/constants";

export default function OrderHeader({ estado, tipo, codigo, fechaCreacion }) {
  const theme = useTheme();
  const handleDateReFormat = (date) => {
    let stringDate = moment(new Date(date)).format("LL");
    let StringDia = moment(new Date(date)).format('dddd').charAt(0).toUpperCase() + moment(new Date(date)).format('dddd').slice(1);
    let StringHora = moment(new Date(date)).locale('en').format("LT");
    return (
        `${StringDia}, ${stringDate} ${StringHora} `
    );
  };

  useEffect(() => {
    moment.updateLocale("es", localization);
  }, []);
  return (
    <>
      <Header className="row no-gutters" theme={theme}>
        <Col
          xl={2}
          className="d-flex justify-content-center flex-column align-items-center"
        >
          {" "}
          <Typography
            variant="subtitle1"
            component="span"
            className="text-uppercase mb-1"
          >
            Estado
          </Typography>
          <StatusIndicator
            variant="h6"
            className={`font-weight-bold text-uppercase ${ESTADOS_PEDIDO[estado].class}`}
            theme={theme}
          >
            {ESTADOS_PEDIDO[estado].estado}
          </StatusIndicator>
        </Col>
        <Col
          xl={3}
          className="d-flex justify-content-center flex-column align-items-center"
        >
          {" "}
          <Typography
            variant="subtitle1"
            component="span"
            className="text-uppercase mb-1"
          >
            Tipo
          </Typography>
          <Typography variant="h6" className="font-weight-bold">
            {TIPO_PEDIDO[parseInt(tipo) - 1].tipo}
          </Typography>
        </Col>
        <Col
          xl={4}
          className="d-flex justify-content-center flex-column align-items-center"
        >
          {" "}
          <Typography
            variant="subtitle1"
            component="span"
            className="text-uppercase mb-1"
          >
            Fecha de creación
          </Typography>
          <Typography variant="h6" className="font-weight-bold">
            {handleDateReFormat(fechaCreacion)}
          </Typography>
        </Col>
        <Col
          xl={3}
          className="d-flex justify-content-center flex-column align-items-center"
        >
          {" "}
          <Typography
            variant="subtitle1"
            component="span"
            className="text-uppercase mb-1"
          >
            Código
          </Typography>
          <Typography variant="h6" className="font-weight-bold">
            {codigo}
          </Typography>
        </Col>
      </Header>
    </>
  );
}
