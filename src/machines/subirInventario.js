import { Machine, assign } from "xstate";
import api from "../config/api";
export const subirInventarioMachine = Machine(
  {
    id: "subirInventarioMachine",
    initial: "editingForm",
    context: {
      formData: {
        archivo:''
      },
      responseMsg:'',
      responseLogs: ''
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
                  formData.append("inventario_productos", _ctx.formData.archivo);
                  const { data: subir, status } = await api.post(
                    "admin/productos/subir",
                    formData,{
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  resolve(subir);
                } catch (e) {
                  reject({
                    msg: "Ha ocurrido un error. Verifica tu conexión a internet.",
                  });
                }
              } else {
                reject("No hay token");
              }
            }),
          onDone: { target: "completedForm", actions: "setResponseMsg" },
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
      setResponseMsg: assign({
        responseMsg: (_ctx, evt) => evt.data.msg,
        responseLogs: (_ctx, evt) => evt.data.logs,
      }),
      clearResponseMsg: assign({
        responseMsg: "",
        responseLogs: "",
      }),
    },
  });
