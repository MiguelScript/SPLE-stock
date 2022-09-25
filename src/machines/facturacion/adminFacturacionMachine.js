import { Machine, assign } from "xstate";
import api from "../../config/api";

export const adminFacturacionMachine = Machine(
  {
    id: "adminFacturacionMachine",
    initial: "idle",
    context: {
      selectedInvoice: "",
      responseMsg: "",
      searchByActive: true,
      search: "",
      invoices: [],
      totalInvoices: 0,
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
                    "api/ventas",
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  console.log(results);
                  resolve(results);
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
      deleteProducto: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {
              try {
                let formData = new FormData();
                formData.append("product_id", _ctx.selectedProducto.id);
                const response = await fetch(
                  new URL(
                    `${process.env.REACT_APP_BACKEND_URL}/tienda/disableProduct`
                  ),
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                const body = await response.json();
                if (response.status === 200) {
                  resolve(body);
                } else {
                  reject(body);
                }
              } catch (e) {
                reject(e);
              }
            }),
          onDone: {
            target: "fetchProductos",
            actions: "clearSelectedInvoice",
          },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      enableProducto: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {
              try {
                let formData = new FormData();
                formData.append("product_id", _ctx.selectedProducto.id);

                const response = await fetch(
                  new URL(
                    `${process.env.REACT_APP_BACKEND_URL}/tienda/enableProduct`
                  ),
                  {
                    method: "POST",
                    body: formData,
                  }
                );
                const body = await response.json();
                if (response.status == 200) {
                  resolve(body);
                } else {
                  reject(body);
                }
              } catch (e) {
                reject(e);
              }
            }),
          onDone: {
            target: "fetchProductos",
            actions: "clearSelectedInvoice",
          },
          onError: { target: "dataReady", actions: "setResponseMsg" },
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
          DELETEPRODUCTO: {
            actions: "setSelectedInvoice",
            target: "deleteProducto",
          },
          ENABLEPRODUCTO: {
            actions: "setSelectedInvoice",
            target: "enableProducto",
          },
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
        invoices: (_ctx, evt) => evt.data.data,
        totalInvoices: (_ctx, evt) => evt.data.data.total,
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
