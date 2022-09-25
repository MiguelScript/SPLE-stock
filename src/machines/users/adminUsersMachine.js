import { Machine, assign } from "xstate";
import api from "../../config/api";

export const adminUsersMachine = Machine(
  {
    id: "adminUsersMachine",
    initial: "idle",
    context: {
      selectedUser: "",
      responseMsg: "",
      searchByActive: true,
      search: "",
      users: [],
      totalUsers: 0,
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
          FETCHUSERS: { target: "fetchUsers" },
        },
      },
      fetchUsers: {
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
                  formData.append("status", _ctx.searchByActive ? "1" : "0");

                  const response = await api.post("api/admin-usuarios", formData, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const body = await response;
                  if (response.status == 200) {
                    console.log(body);
                    resolve(body);
                  } else {
                    reject(body);
                  }
                } catch (e) {
                  console.log(e);
                  reject(e);
                }
              } else {
                reject("No hay token");
              }
            }),
          onDone: { target: "dataReady", actions: "setUsers" },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      deleteUser: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              if (token) {
                try {
                  let formData = new FormData();
                  formData.append("id", _ctx.selectedUser.id);
                  console.log(_ctx.selectedUser);

                  const response = await api.post("/admin/usuarios/deshabilitar", formData, {
                    headers: { Authorization: `Bearer ${token}` },
                  });

                  const body = await response;

                  if (response.status == 200) {
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
          onDone: { target: "fetchUsers", actions: "clearSelectedUser" },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      enableUser: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {

              const token = localStorage.token;
              if (token) {
                try {
                  let formData = new FormData();
                  formData.append("id", _ctx.selectedUser.id);
                  console.log(_ctx.selectedUser);

                  const response = await api.post("/admin/usuarios/habilitar", formData, {
                    headers: { Authorization: `Bearer ${token}` },
                  });

                  const body = await response;

                  if (response.status == 200) {
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
          onDone: { target: "fetchUsers", actions: "clearSelectedUser" },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      dataReady: {
        on: {
          GOTOEDIT: { actions: "goToEdit" },
          GOTOCREATE: { actions: "goToCreate" },
          GOTODATATABLE: { actions: "goToDatatable", target: "fetchUsers" },
          GOBACK: { actions: "goToDatatable" },
          NEXTPAGE: { actions: "nextPage", target: "fetchUsers" },
          PREVPAGE: { actions: "prevPage", target: "fetchUsers" },
          CLICKPAGE: { actions: "onClickPage", target: "fetchUsers" },
          SEARCH: { actions: "searchUsers", target: "fetchUsers" },
          DELETEUSER: { actions: "setSelectedUser", target: "deleteUser" },
          ENABLEUSER: { actions: "setSelectedUser", target: "enableUser" },
          SETSEARCHBYACTIVE: {
            actions: "toggleActiveSearch",
            target: "fetchUsers",
          },
        },
      },
    },
  },
  {
    actions: {
      setUsers: assign({
        users: (_ctx, evt) => evt.data.data.data.users,
        //totalUsers: (_ctx, evt) => evt.data.data.total,
        fetchError: false,
      }),
      goToEdit: assign({
        selectedUser: (_ctx, evt) => evt.data,
        toEdit: true,
      }),
      goToCreate: assign({
        toCreate: true,
      }),
      goToDatatable: assign({
        selectedUser: "",
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
      setSelectedUser: assign({
        selectedUser: (_ctx, evt) => evt.data,
      }),

      clearSelectedUser: assign({
        selectedUser: "",
      }),
      searchUsers: assign({
        search: (_ctx, evt) => evt.value,
      }),
      toggleActiveSearch: assign({
        searchByActive: (_ctx, evt) => evt.value,
      }),
      setResponseMsg: assign({
        fetchError: true,
        users: [],
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

/* export const rolesMachine = Machine(
  {
    id: "oMachine",
    initial: "fetchingPaymentMethods",
    context: {
      paymentMethods: {},
      responseMsg: "",
    },
    states: {
      fetchingPaymentMethods: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              if (token) {
                try {
                  const { data: metodosPago } = await api.get(
                    "/admin/metodos-pago/obtener",{
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  resolve(metodosPago);
                } catch (e) {
                  reject("Ha ocurrido un error. Verifica tu conexión.");
                }
              } else {
                reject("No hay token");
              }
            }),
          onDone: {
            target: "paymentMethodsLoaded",
            actions: "setPaymentMethods",
          },
          onError: { target: "error", actions: "setResponseMsg" },
        },
      },
      paymentMethodsLoaded: {},
      error: {},
    },
  },
  {
    actions: {
      setPaymentMethods: assign({
        paymentMethods: (_ctx, evt) => evt.data.data,
      }),
      setResponseMsg: assign({
        responseMsg: (_ctx, evt) => evt.data.msg,
      }),
    },
  }
); */
