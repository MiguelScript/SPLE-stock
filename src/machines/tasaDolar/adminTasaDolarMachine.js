import { Machine, assign } from "xstate";
import api from "../../config/api";

export const adminTasaDolarMachine = Machine(
  {
    id: "adminTasaDolarMachine",
    initial: "fetchTasaDolarActual",
    context: {
      dollarRate: [],
      responseMsg: ""
    },
    states: {
      fetchTasaDolarActual: {
        invoke: {
          src: (_ctx, evt) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              if (token) {
                try {
                  const data = await api.get("api/tasa-dolar/actual");
                  const body = await data;
                  if (data.status === 200) {
                    resolve(body.data);
                  } else {
                    reject(body);
                  }
                } catch (e) {
                  reject(e);
                }
              } else {
                reject("No hay token");
              }
            }),
          onDone: { target: "dataReady", actions: "setTasaDolarActual" },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      dataReady: {
        on: {
        },
      },
    },
  },
  {
    actions: {
      setTasaDolarActual: assign({
        dollarRate: (_ctx, evt) => evt.data.data,
        fetchError: false,
      }),
      goToEdit: assign({
        selectedBank: (_ctx, evt) => evt.data,
        toEdit: true,
      }),
      goToCreate: assign({
        toCreate: true,
      }),
      goToDatatable: assign({
        selectedBank: "",
        toEdit: false,
        toCreate: false,
      }),
      goBack: assign({
        toEdit: false,
        toCreate: false,
      }),
      nextPage: assign({
        pageInfo: (_ctx, evt) => ({
          ..._ctx.pageInfo,
          actualPage: _ctx.pageInfo.actualPage + 1,
          offset: _ctx.pageInfo.offset + _ctx.pageInfo.limit,
        }),
      }),
      prevPage: assign({
        pageInfo: (_ctx, evt) => ({
          ..._ctx.pageInfo,
          actualPage: _ctx.pageInfo.actualPage - 1,
          offset: _ctx.pageInfo.offset - _ctx.pageInfo.limit,
        }),
      }),
      onClickPage: assign({
        pageInfo: (_ctx, evt) => ({
          ..._ctx.pageInfo,
          actualPage: evt.data,
          offset: (evt.data - 1) * _ctx.pageInfo.limit,
        }),
      }),
      setSelectedBank: assign({
        selectedBank: (_ctx, evt) => evt.data,
      }),

      clearSelectedBank: assign({
        selectedBank: "",
      }),
      searchBanks: assign({
        search: (_ctx, evt) => evt.value,
      }),
      toggleActiveSearch: assign({
        searchByActive: (_ctx, evt) => evt.value,
      }),
      setResponseMsg: assign({
        fetchError: true,
        bankAccounts: [],
        responseMsg: (_ctx, evt) => {
          console.log(evt);
          return evt.data.message;
        },
      }),
      clearResponseMsg: assign({
        fetchError: false,
        responseMsg: "",
      }),
    },
  }
);
