import { Machine, assign } from "xstate";
import api from "../../config/api";

export const CreateBankMachine = Machine(
  {
    id: "CreateBankMachine",
    initial: "editingForm",
    context: {
      formData: {
        cuenta: "",
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
                    cuenta,
                    titular,
                    documentoIdentificacion,
                    plataforma,
                  } = _ctx.formData;

                  const regex = /-/gi;
                  
                  formData.append("alias", alias);
                  formData.append("cuenta", cuenta.replace(regex,''));
                  formData.append("titular", titular);
                  formData.append(
                    "documento_identificacion",
                    documentoIdentificacion
                  );
                  formData.append("plataforma_id", plataforma);
                  formData.append("tipo_cuenta_id", 1);

                  const response = await api.post(
                    "/admin/metodos-pago/bancos/crear",
                    formData,{
                      headers: { Authorization: `Bearer ${token}` }
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
