import { ReactComponent as DeliveryIcon } from "../assets/icons/two_wheeler-24px.svg";
import { ReactComponent as PickupIcon } from "../assets/icons/bxs-car.svg";

// **************** ROUTE CONSTANT START **************************
// General Page Section
export const DASHBOARD = "/";
export const STOCK = "/inventario";
export const PRODUCTS = "/inventario/productos";
export const PRODUCTS_OUT_OF_STOCK = "/inventario/sin-existencias";
export const CATEGORY = "/category";
export const LOGIN = "/login";
export const LOGOUT = "/logout";
export const FACTURACION = "/facturacion";
export const CUSTOMERS = "/customers";
export const SETTINGS = "/settings";
export const STAFF_MEMBERS = "/admin-usuarios";
export const SITE_SETTINGS = "/site-settings";
export const TRASFERENCIA_BANCARIA = "/settings/metodos-pago/transferencias-bancarias";
export const PAGO_MOVIL = "/settings/metodos-pago/pago-movil";
// **************** ROUTE CONSTANT END **************************

export const TIPO_PEDIDO = [
  { tipo: "Delivery", icon: DeliveryIcon },
  { tipo: "Pick-up", icon: PickupIcon },
];
export const ESTADOS_PEDIDO = [
  { estado: "En verificación", class: "en-verificacion", instrucciones: "asegurarte que el pago se hizo correctamente." },
  { estado: "En proceso", class: "en-proceso", instrucciones: "asegurarte que todos los productos comprados por el cliente estén facturados y correctamente empacados." },
  { estado: "En camino", class: "en-camino", instrucciones: "asegurarte de darle la dirección correctamente a la persona del delivery, también podrías avisarle al cliente que su pedido está en camino." },
  { estado: "Lista para retirar", class: "en-camino", instrucciones: "asegurarte de informarle al cliente que la orden está lista para retirarla." },
  { estado: "Finalizada", class: "finalizada", instrucciones: "asegurarte de confirmar que el cliente recibió su pedido." },
  { estado: "Cancelado", class: "cancelada" },
];

export const ESTADOS_CLIENTES = [
  { estado: "Activo", class: "activo" },
  { estado: "Bloqueado", class: "bloqueado" },
];
export const ROLES_USUARIOS = [
  { rol: "super-admin", id: 1 },
  { rol: "administrador", id: 2 },
  { rol: "usuario", id: 3 }
];

export const CalcularPrecioVenta = (precio_costo, porcentaje_ganancia) => {
  let ganancia = (precio_costo * porcentaje_ganancia) / 100;
  console.log(ganancia);
  return ganancia + precio_costo;
}


export const ESTADOS_FACTURA = [
  { id: 1, estado: "Finalizada", class: "en-verificacion" },
  { id: 2, estado: "Anulada", class: "en-verificacion" },
];

export const CURRENCY_DEFAULT =
  { prefix: '$', rate: 1 };