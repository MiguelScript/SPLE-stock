import React, { Fragment } from "react";
import {
  useTheme,
  SvgIcon,
  Button,
  Typography,
  ClickAwayListener,
  ButtonBase,
  Tooltip,
} from "@material-ui/core";
import { Row, Col } from "react-bootstrap";
import { ReactComponent as PaymentIcon } from "../../../assets/icons/bx-credit-card.svg";
import { ReactComponent as ProductsIcon } from "../../../assets/icons/bxs-package.svg";
import { ReactComponent as CheckIcon } from "../../../assets/icons/bxs-check-circle.svg";
import { ReactComponent as CambiarMetodoPagoIcon } from "../../../assets/icons/bx-refresh.svg";
import { ReactComponent as CopyIcon } from "../../../assets/icons/bx-copy.svg";
import { ReactComponent as FacturacionIcon } from "../../../assets/icons/bx-book-reader.svg";
import {
  PaymentInfo,
  OrderContent,
  Product,
  ProductsGrid,
  TooltipTitle,
  TooltipButton,
} from "./Order.styles";
import { ReusableDrawerDispatchContext } from "../../../context/ReusableDrawer/reusable-drawer";
import ValidarPago from "./Drawers/ValidarPago";
import CambiarMetodoPago from "./Drawers/CambiarMetodoPago";
import VerDatosCuenta from "./Drawers/VerDatosCuenta";
import Zoom from "@material-ui/core/Zoom";
export default function OrderInfo({ order, sendParent }) {
  const theme = useTheme();
  const reusableDrawerDispatch = React.useContext(
    ReusableDrawerDispatchContext
  );
  const [open, setOpen] = React.useState("");
  const [copiedProducts, setCopiedProducts] = React.useState([]);
  const handleTooltipClose = (id) => {
    if (id == open) {
      setOpen("");
    }
  };

  const handleTooltipOpen = (id) => {
    setOpen(id);
  };

  const handleCopyToClipboard = (producto) => {
    if (!copiedProducts.includes(producto.id)) {
      setCopiedProducts([...copiedProducts, producto.id]);
    }
    navigator.clipboard.writeText(producto.producto_codigo);
    // handleTooltipOpen(producto.id);
    setOpen(producto.id);
  };

  return (
    <>
      <PaymentInfo theme={theme}>
        <Typography variant="h6" className="payment-header-title">
          Información de pago <SvgIcon component={PaymentIcon}></SvgIcon>
        </Typography>
        <Row className="mt-2 w-100 no-gutters">
          <Col xl={3}>
            <Typography variant="h6" className="payment-info-title">
              Plataforma:
            </Typography>
            <div className="payment-info-image">
              <img
                src={`${process.env.REACT_APP_BACKEND_URL_IMG}/cuentas/${order.plataforma_imagen}`}
                alt="imagen_plataforma"
                onError={(e) => {
                  e.target.src = "/images/imagen_no_disponible.png";
                }}
              ></img>
            </div>

            <Typography variant="subtitle1">
              {order.plataforma_nombre}
            </Typography>
          </Col>
          <Col xl={3}>
            <Typography variant="h6" className="payment-info-title">
              Método de pago:
            </Typography>
            <Typography variant="subtitle1">{order.metodo_pago}</Typography>
          </Col>

          <Col xl={3}>
            <Typography variant="h6" className="payment-info-title">
              Cuenta:
            </Typography>
            <Typography variant="subtitle1">{order.nombre_cuenta}</Typography>
            {(order.tipo_cuenta == "Cuenta bancaria" ||
              order.tipo_cuenta == "Cuenta Pago Movil") && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  className="mt-2"
                  onClick={() => {
                    reusableDrawerDispatch({
                      type: "OPENDRAWER",
                      drawerProps: {
                        layout: {
                          title: "Datos de la cuenta",
                        },
                        datosCuenta: {
                          alias: order.nombre_cuenta,
                          tipo_cuenta: order.tipo_cuenta,
                          cuenta: order.cuenta,
                          titular: order.cuenta_titular,
                          documento_identificacion:
                            order.cuenta_documento_identificacion,
                        },
                        goToDatagrid: () => {
                          sendParent({ type: "GOBACK" });
                        },
                      },
                      drawerOptions: {
                        backdrop: "static",
                        keyboard: false,
                      },

                      component: VerDatosCuenta,
                    });
                  }}
                >
                  <SvgIcon
                    component={FacturacionIcon}
                    className="mr-2"
                  ></SvgIcon>
                  Datos
                </Button>
              </>
            )}
            {order.metodo_pago == "transferencia bancaria" && <></>}
          </Col>
          <Col xl={3}>
            <Typography variant="h6" className="payment-info-title">
              Número de referencia:
            </Typography>
            <Typography variant="subtitle1">{order.pago_referencia}</Typography>
          </Col>
          <Col
            xl={12}
            className="mt-2 d-flex justify-content-center align-items-center payment-actions"
          >
            {order.status == 0 && (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-3 validar-btn"
                  onClick={() => {
                    reusableDrawerDispatch({
                      type: "OPENDRAWER",
                      drawerProps: {
                        layout: {
                          title: "Validar el pago del pedido",
                        },
                        order: {
                          status: order.status,
                          order_id: order.id,
                          pago_id: order.pago_id,
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

                      component: ValidarPago,
                    });
                  }}
                >
                  <SvgIcon component={CheckIcon} className="mr-2"></SvgIcon>
                  Validar pago
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  className="cambiar-metodo"
                  onClick={() => {
                    reusableDrawerDispatch({
                      type: "OPENDRAWER",
                      drawerProps: {
                        layout: {
                          title: "Cambiar método de pago del pedido",
                        },
                        order: {
                          order_id: order.id,
                        },
                        goToDatagrid: () => {
                          sendParent({ type: "GOBACK" });
                        },
                      },
                      drawerOptions: {
                        backdrop: "static",
                        keyboard: false,
                      },

                      component: CambiarMetodoPago,
                    });
                  }}
                >
                  <SvgIcon
                    component={CambiarMetodoPagoIcon}
                    className="mr-2"
                  ></SvgIcon>
                  Cambiar método de pago
                </Button>
              </>
            )}
          </Col>
        </Row>
      </PaymentInfo>
      <OrderContent theme={theme}>
        <Typography variant="h6" className="payment-header-title">
          Productos <SvgIcon component={ProductsIcon}></SvgIcon>
        </Typography>
        <ProductsGrid theme={theme}>
          <div className="header-column">
            <Typography>Código</Typography>
          </div>
          <div className="header-column">
            <Typography>Nombre</Typography>
          </div>
          <div className="header-column">
            <Typography>Cantidad</Typography>
          </div>
          <div className="header-column">
            <Typography>Precio U.</Typography>
          </div>
          <div className="header-column">
            <Typography>Precio T.</Typography>
          </div>
          {order.productos.map((producto, index) => (
            <Fragment key={index}>
              <div className="justify-content-center">
                <ClickAwayListener
                  onClickAway={() => {
                    handleTooltipClose(producto.id);
                  }}
                >
                  <div>
                    <Tooltip
                      onClose={() => {
                        handleTooltipClose(producto.id);
                      }}
                      key={producto.id}
                      open={producto.id == open}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      title={
                        <TooltipTitle key={producto.id}>
                          <Typography variant="body2" component="p">
                            El código se ha copiado al cortapapeles.
                          </Typography>{" "}
                        </TooltipTitle>
                      }
                      TransitionComponent={Zoom}
                      arrow
                      placement="bottom"
                    >
                      <TooltipButton
                        onClick={() => {
                          handleCopyToClipboard(producto);
                        }}
                        alreadyCopied={copiedProducts.includes(producto.id)}
                        theme={theme}
                        type="button"
                      >
                        {" "}
                        <Typography className="product-attribute">
                          <SvgIcon component={CopyIcon}></SvgIcon>
                        </Typography>
                      </TooltipButton>
                    </Tooltip>
                  </div>
                </ClickAwayListener>
              </div>
              <div>
                <Product>
                  <div>
                    <img
                      src={
                        producto.imagen != ""
                          ? `${process.env.REACT_APP_BACKEND_URL_IMG_PRODUCTOS}/${producto.imagen}`
                          : "/images/imagen_no_disponible.png"
                      }
                      onError={(e) => {
                  e.target.src = "/images/imagen_no_disponible.png";
                }}></img>
                  </div>
                  <Typography className="ml-2 product-attribute" variant="h6">
                    {producto.producto}
                  </Typography>
                </Product>
              </div>
              <div>
                <Typography className="product-attribute" variant="h6">
                  x {producto.cantidad}
                </Typography>
              </div>
              <div>
                <Typography className="product-attribute" variant="h6">
                  ${producto.precio}
                </Typography>
              </div>
              <div>
                <Typography className="product-attribute" variant="h6">
                  ${producto.total}
                </Typography>
              </div>
            </Fragment>
          ))}
        </ProductsGrid>
        <Row className="mt-2 w-100 no-gutters ">
          <Col
            xl={12}
            className="mt-2 d-flex justify-content-between align-items-center payment-actions"
          >
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h5">${order.total_compra}</Typography>
          </Col>
          <Col
            xl={12}
            className="mt-2 d-flex justify-content-between align-items-center payment-actions"
          >
            <Typography variant="h6">Tasa dolar:</Typography>
            <Typography variant="h5">Bs.S {order.tasa}</Typography>
          </Col>
        </Row>
      </OrderContent>
    </>
  );
}
