import { Machine, assign } from "xstate";
import api from "../../config/api";

export const cambiarEstadoPedidoMachine = Machine(
  {
    id: "cambiarEstadoPedidoMachine",
    initial: "editingForm",
    context: {
      order_id: "",
      status: "",
      order_tipo: "",
      monto_total_pedido: "",
      cliente_id: "",
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

                  if ((_ctx.order_tipo == "2" && _ctx.status == "1") || (_ctx.order_tipo == "1" && _ctx.status == "2")) {
                    formData.append("status", parseInt(_ctx.status) + 2);
                  } else {
                    formData.append("status", parseInt(_ctx.status) + 1);
                  }
                  formData.append("order_id", _ctx.order_id);
                  formData.append("motivo", "Estado completado");
                  formData.append("monto_total_pedido", _ctx.monto_total_pedido);
                  formData.append("cliente_id", _ctx.cliente_id);
                  console.log("id del cliente " + _ctx.cliente_id + "monto total del pedido " + _ctx.monto_total_pedido);
                  const { data: pedido, status } = await api.post(
                    "/admin/pedidos/cambiar-status",
                    formData, {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                  );
                  resolve(pedido);
                } catch (e) {
                  reject({
                    msg: "Ha ocurrido un error. Verifica tu conexión a internet.",
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
        status: (_ctx, evt) => evt.data.status,
        order_tipo: (_ctx, evt) => evt.data.order_tipo,
        monto_total_pedido: (_ctx, evt) => evt.data.monto_total_pedido,
        cliente_id: (_ctx, evt) => evt.data.cliente_id,
      }),
      clearResponseMsg: assign({
        responseMsg: "",
      }),
    },
  }
);
