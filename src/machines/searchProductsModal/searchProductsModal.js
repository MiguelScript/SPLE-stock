import { Machine, assign } from "xstate";
import api from "../../config/api";

export const searchProductsModal = Machine(
  {
    id: "searchProductsModal",
    initial: "idle",
    context: {
      responseMsg: "",
      search: "",
      productos: [],
      totalProductos: 0,
      pageInfo: {
        actualPage: 1,
        offset: 0,
        limit: 10,
      },
    },
    states: {
      idle: {
        on: {
          SEARCHPRODUCTS: { target: "searchingProductos" },
          //SETPRODUCTS: { target: "dataReady", actions: "setProductos" },
        },
      },
      searchingProductos: {
        on: {
          SETPRODUCTS: { target: "dataReady", actions: "setProductos" },

        }
      },
      dataReady: {
        on: {

          SEARCHPRODUCTS: { target: "searchingProductos" },
          GOTODATATABLE: { actions: "goToDatatable", target: "searchingProductos" },
          GOBACK: { actions: "goToDatatable" },
          NEXTPAGE: { actions: "nextPage", target: "searchingProductos" },
          PREVPAGE: { actions: "prevPage", target: "searchingProductos" },
          CLICKPAGE: { actions: "onClickPage", target: "searchingProductos" },
          SEARCH: { actions: "searchProductos", target: "searchingProductos" },
          SETSEARCHBYACTIVE: {
            actions: "toggleActiveSearch",
            target: "searchingProductos",
          },
          FETCHBYLIMIT: { actions: "setLimit", target: "searchingProductos" },
        },
      },
      dataError: {
        on: {
          SEARCHPRODUCTS: { target: "searchingProductos" },
          SEARCH: { actions: "searchProductos", target: "searchingProductos" },
        },
      },
    },
  },
  {
    actions: {
      setProductos: assign({
        productos: (_ctx, evt) => evt.products,
        totalProductos: (_ctx, evt) => evt.totalProducts,
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
