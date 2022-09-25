import { Machine, assign } from "xstate";
import api from '../../config/api';


export const CreatePagoMovilMachine = Machine(
    {
      id: "CreatePagoMovilMachine",
      initial: "editingForm",
      context: {
        formData: {
          telefono: "",
          alias: "",
          titular: "",
          documentoIdentificacion: "",
          plataforma: "",
        },
        responseMsg: "",
      },
      states: {
        editingForm: {
          on: {
            SETDATA: {
              actions: "setFormData",
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
                  const {
                    alias,
                    telefono,
                    titular,
                    documentoIdentificacion,
                    plataforma,
                  } = _ctx.formData;

                  formData.append("alias", alias);
                  formData.append("cuenta", telefono);
                  formData.append("titular", titular);
                  formData.append("documento_identificacion", documentoIdentificacion);
                  formData.append("plataforma_id", plataforma);
                  formData.append("tipo_cuenta_id", 2);
                  

                  const response = await api.post(
                    "/admin/metodos-pago/pago-movil/crear",
                    formData,{
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  const body = await response;

                  if (response.status === 200) {
                    resolve(body);
                  } else {
                    reject(body.msg);
                  }
                } catch (e) {
                  reject(e);
                }
              } else {
                reject("No hay token");
              }
                
              }),
            onDone: { target: "completedForm", actions: "setToken" },
            onError: { target: "error", actions: "setResponseMsg" },
          },
        },
        error: {
          on: {
            SETDATA: {
              target: "editingForm",
              actions: ["setFormData", "clearResponseMsg"],
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
        clearResponseMsg: assign({
          responseMsg: "",
        }),
      },
    }
  );