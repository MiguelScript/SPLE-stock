import { Machine, assign } from "xstate";
import api from "../../config/api";

export const validarPedidoMachine = Machine(
  {
    id: "validarPedidoMachine",
    initial: "editingForm",
    context: {
      order_id: "",
      pago_id: "",
      carrito_id: "",
    },
    states: {
      editingForm: {
        on: {
          LOADDATA: {
            actions: "loadData",
          },
          SUBMITFORM: {
            target: "submittingForm",
          },
        },
      },
      submittingForm: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              if (token) {
                try {
                  let formData = new FormData();
                  formData.append("order_id", _ctx.order_id);
                  formData.append("pago_id", _ctx.pago_id);
                  formData.append("carrito_id", _ctx.carrito_id);
                  formData.append("motivo", "Pago aprobado");
                  console.log(_ctx.carrito_id);
                  const { data: pedido, status } = await api.post(
                    "admin/pedidos/aprobar-pago",
                    formData,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  resolve(pedido);
                } catch (e) {
                  reject({
                    msg:
                      "Ha ocurrido un error. Verifica tu conexión a internet.",
                  });
                }
              } else {
                reject("No hay token");
              }
            }),
          onDone: { target: "completedForm" },
          onError: { target: "error", actions: "setResponseMsg" },
        },
      },
      error: {
        on: {
          SUBMITFORM: {
            target: "submittingForm",
          },
        },
      },
      completedForm: {},
    },
  },
  {
    actions: {
      setFormData: assign({
        formData: (_ctx, evt) => {
          return { ..._ctx.formData, [evt.name]: evt.value };
        },
      }),
      setResponseMsg: assign({
        responseMsg: (_ctx, evt) => evt.data,
      }),
      loadData: assign({
        order_id: (_ctx, evt) => evt.data.order_id,
        pago_id: (_ctx, evt) => evt.data.pago_id,
        carrito_id: (_ctx, evt) => evt.data.carrito_id,
      }),
      clearResponseMsg: assign({
        responseMsg: "",
      }),
    },
  }
);
