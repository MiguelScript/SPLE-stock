import React, { Fragment } from "react";
import { useTheme, SvgIcon, Button, Typography } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { ReactComponent as PaymentIcon } from "../../../assets/icons/bx-credit-card.svg";
import { ReactComponent as ProductsIcon } from "../../../assets/icons/bxs-package.svg";
import { ReactComponent as CheckIcon } from "../../../assets/icons/bxs-check-circle.svg";
import { ReactComponent as CambiarMetodoPagoIcon } from "../../../assets/icons/bx-refresh.svg";
import {
  PaymentInfo,
  OrderContent,
  Product,
  ProductsGrid,
} from "./Customer.styles";
import { ReusableDrawerDispatchContext } from "../../../context/ReusableDrawer/reusable-drawer";
import ValidarPago from "./Drawers/ValidarPago";
import CambiarMetodoPago from "./Drawers/CambiarMetodoPago";
import CustomerOrders from "./CustomerOrders";
export default function CustomerInfo({ order, sendParent,currentParent }) {
  const theme = useTheme();
  const reusableDrawerDispatch = React.useContext(
    ReusableDrawerDispatchContext
  );
  return (
    <>
      <PaymentInfo theme={theme}>
        <Typography variant="h6" className="payment-header-title">
          Ordenes <SvgIcon component={PaymentIcon}></SvgIcon>
        </Typography>
        <Row className="mt-2 w-100 no-gutters">
         <CustomerOrders currentParent={currentParent} sendParent={sendParent} />
        </Row>
      </PaymentInfo>
    </>
  );
}
