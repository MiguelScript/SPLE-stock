import { Machine, assign } from "xstate";
import api from '../../config/api';


export const customerFormMachine = Machine(
  {
    id: "customerFormMachine",
    initial: "editingForm",
    context: {
      formData: {
        code: "",
        name: "",
        typeDocument: "",
        document: "",
        address: "",
        phone: "",
        status: "",
      },
      responseMsg: "",
    },
    states: {
      editingForm: {
        on: {
          SETFORMDATA: {
            actions: "setProduct",
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
          src: (_ctx, evt) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              if (token) {
                try {
                  let formData = new FormData();
                  const {
                    id,
                    code,
                    name,
                    typeDocument,
                    document,
                    address,
                    phone,
                    status,
                  } = _ctx.formData;

                  let route = "/api/clientes";

                  formData.append("nombre", name);
                  formData.append("tipo_documento", typeDocument);
                  formData.append("documento", document);
                  formData.append("telefono", phone);
                  formData.append("direccion", address);

                  let response = "";

                  if (evt.format === "edit") {
                    formData.append("_method", "PUT")
                    response = await api.post(
                      route + "/" + id,
                      formData,
                      {
                        headers: { Authorization: `Bearer ${token}` },
                      }
                    );

                  } else {
                    response = await api.post(
                      route,
                      formData, {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                    );
                  }

                  const body = await response;
                  console.log(response);
                  if (response.status === 200 || response.status === 201) {
                    resolve(body);
                  } else {
                    reject(body.msg);
                  }
                } catch (e) {
                  //error.response.data
                  //console.log(e.response.data);
                  if (e.response.data.code === 400) {
                    reject(e.response.data.error);
                  }

                  reject(e)
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
      setProduct: assign({
        formData: (_ctx, evt) => {
          return {
            id: evt.id,
            name: evt.name,
            typeDocument: evt.typeDocument,
            document: evt.document,
            address: evt.address,
            phone: evt.phone,
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