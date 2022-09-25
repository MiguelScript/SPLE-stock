import { Machine, assign } from "xstate";
import {backendUrl} from '../config/api';
export const loginFormMachine = Machine(
  {
    id: "loginFormMachine",
    initial: "editingForm",
    context: {
      formData: {
        correo: "",
        contrasena: "",
      },
      responseMsg: "",
      token: "",
    },
    states: {
      editingForm: {
        on: {
          SETFORMDATA: {
            actions: "setFormData",
          },
          CLEARRESPONSEMSG:{
            actions: "clearResponseMsg",
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
              try {
                let formData = new FormData();
                const { correo, contrasena } = _ctx.formData;

                formData.append("email", correo);
                formData.append("password", contrasena);
                const response = await fetch(
                  new URL(
                    `${backendUrl}/api/auth/login`
                  ),
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                const body = await response.json();
                if (response.status == 200) {
                  resolve(body);
                } else {
                  reject(body.msg);
                }
              } catch (e) {
                reject(
                  "¡Ha ocurrido un error! Verifica tu conexión a internet."
                );
              }
            }),
          onDone: {
            target: "validatingAuth",
            actions: "setCompleteResponseMsg",
          },
          onError: { target: "error", actions: "setResponseMsg" },
        },
      },
      validatingAuth:{
        on:{
          COMPLETEFORM:{
            target: "completedForm",
          }
        }
      },
      error: {
        on: {
          SETFORMDATA: {
            target: "editingForm",
            actions:["setFormData", "clearResponseMsg"],
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
      setCompleteResponseMsg: assign({
        responseMsg: (_ctx, evt) => evt.data.msg,
        token: (_ctx, evt) => evt.data.access_token,
      }),
      clearResponseMsg: assign({
        responseMsg: "",
      }),
    },
  }
);
