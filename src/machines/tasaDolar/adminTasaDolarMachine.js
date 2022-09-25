import { Machine, assign } from "xstate";
import api from "../../config/api";

export const adminTasaDolarMachine = Machine(
  {
    id: "adminTasaDolarMachine",
    initial: "idle",
    context: {
      selectedBank: "",
      responseMsg: "",
      searchByActive: true,
      search: "",
      tasaDolarActual: [],
      toEdit: false,
      toCreate: false,
      pageInfo: {
        actualPage: 1,
        offset: 0,
        limit: 8,
      },
    },
    states: {
      idle: {
        on: {
          FETCHTASADOLARACTUAL: { target: "fetchTasaDolarActual" },
        },
      },
      fetchTasaDolarActual: {
        invoke: {
          src: (_ctx, evt) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              if (token) {
                try {
                  let formData = new FormData();
                  formData.append("status", _ctx.searchByActive ? "1" : "0");
                  const data = await api.post(
                    "/admin/tasa-dolar/actual",
                    formData,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  const body = await data;
                  console.log(body);
                  if (data.status == 200) {
                    resolve(body);
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
          GOTOEDIT: { actions: "goToEdit" },
          GOTOCREATE: { actions: "goToCreate" },
          GOTODATATABLE: {
            actions: "goToDatatable",
            target: "fetchTasaDolarActual",
          },
          GOBACK: { actions: "goToDatatable" },
          NEXTPAGE: { actions: "nextPage", target: "fetchTasaDolarActual" },
          PREVPAGE: { actions: "prevPage", target: "fetchTasaDolarActual" },
          CLICKPAGE: { actions: "onClickPage", target: "fetchTasaDolarActual" },
          SEARCH: { actions: "searchBanks", target: "fetchTasaDolarActual" },
          SETSEARCHBYACTIVE: {
            actions: "toggleActiveSearch",
            target: "fetchTasaDolarActual",
          },
        },
      },
    },
  },
  {
    actions: {
      setTasaDolarActual: assign({
        tasaDolarActual: (_ctx, evt) => evt.data.data.tasa_dolar,
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
