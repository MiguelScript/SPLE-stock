import { Machine, assign } from "xstate";
import api from "../../config/api";

export const createUserMachine = Machine(
  {
    id: "createUserMachine",
    initial: "editingForm",
    context: {
      formData: {
        id: "",
        nombre: "",
        apellido: "",
        correo: "",
        contraseña: "",
        imagen: "",
        rol: "",
        status: "",
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
          src: (_ctx, evt) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              if (token) {
                try {
                  let formData = new FormData();
                  const {
                    id,
                    nombre,
                    apellido,
                    correo,
                    contraseña,
                    imagen,
                    rol,
                  } = _ctx.formData;

                  formData.append("id", id);
                  formData.append("name", nombre);
                  formData.append("last_name", apellido);
                  formData.append("email", correo);
                  formData.append("password", contraseña);
                  formData.append("imagen", imagen);
                  formData.append("role", rol);

                  const response = await api.post(
                    "/api/usuarios-crear",
                    formData,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  const body = await response;
                  console.log(body);
                  if (response.status == 201) {
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
          onDone: { target: "completedForm", actions: "setResponseMsg" },
          onError: { target: "error", actions: "setResponseMsg" },
        },
      },
      error: {
        on: {
          SETFORMDATA: {
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
