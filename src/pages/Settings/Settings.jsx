import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SettingsCard from "../../components/SettingsCard/SettingsCard";
import { makeStyles } from "@material-ui/core/styles";
import { ReactComponent as CreditCardIcon } from "../../assets/icons/bx-credit-card.svg";
import { ReactComponent as UsersIcon } from "../../assets/icons/bxs-user-account.svg";
import { ReactComponent as UploadIcon } from "../../assets/icons/bx-upload.svg";
import { ReactComponent as MoneyIcon } from "../../assets/icons/bx-money.svg";
import { ReusableDrawerDispatchContext } from "../../context/ReusableDrawer/reusable-drawer";
import SubirInventario from "./Drawers/SubirInventario";
import TasaDolar from "./Drawers/TasaDolar";
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

const Settings = () => {
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
            {//authState.context.userData.rol_id == ROLES_USUARIOS[1].id || authState.context.userData.rol_id == ROLES_USUARIOS[0].id ? (
              <>
                <Col md={6}>
                  <Link
                    to={`/settings/admin-usuarios`}
                    className="text-decoration-none"
                  >
                    <SettingsCard icon={UsersIcon} title="Usuarios" />
                  </Link>
                </Col>
                <Col md={6} className="mb-4">
                  <Link
                    to={`/settings/metodos-pago`}
                    className="text-decoration-none"
                  >
                    <SettingsCard icon={CreditCardIcon} title="Metodos de Pago" />
                  </Link>
                </Col>
              </>

           /*  ) : (
                <>
                </>
              ) */
            }
            <Col md={6}>
              <div
                onClick={() => {
                  reusableDrawerDispatch({
                    type: "OPENDRAWER",
                    drawerProps: {
                      layout: {
                        title: "Subir inventario",
                      },
                    },
                    drawerOptions: {
                      backdrop: "static",
                      keyboard: false,
                    },

                    component: SubirInventario,
                  });
                }}
              >
                <SettingsCard icon={UploadIcon} title="Subir inventario" />
              </div>
            </Col>
            <Col md={6}>
              <div
                onClick={() => {
                  reusableDrawerDispatch({
                    type: "OPENDRAWER",
                    drawerProps: {
                      layout: {
                        title: "Tasa de dolar",
                      },
                    },
                    drawerOptions: {
                      backdrop: "static",
                      keyboard: false,
                    },

                    component: TasaDolar,
                  });
                }}
              >
                <SettingsCard icon={MoneyIcon} title="Tasa de dolar y euro" />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </div >
  );
};

export default Settings;
