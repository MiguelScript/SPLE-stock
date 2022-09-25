import { Machine, assign } from "xstate";
import api from "../../config/api";

export const adminCustomersMachine = Machine(
  {
    id: "adminCustomersMachine",
    initial: "idle",
    context: {
      responseMsg: "",
      search: "",
      clientes: [],
      totalClientes: 0,
      pageInfo: {
        actualPage: 1,
        offset: 0,
        limit: 10,
      },
      userRole: "",
      status: "",
      selectedCustomer: "",
      showCustomer: false,
      showOrder:false,
      selectedOrder:""
    },
    states: {
      idle: {
        on: {
          FETCHCUSTOMERS: { target: "fetchCustomers", actions: "setUserRole" },
        },
      },
      fetchCustomers: {
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
                  const { data: customers, status } = await api.post(
                    "/admin/clientes",
                    formData,{
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  resolve(customers);
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
            actions: ["setCustomers", "setResponseMsg"],
          },
          onError: { target: "dataError", actions: "setResponseMsg" },
        },
      },
      dataReady: {
        on: {
          NEXTPAGE: { actions: "nextPage", target: "fetchCustomers" },
          PREVPAGE: { actions: "prevPage", target: "fetchCustomers" },
          CLICKPAGE: { actions: "onClickPage", target: "fetchCustomers" },
          SEARCH: { actions: "searchCustomers", target: "fetchCustomers" },
          FETCHBYLIMIT: { actions: "setLimit", target: "fetchCustomers" },
          FETCHBYSTATUS: { actions: "setStatus", target: "fetchCustomers" },
          GOTOCUSTOMER: { actions: "setCustomer" },
          GOTOORDER: { actions:"setOrder" },
          GOBACK: { actions: "goBackToCustomer"},
          GOTODATAGRID: { actions: "goBack", target: "fetchCustomers" },
        },
      },
      dataError: {
        on: {
          FETCHORDERS: { target: "fetchCustomers" },
          SEARCH: { actions: "searchCustomers", target: "fetchCustomers" },
        },
      },
    },
  },
  {
    actions: {
      setCustomers: assign({
        clientes: (_ctx, evt) => evt.data.data.clientes,
        totalClientes: (_ctx, evt) => evt.data.data.total_clientes,
      }),
      setUserRole: assign({
        userRole: (_ctx, evt) => evt.data,
      }),
      setStatus: assign({
        status: (_ctx, evt) => evt.value,
      }),
      setCustomer: assign({
        selectedCustomer: (_ctx, evt) => evt.data,
        showCustomer: true,
      }),
      setOrder: assign({
        selectedOrder: (_ctx, evt) => evt.data,
        showCustomer: false,
        showOrder:true
      }),
      goBack: assign({
        selectedCustomer: "",
        showCustomer: false,
      }),
      goBackToCustomer: assign({
        showCustomer: true,
        showOrder:false
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
      searchCustomers: assign({
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
