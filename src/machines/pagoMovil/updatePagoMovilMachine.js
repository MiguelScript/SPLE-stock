import { Machine, assign } from "xstate";
import api from '../../config/api';


export const updatePagoMovilMachine = Machine(
  {
    id: "updatePagoMovilMachine",
    initial: "editingForm",
    context: {
      formData: {
        id: "",
        alias: "",
        titular: "",
        telefono: "",
        documentoIdentificacion: "",
        plataforma: ""
      },
      responseMsg: "",
    },
    states: {
      editingForm: {
        on: {
          SETFORMDATA: {
            actions: "setPagoMovil",
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
                    telefono,
                    documentoIdentificacion,
                    plataforma
                  } = _ctx.formData;
  
                  formData.append("id", id);
                  formData.append("alias", alias);
                  formData.append("titular", titular);
                  formData.append("cuenta", telefono);
                  formData.append("documento_identificacion", documentoIdentificacion);
                  formData.append("plataforma_id", plataforma);
                  formData.append("tipo_cuenta_id", 2);
  
  
                  const response = await api.post(
                    "/admin/metodos-pago/pago-movil/actualizar",
                    formData,{
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
      setPagoMovil: assign({
        formData: (_ctx, evt) => {
          return {
            id: evt.pagoMovilId,
            alias: evt.alias,
            telefono: evt.telefono,
            titular: evt.titular,
            documentoIdentificacion: evt.documentoIdentificacion,
            plataforma: evt.plataforma
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