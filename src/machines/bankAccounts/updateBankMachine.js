import { Machine, assign } from "xstate";
import api from "../../config/api";

export const updateBankMachine = Machine(
  {
    id: "updateBankMachine",
    initial: "editingForm",
    context: {
      formData: {
        id: "",
        alias: "",
        titular: "",
        cuenta: "",
        documentoIdentificacion: "",
        plataforma: "",
      },
      responseMsg: "",
    },
    states: {
      editingForm: {
        on: {
          SETFORMDATA: {
            actions: "setBank",
          },
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
                    id,
                    alias,
                    titular,
                    cuenta,
                    documentoIdentificacion,
                    plataforma,
                  } = _ctx.formData;

                  const regex = /-/gi;
                  

                  formData.append("id", id);
                  formData.append("alias", alias);
                  formData.append("titular", titular);
                  formData.append("cuenta", cuenta.replace(regex,''));
                  formData.append(
                    "documento_identificacion",
                    documentoIdentificacion
                  );
                  formData.append("plataforma_id", plataforma);
                  formData.append("tipo_cuenta_id", 1);

                  const response = await api.post(
                    "/admin/metodos-pago/bancos/actualizar",
                    formData,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  const body = await response;
                  console.log(response);
                  if (response.status == 200) {
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
          onDone: { target: "completedForm" },
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
      setBank: assign({
        formData: (_ctx, evt) => {
          return {
            id: evt.bankId,
            alias: evt.alias,
            cuenta: evt.cuenta,
            titular: evt.titular,
            unidades: evt.unidades,
            documentoIdentificacion: evt.documentoIdentificacion,
            plataforma: evt.plataforma,
          };
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
