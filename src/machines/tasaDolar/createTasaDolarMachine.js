import { Machine, assign } from "xstate";
import api from '../../config/api';


export const CreateTasaDolarMachine = Machine(
    {
      id: "CreateTasaDolarMachine",
      initial: "editingForm",
      context: {
        formData: {
          tasaDolar: "",
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
                    tasaDolar,
                  } = _ctx.formData;

                  formData.append("tasa", tasaDolar);
          
                  const response = await api.post(
                    "/admin/tasa-dolar/crear",
                    formData,{
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  const body = await response;
                  console.log(body);

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
            onDone: { target: "completedForm", actions: "setResponseMsg" },
            onError: { target: "error", actions: "setResponseMsg" },
          },
        },
        error: {
          on: {
            SETDATA: {
              target: "editingForm",
              actions: ["setFormData", "clearResponseMsg"],
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
          responseMsg: (_ctx, evt) => evt.data.data.msg,
        }),
        clearResponseMsg: assign({
          responseMsg: "",
        }),
      },
    }
  );