import { Machine, assign } from "xstate";
import api from "../../config/api";

export const updateProductoMachine = Machine(
  {
    id: "updateProductoMachine",
    initial: "editingForm",
    context: {
      formData: {
        id: "",
        codigo: "",
        isInHomepage: "",
        image: "",
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
          SETCHECKBOXDATA: {
            target: "editingForm",
            actions: "setCheckboxFormData",
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
                    isInHomepage,
                    image,
                    codigo,
                  } = _ctx.formData;

                  formData.append("id", id);
                  formData.append("pagina_principal", isInHomepage);
                  formData.append("image", image);
                  formData.append("codigo", codigo);
                  const response = await api.post(
                    "/admin/productos/actualizar",
                    formData,{
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  const body = await response;
                  if (response.status == 200) {
                    resolve(body.msg);
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
          SETCHECKBOXDATA: {
            target: "editingForm",
            actions: ["setCheckboxFormData", "clearResponseMsg"],
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
      setCheckboxFormData: assign({
        formData: (_ctx, evt) => {
          return { ..._ctx.formData, [evt.name]: evt.checked };
        },
      }),
      setProduct: assign({
        formData: (_ctx, evt) => {
          return {
            id: evt.id,
            isInHomepage: evt.isInHomepage,
            imagen: evt.imagen,
            codigo: evt.codigo,
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
