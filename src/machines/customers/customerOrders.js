import { Machine, assign } from "xstate";
import api from "../../config/api";
import { forEach } from "lodash";
import { cloneDeep, isEmpty } from "lodash";
import first from "lodash/first";
export const customerOrdersMachine = Machine(
  {
    id: "customerOrdersMachine",
    initial: "idle",
    context: {
      responseMsg: "",
      search: "",
      pedidos: [],
      selectedNewOrders: [],
      totalPedidos: 0,
      pageInfo: {
        actualPage: 1,
        offset: 0,
        limit: 10,
      },
      userRole: "",
      customer_id:"",
      status: "",
      selectedOrder: "",
      showOrder: false,
    },
    states: {
      idle: {
        on: {
          FETCHORDERS: { target: "fetchOrders", actions: "setUserRole" },
        },
      },
      fetchOrders: {
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
                  formData.append("status", _ctx.status);
                  formData.append("user_rol", _ctx.userRole);
                  formData.append("customer_id", _ctx.customer_id);
                  const { data: pedidos, status } = await api.post(
                    "/admin/clientes/pedidos",
                    formData,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  resolve(pedidos);
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
            actions: ["setOrders", "setResponseMsg"],
          },
          onError: { target: "dataError", actions: "setResponseMsg" },
        },
      },
      dataReady: {
        on: {
          NEXTPAGE: { actions: "nextPage", target: "fetchOrders" },
          PREVPAGE: { actions: "prevPage", target: "fetchOrders" },
          CLICKPAGE: { actions: "onClickPage", target: "fetchOrders" },
          SEARCH: { actions: "searchOrders", target: "fetchOrders" },
          FETCHBYLIMIT: { actions: "setLimit", target: "fetchOrders" },
          FETCHBYSTATUS: { actions: "setStatus", target: "fetchOrders" },
          GOTOORDER: { actions: "setOrder" },
          GOBACK: { actions: "goBack", target: "fetchOrders" },
        },
      },
      dataError: {
        on: {
          FETCHORDERS: { target: "fetchOrders" },
          SEARCH: { actions: "searchOrders", target: "fetchOrders" },
        },
      },
    },
  },
  {
    actions: {
      setOrders: assign({
        pedidos: (_ctx, evt) =>
          evt.data.data.pedidos.map((pedido) => {
            return { ...pedido, nuevo: false };
          }),
        totalPedidos: (_ctx, evt) => evt.data.data.total_pedidos,
      }),
      setUserRole: assign({
        userRole: (_ctx, evt) => evt.data,
        customer_id:(_ctx, evt) => evt.customer_id
      }),
      setStatus: assign({
        status: (_ctx, evt) => evt.value,
      }),
      setOrder: assign({
        selectedOrder: (_ctx, evt) => evt.data,
        showOrder: true,
      }),
      goBack: assign({
        selectedOrder: "",
        showOrder: false,
      }),
      setLimit: assign({
        pageInfo: (_ctx, evt) => {
          return { ..._ctx.pageInfo, limit: parseInt(evt.value) };
        },
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
      searchOrders: assign({
        search: (_ctx, evt) => evt.value,
        pageInfo: {
          actualPage: 1,
          offset: 0,
          limit: 10,
        },
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
