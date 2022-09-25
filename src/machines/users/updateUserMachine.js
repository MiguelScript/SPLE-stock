import { Machine, assign } from "xstate";
import api from "../../config/api";

export const updateUserMachine = Machine(
  {
    id: "updateUserMachine",
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
          SETFORMDATA: {
            actions: "setUser",
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
                    "/api/usuarios-actualizar",
                    formData,
                    {
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
      setUser: assign({
        formData: (_ctx, evt) => {
          return {
            id: evt.usuarioId,
            nombre: evt.nombre,
            apellido: evt.apellido,
            correo: evt.correo,
            contraseña: evt.contraseña,
            rol: evt.rol,
            imagen: evt.imagen,
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
