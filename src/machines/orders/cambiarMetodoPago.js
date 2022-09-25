import { Machine, assign } from "xstate";
import api from "../../config/api";
export const cambiarMetodoPagoMachine = Machine(
  {
    id: "cambiarMetodoPagoMachine",
    initial: "editingForm",
    context: {
      order_id: "",
      formData: {
        referencia: "",
        accountId: "",
        motivo:''
      },
      selectedPayment: {},
      responseMsg:''
    },
    states: {
      editingForm: {
        on: {
          LOADDATA: {
            actions: "loadData",
          },
          SETFORMDATA: {
            actions: "setFormData",
          },
          SUBMITFORM: {
            target: "submittingForm",
          },
          SELECTPAYMENT: {
            actions: "setPayment",
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
                  formData.append("payment_reference", _ctx.formData.referencia);
                  formData.append("account_id", _ctx.formData.accountId);
                  formData.append("motivo", _ctx.formData.motivo);
                  const { data: pedido, status } = await api.post(
                    "admin/pedidos/cambiar-metodo-pago",
                    formData,{
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
          SETFORMDATA: {
            target:"editingForm",actions: "setFormData",
          },
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
      setPayment: assign({
        selectedPayment: (_ctx, evt) => evt.payment,
        formData: (_ctx, evt) => {
          return {
            ..._ctx.formData,
            referencia: evt.referencia,
            accountId: evt.accountId,
          };
        },
      }),
      setResponseMsg: assign({
        responseMsg: (_ctx, evt) => evt.data,
      }),
      loadData: assign({
        order_id: (_ctx, evt) => evt.data.order_id,
      }),
      clearResponseMsg: assign({
        responseMsg: "",
      }),
    },
  }
);

export const metodosPagoMachine = Machine(
  {
    id: "metodosPagoMachine",
    initial: "fetchingPaymentMethods",
    context: {
      paymentMethods: {},
      responseMsg: "",
    },
    states: {
      fetchingPaymentMethods: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              if (token) {
                try {
                  const { data: metodosPago } = await api.get(
                    "/admin/metodos-pago/obtener",{
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  resolve(metodosPago);
                } catch (e) {
                  reject("Ha ocurrido un error. Verifica tu conexión.");
                }
              } else {
                reject("No hay token");
              }
            }),
          onDone: {
            target: "paymentMethodsLoaded",
            actions: "setPaymentMethods",
          },
          onError: { target: "error", actions: "setResponseMsg" },
        },
      },
      paymentMethodsLoaded: {},
      error: {},
    },
  },
  {
    actions: {
      setPaymentMethods: assign({
        paymentMethods: (_ctx, evt) => evt.data.data,
      }),
      setResponseMsg: assign({
        responseMsg: (_ctx, evt) => evt.data.msg,
      }),
    },
  }
);
