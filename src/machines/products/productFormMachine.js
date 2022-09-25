import { Machine, assign } from "xstate";
import api from '../../config/api';


export const productFormMachine = Machine(
  {
    id: "productFormMachine",
    initial: "editingForm",
    context: {
      formData: {
        codigo: "",
        nombre: "",
        porcentaje_ganancia: "",
        cantidad: "",
        precio_costo: "",
        precio_venta: "",
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
                    cantidad,
                    precio_costo,
                    porcentaje_ganancia,
                    precio_venta,
                    isInHomepage,
                    image
                  } = _ctx.formData;

                  let route = "/api/productos";

                  formData.append("nombre", nombre);
                  formData.append("cantidad", cantidad);
                  formData.append("image", image);
                  formData.append("precio_costo", precio_costo);
                  formData.append("porcentaje_ganancia", porcentaje_ganancia);
                  formData.append("precio_venta", precio_venta);
                  formData.append("cantidad_minima", 1);

                  let response = "";

                  if (evt.format == "edit") {
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
                  if (response.status === 200) {
                    resolve(body);
                  } else {
                    reject(body.msg);
                  }
                } catch (e) {
                  //error.response.data
                  //console.log(e.response.data);
                  if (e.response.data.code == 422) {
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
          console.log(evt);
          return {
            id: evt.id,
            codigo: evt.codigo,
            nombre: evt.nombre,
            cantidad: evt.cantidad,
            precio_costo: evt.precio_costo,
            porcentaje_ganancia: evt.porcentaje_ganancia,
            precio_venta: evt.precio_venta,
            status: evt.status,
            image: evt.image,
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