import { Machine, assign } from "xstate";
import api from "../../config/api";

export const adminProductsMachine = Machine(
  {
    id: "adminProductsMachine",
    initial: "idle",
    context: {
      selectedProducto: "",
      responseMsg: "",
      searchByActive: true,
      search: "",
      filters: null,
      productos: [],
      totalProductos: 0,
      toEdit: false,
      toCreate: false,
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

                  let route = `?search=${_ctx.search}&page=${_ctx.pageInfo.offset}&results=${_ctx.pageInfo.limit}&filters=${_ctx.filters}`
                  const { data: productos, status } = await api.get(
                    "api/productos" + route,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  resolve(productos.data);

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
            actions: "clearSelectedProducto",
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
            actions: "clearSelectedProducto",
          },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      dataReady: {
        on: {
          GOTOEDIT: { actions: "goToEdit" },
          GOTOCREATE: { actions: "goToCreate" },
          GOTODATATABLE: { actions: "goToDatatable", target: "fetchProductos" },
          GOBACK: { actions: "goToDatatable" },
          NEXTPAGE: { actions: "nextPage", target: "fetchProductos" },
          PREVPAGE: { actions: "prevPage", target: "fetchProductos" },
          CLICKPAGE: { actions: "onClickPage", target: "fetchProductos" },
          SEARCH: { actions: "searchProductos", target: "fetchProductos" },
          DELETEPRODUCTO: {
            actions: "setSelectedProducto",
            target: "deleteProducto",
          },
          ENABLEPRODUCTO: {
            actions: "setSelectedProducto",
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
        productos: (_ctx, evt) => evt.data.data,
        totalProductos: (_ctx, evt) => evt.data.total,
      }),
      setLimit: assign({
        pageInfo: (_ctx, evt) => {
          return { ..._ctx.pageInfo, limit: parseInt(evt.value) };
        },
      }),
      goToEdit: assign({
        selectedProducto: (_ctx, evt) => evt.data,
        toEdit: true,
      }),
      goToCreate: assign({
        toCreate: true,
      }),
      goToDatatable: assign({
        selectedProducto: "",
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
      setSelectedProducto: assign({
        selectedProducto: (_ctx, evt) => evt.data,
      }),

      clearSelectedProducto: assign({
        selectedProducto: "",
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
