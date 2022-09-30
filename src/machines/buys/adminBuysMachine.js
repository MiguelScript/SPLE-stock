import { Machine, assign } from "xstate";
import api from "../../config/api";

export const adminBuysMachine = Machine(
  {
    id: "adminBuysMachine",
    initial: "idle",
    context: {
      selectedInvoice: "",
      responseMsg: "",
      searchByActive: true,
      search: "",
      buys: [],
      totalBuys: 0,
      toEdit: false,
      toCreate: false,
      showInvoice: false,
      pageInfo: {
        actualPage: 1,
        offset: 0,
        limit: 10,
      },
    },
    states: {
      idle: {
        on: {
          FETCHPRODUCTS: { target: "fetchProductos" },
        },
      },
      fetchProductos: {
        invoke: {
          src: (_ctx, evt) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              if (token) {
                try {
                  let formData = new FormData();
                  formData.append("search", _ctx.search);
                  formData.append("limit", _ctx.pageInfo.limit);
                  formData.append("offset", _ctx.pageInfo.offset);
                  formData.append("status", "");
                  const { data: results } = await api.get(
                    "api/compras",
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  resolve(results.data);
                } catch (e) {
                  reject({
                    msg:
                      "Ha ocurrido un error. Verifica tu conexión a internet.",
                  });
                }
              } else {
                reject("No hay token");
              }
            }),
          onDone: {
            target: "dataReady",
            actions: ["setProductos", "setResponseMsg"],
          },
          onError: { target: "dataError", actions: "setResponseMsg" },
        },
      },
      dataReady: {
        on: {
          GOTOEDIT: { actions: "goToEdit" },
          GOTOCREATE: { actions: "goToCreate" },
          SHOWINVOICE: { actions: "goToShowInvoice" },
          GOTODATATABLE: { actions: "goToDatatable", target: "fetchProductos" },
          GOBACK: { actions: "goToDatatable" },
          NEXTPAGE: { actions: "nextPage", target: "fetchProductos" },
          PREVPAGE: { actions: "prevPage", target: "fetchProductos" },
          CLICKPAGE: { actions: "onClickPage", target: "fetchProductos" },
          SEARCH: { actions: "searchProductos", target: "fetchProductos" },
          SETSEARCHBYACTIVE: {
            actions: "toggleActiveSearch",
            target: "fetchProductos",
          },
          FETCHBYLIMIT: { actions: "setLimit", target: "fetchProductos" },
        },
      },
      dataError: {
        on: {
          FETCHPRODUCTS: { target: "fetchProductos" },
          SEARCH: { actions: "searchProductos", target: "fetchProductos" },
        },
      },
    },
  },
  {
    actions: {
      setProductos: assign({
        buys: (_ctx, evt) => evt.data.data,
        totalBuys: (_ctx, evt) => evt.data.data.total,
      }),
      setLimit: assign({
        pageInfo: (_ctx, evt) => {
          return { ..._ctx.pageInfo, limit: parseInt(evt.value) };
        },
      }),
      goToShowInvoice: assign({
        selectedInvoice: (_ctx, evt) => evt.data,
        showInvoice: true,
      }),
      goToEdit: assign({
        selectedInvoice: (_ctx, evt) => evt.data,
        toEdit: true,
      }),
      goToCreate: assign({
        toCreate: true,
      }),
      goToDatatable: assign({
        selectedInvoice: "",
        toEdit: false,
        toCreate: false,
        showInvoice: false,
      }),
      goBack: assign({
        selectedInvoice: "",
        toEdit: false,
        toCreate: false,
        showInvoice: false,
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
      setSelectedInvoice: assign({
        selectedInvoice: (_ctx, evt) => evt.data,
      }),

      clearSelectedInvoice: assign({
        selectedInvoice: "",
      }),
      searchProductos: assign({
        search: (_ctx, evt) => evt.value,
        pageInfo: {
          actualPage: 1,
          offset: 0,
          limit: 10,
        },
      }),
      toggleActiveSearch: assign({
        searchByActive: (_ctx, evt) => evt.value,
      }),
      setResponseMsg: assign({
        fetchError: true,
        responseMsg: (_ctx, evt) => {
          return evt.data.msg;
        },
      }),
      clearResponseMsg: assign({
        fetchError: false,
        responseMsg: "",
      }),
    },
  }
);
