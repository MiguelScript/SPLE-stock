import React, { useEffect, Fragment } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Typography, SvgIcon, useTheme } from "@material-ui/core";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { Button } from "@material-ui/core";
import { isEmpty } from "lodash";
import { ReactComponent as DIIcon } from "../../assets/icons/bxs-user-rectangle.svg";
import { ReactComponent as UsuariosIcon } from "../../assets/icons/bxs-user-circle.svg";
import { ReactComponent as PedidosIcon } from "../../assets/icons/bxs-package.svg";
import { ReactComponent as TotalVentasIcon } from "../../assets/icons/bxs-dollar-circle.svg";
import { ReactComponent as UsuariosRegistradosIcon } from "../../assets/icons/bxs-user-plus.svg";
import { useMachine } from "@xstate/react";
import { statsMachine } from "../../machines/dashboard/stats";
import {
  DataGridHeader,
  DataGridContainer,
  DataGrid,
  MainColumn,
} from "../../components/data-grid/data-grid.styles";
import LoadingSpinner from "../../components/Loading/LoadingSpinner";
import DashboardCard from "../../components/Dashboard/DashboardCard";

const Dashboard = () => {
  const theme = useTheme();
  // const [current, send] = useMachine(statsMachine);

  return (
    <Container fluid>
      <Row>
        <Col xl={12}>
          <Typography
            variant="h6"
          >
            Inicio
          </Typography>
        </Col>
      </Row>
      <Row className="no-gutters">

      </Row>
    </Container>
  );
};

export default Dashboard;
