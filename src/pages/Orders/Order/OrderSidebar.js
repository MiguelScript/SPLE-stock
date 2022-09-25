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
import { ReactComponent as FacturacionIcon } from "../../../assets/icons/bx-book-reader.svg";
import { ContactInfo, OrderActions } from "./Order.styles";
import { ReusableDrawerDispatchContext } from "../../../context/ReusableDrawer/reusable-drawer";
import CambiarEstado from "./Drawers/CambiarEstado";
import CancelarPedido from "./Drawers/CancelarPedido";
import HistorialAcciones from "./Drawers/HistorialAcciones";
import VerDatosFacturacion from "./Drawers/VerDatosFacturacion";

export default function OrderSidebar({ sendParent, order }) {
  const theme = useTheme();
  const reusableDrawerDispatch = React.useContext(
    ReusableDrawerDispatchContext
  );
  return (
    <>
      <ContactInfo theme={theme}>
        <Typography variant="subtitle1" className="client-name">
          {order.cliente_nombre} {order.cliente_apellido}{" "}
          <SvgIcon component={UserIcon}></SvgIcon>
        </Typography>
        <Typography variant="subtitle2">Documento de identidad</Typography>
        <Typography variant="subtitle1" className="d-flex align-items-center">
          <SvgIcon component={DIIcon} className="mr-1"></SvgIcon>
          {order.datos_facturacion}
        </Typography>
        <Typography variant="subtitle2">Contacto del pedido</Typography>
        <Typography variant="subtitle1" className="d-flex align-items-center">
          <SvgIcon component={ContactoIcon} className="mr-1"></SvgIcon>
          {order.contacto_numero}
        </Typography>

        <Typography variant="subtitle2">Dirección del pedido</Typography>
        <Typography variant="subtitle1" className="d-flex align-items-center">
          <SvgIcon component={DireccionIcon} className="mr-1"></SvgIcon>
          {order.direccion}
        </Typography>
        <Typography variant="subtitle2">
          Punto de referencia del pedido
        </Typography>
        <Typography variant="subtitle1" className="d-flex align-items-center">
          <SvgIcon component={ReferenciaIcon} className="mr-1"></SvgIcon>
          {order.direccion_punto_referencia}
        </Typography>
        <Typography variant="subtitle2">Horario del pedido</Typography>
        <Typography variant="subtitle1" className="d-flex align-items-center">
          <SvgIcon component={HorarioIcon} className="mr-1"></SvgIcon>
          {order.horario}
        </Typography>
      </ContactInfo>
      <OrderActions theme={theme}>
        <Typography variant="subtitle1" className="client-name">
          Acciones <SvgIcon component={ActionsIcon}></SvgIcon>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className="mt-2"
          onClick={() => {
            reusableDrawerDispatch({
              type: "OPENDRAWER",
              drawerProps: {
                layout: {
                  title: "Datos de facturacion del cliente",
                },
                datosFacturacion: {
                  razon: order.facturacion_razon,
                  documento_identificacion: order.facturacion_documento_identificacion,
                  direccion: order.facturacion_direccion,
                },
                goToDatagrid: () => {
                  sendParent({ type: "GOBACK" });
                },
              },
              drawerOptions: {
                backdrop: "static",
                keyboard: false,
              },

              component: VerDatosFacturacion,
            });
          }}
        >
          {" "}
          <Typography variant="subtitle2">
            <SvgIcon component={FacturacionIcon} className="mr-2"></SvgIcon>
            Ver datos de facturacion
          </Typography>
        </Button>
        {order.status != "0" &&
          order.status != "4" &&
          order.status != "5" &&
          order.status != "6" && (
            <Button
              variant="contained"
              color="primary"
              className="mt-2 btn-cambiar-estado"
              onClick={() => {
                reusableDrawerDispatch({
                  type: "OPENDRAWER",
                  drawerProps: {
                    layout: {
                      title: "Cambiar estado del pedido",
                    },
                    order: {
                      status: order.status,
                      tipo: order.tipo,
                      order_id: order.id,
                      carrito_id: order.carrito_id,
                      total_compra: order.total_compra,
                      cliente_id: order.cliente_id,
                    },
                    goToDatagrid: () => {
                      sendParent({ type: "GOBACK" });
                    },
                  },
                  drawerOptions: {
                    backdrop: "static",
                    keyboard: false,
                  },

                  component: CambiarEstado,
                });
              }}
            >
              {" "}
              <Typography variant="subtitle2">
                <SvgIcon component={CheckIcon} className="mr-2"></SvgIcon>
                Cambiar el estado del pedido
              </Typography>
            </Button>
          )}
        {order.status != "4" && order.status != "5" && order.status != "6" && (
          <Button
            variant="contained"
            color="primary"
            className="mt-2 btn-cancelar"
            onClick={() => {
              reusableDrawerDispatch({
                type: "OPENDRAWER",
                drawerProps: {
                  layout: {
                    title: "Cancelar pedido",
                  },
                  order: {
                    status: order.status,
                    order_id: order.id,
                    carrito_id: order.carrito_id,
                  },
                  goToDatagrid: () => {
                    sendParent({ type: "GOBACK" });
                  },
                },
                drawerOptions: {
                  backdrop: "static",
                  keyboard: false,
                },

                component: CancelarPedido,
              });
            }}
          >
            {" "}
            <Typography variant="subtitle2">
              <SvgIcon component={CancelIcon} className="mr-2"></SvgIcon>
              Cancelar pedido
            </Typography>
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          className="mt-2 btn-historial-acciones"
          onClick={() => {
            reusableDrawerDispatch({
              type: "OPENDRAWER",
              drawerProps: {
                layout: {
                  title: "Historial de acciones",
                },
                order: {
                  historial: order.historial
                },
                goToDatagrid: () => {
                  sendParent({ type: "GOBACK" });
                },
              },
              drawerOptions: {
                backdrop: "static",
                keyboard: false,
              },

              component: HistorialAcciones,
            });
          }}
        >
          {" "}
          <Typography variant="subtitle2">
            <SvgIcon component={HistorialIcon} className="mr-2"></SvgIcon>
            Historial de acciones
          </Typography>
        </Button>
        <Button
          variant="contained"
          color="primary"
          className="mt-2"
          onClick={() => {
            sendParent({ type: "GOBACK" });
          }}
        >
          {" "}
          <Typography variant="subtitle2">
            <SvgIcon component={GobackIcon} className="mr-2"></SvgIcon>
            Volver a pedidos
          </Typography>
        </Button>
      </OrderActions>
    </>
  );
}
