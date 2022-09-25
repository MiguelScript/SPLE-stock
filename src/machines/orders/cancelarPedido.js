import { Machine, assign } from "xstate";
import api from "../../config/api";

export const cancelarPedidoMachine = Machine(
  {
    id: "cancelarPedidoMachine",
    initial: "editingForm",
    context: {
      order_id: "",
      carrito_id: "",
      status: "",
      motivo:''
    },
    states: {
      editingForm: {
        on: {
          LOADDATA: {
            actions: "loadData",
          },
          SETMOTIVO: {
            actions: "setMotivo",
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
  
                  formData.append("status", 5);
                  formData.append("order_id", _ctx.order_id);
                  formData.append("status_actual", _ctx.status);
                  formData.append("carrito_id", _ctx.carrito_id);
                  console.log(_ctx.carrito_id);
                  formData.append("motivo", _ctx.motivo);
                  const { data: pedido, status } = await api.post(
                    "/admin/pedidos/cambiar-status",
                    formData,
                    {
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
      setMotivo: assign({
        motivo: (_ctx, evt) => evt.value,
      }),
      setResponseMsg: assign({
        responseMsg: (_ctx, evt) => evt.data,
      }),
      loadData: assign({
        order_id: (_ctx, evt) => evt.data.order_id,
        status: (_ctx, evt) => evt.data.status,
        carrito_id: (_ctx, evt) => evt.data.carrito_id,
      }),
      clearResponseMsg: assign({
        responseMsg: "",
      }),
    },
  }
);
