import React from "react";
import { useTheme, SvgIcon, Button, Typography } from "@material-ui/core";
import { ReactComponent as ReferenciaIcon } from "../../../assets/icons/bxs-map-pin.svg";
import { ReactComponent as ActionsIcon } from "../../../assets/icons/bxs-user-badge.svg";
import { ReactComponent as GobackIcon } from "../../../assets/icons/bx-left-arrow-alt.svg";
import { ContactInfo, OrderActions } from "./Customer.styles";
import { ReusableDrawerDispatchContext } from "../../../context/ReusableDrawer/reusable-drawer";
import CambiarEstado from "./Drawers/CambiarEstado";
import { useHistory } from "react-router-dom";
import CustomerForm from "../Drawer/CustomerForm";

export default function CustomerSidebar({ sendParent, customer }) {
  let history = useHistory();
  const theme = useTheme();
  const reusableDrawerDispatch = React.useContext(
    ReusableDrawerDispatchContext
  );

  const handleUpdate = () => {
    reusableDrawerDispatch({
      type: "OPENDRAWER",
      drawerProps: {
        layout: {
          title: "Actualizar cliente",
        },
        customer: customer,
        isEdit: true,
        goToDatagrid: () => {
          sendParent({ type: "FETCHTCUSTOMER", customerId: customer.id });
        },
      },
      component: CustomerForm,
    });
  };

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
            handleUpdate()
          }}
        >
          {" "}
          <Typography variant="subtitle2">
            <SvgIcon component={ReferenciaIcon} className="mr-2"></SvgIcon>
            Editar cliente
          </Typography>
        </Button>
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
