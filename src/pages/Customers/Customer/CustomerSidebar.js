import React from "react";
import { useTheme, SvgIcon, Button, Typography } from "@material-ui/core";
import { ReactComponent as CheckIcon } from "../../../assets/icons/bxs-check-circle.svg";
import { ReactComponent as ContactoIcon } from "../../../assets/icons/bx-mobile.svg";
import { ReactComponent as DireccionIcon } from "../../../assets/icons/bxs-map.svg";
import { ReactComponent as ReferenciaIcon } from "../../../assets/icons/bxs-map-pin.svg";
import { ReactComponent as UserIcon } from "../../../assets/icons/bxs-user-circle.svg";
import { ReactComponent as ActionsIcon } from "../../../assets/icons/bxs-user-badge.svg";
import { ReactComponent as GobackIcon } from "../../../assets/icons/bx-left-arrow-alt.svg";
import { ReactComponent as CancelIcon } from "../../../assets/icons/bxs-x-circle.svg";
import { ReactComponent as HorarioIcon } from "../../../assets/icons/bx-timer.svg";
import { ReactComponent as HistorialIcon } from "../../../assets/icons/bx-info-circle.svg";
import { ReactComponent as DIIcon } from "../../../assets/icons/bxs-user-rectangle.svg";
import { ContactInfo, OrderActions } from "./Customer.styles";
import { ReusableDrawerDispatchContext } from "../../../context/ReusableDrawer/reusable-drawer";
import CambiarEstado from "./Drawers/CambiarEstado";
import CancelarPedido from "./Drawers/CancelarPedido";
import HistorialAcciones from "./Drawers/HistorialAcciones";
import { useHistory } from "react-router-dom";
export default function CustomerSidebar({ sendParent, customer }) {
  let history = useHistory();
  const theme = useTheme();
  const reusableDrawerDispatch = React.useContext(
    ReusableDrawerDispatchContext
  );
  return (
    <>
      <OrderActions theme={theme}>
        <Typography variant="subtitle1" className="client-name">
          Acciones <SvgIcon component={ActionsIcon}></SvgIcon>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className="mt-2"
          onClick={() => {
            history.push("/customers")
          }}
        >
          {" "}
          <Typography variant="subtitle2">
            <SvgIcon component={GobackIcon} className="mr-2"></SvgIcon>
            Volver a clientes
          </Typography>
        </Button>
      </OrderActions>
    </>
  );
}
