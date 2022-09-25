import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SettingsCard from "../../components/SettingsCard/SettingsCard";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as CreditCardIcon } from "../../assets/icons/bx-credit-card.svg";
import { ReactComponent as UsersIcon } from "../../assets/icons/bxs-user-account.svg";
import { ReusableDrawerDispatchContext } from "../../context/ReusableDrawer/reusable-drawer";
import { ROLES_USUARIOS } from "../../config/constants";
import { AuthStateContext } from "../../context/Auth/Auth";


const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: "#f2f3f8",
  },
  paper: {
    marginTop: "15px",
  },
  padding: {
    padding: "15px 0",
  },
  formControl: {
    background: "white",
  },
  migajasContainer: {
    padding: "15px",
    background: "#FFF",
  },
  migajas: {
    justifyContent: "end",
  },
  flex: {
    display: "flex",
    justifyContent: "center",
  },
  flexBetween: {
    display: "flex",
    justifyContent: "space-between",
  },
  media: {
    height: 140,
    backgroundSize: "contain",
  },
  content: {
    marginTop: "1.5rem",
  },
}));

const Stock = () => {
  const classes = useStyles();
  const authState = useContext(AuthStateContext);

  const reusableDrawerDispatch = useContext(
    ReusableDrawerDispatchContext
  );


  return (
    <div>
      <Row className={classes.paper}>
        <Col md={12}>
          <Row>
            <Col md={6}>
              <Link
                to={`/inventario/productos`}
                className="text-decoration-none"
              >
                <SettingsCard icon={UsersIcon} title="Productos" />
              </Link>
            </Col>
            <Col md={6} className="mb-4">
              <Link
                to={`/inventario/productos-sin-existencia`}
                className="text-decoration-none"
              >
                <SettingsCard icon={CreditCardIcon} title="Productos sin existencias" />
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </div >
  );
};

export default Stock;
