import { Machine, assign } from "xstate";
import api from "../../config/api";
export const statsMachine = Machine(
  {
    id: "statsMachine",
    initial: "fetchingStats",
    context: {
      month: "",
      stats: {
        products: {
          productsInMinStock: []
        }
      },
      responseMsg: "",
    },
    states: {
      fetchingStats: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;

              if (token) {
                try {

                  let formData = new FormData();
                  formData.append("search", _ctx.search);
                  const fecha = new Date();
                  const mesActual = fecha.getMonth() + 1;
                  formData.append("month", mesActual);


                  const { data: stats } = await api.post(
                    "/api/obtener-estadisticas",
                    formData, {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                  );
                  console.log(stats);
                  resolve(stats);
                } catch (e) {
                  reject('Ha ocurrido un error, comprueba tu conexión a internet.');
                }
              } else {
                reject("No hay token");
              }
            }),
          onDone: {
            target: "statsLoaded",
            actions: "setStats",
          },
          onError: { target: "error", actions: "setResponseMsg" },
        },
      },
      statsLoaded: {},
      error: {},
    },
  },
  {
    actions: {
      setMo: assign({
        stats: (_ctx, evt) => evt.data.data,
      }),
      setStats: assign({
        stats: (_ctx, evt) => evt.data.data,
      }),
      setResponseMsg: assign({
        responseMsg: (_ctx, evt) => evt.data.msg,
      }),
    },
  }
);
