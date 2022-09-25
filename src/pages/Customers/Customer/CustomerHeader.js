import React, { useEffect } from "react";
import { Col } from "react-bootstrap";
import { useTheme, Typography } from "@material-ui/core";
import { Header, StatusIndicator } from "./Customer.styles";
import moment from "moment";
import localization from "moment/locale/es";

export default function CustomerHeader({ nombre, cantidad_pedidos,  fechaCreacion,total_compras }) {
  const theme = useTheme();
  const handleDateReFormat = (date) => {
    let stringDate = moment(new Date(date)).format("LL");
    let StringDia =
      moment(new Date(date)).format("dddd").charAt(0).toUpperCase() +
      moment(new Date(date)).format("dddd").slice(1);
    let StringHora = moment(new Date(date)).locale("en").format("LT");
    return `${StringDia}, ${stringDate} ${StringHora} `;
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
            Nombre
          </Typography>
          <Typography variant="h6" className="font-weight-bold">{nombre}</Typography>
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
            N° de pedidos
          </Typography>
          <Typography variant="h6" className="font-weight-bold">
            {cantidad_pedidos}
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
            className="text-uppercase mb-1 text-center"
          >
            Total de compras finalizadas
          </Typography>
          <Typography variant="h6" className="font-weight-bold">
            ${total_compras}
          </Typography>
        </Col>
      </Header>
    </>
  );
}
