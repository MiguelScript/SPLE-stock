import { Machine, assign } from "xstate";
import api from "../../config/api";

export const adminPagoMovilAccountsMachine = Machine(
  {
    id: "adminPagoMovilAccountsMachine",
    initial: "idle",
    context: {
      selectedPagoMovil: "",
      responseMsg: "",
      searchByActive: true,
      search: "",
      PagoMovilAccounts: [],
      totalPagoMovils: 0,
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
          FETCHPAGOMOVILACCOUNTS: { target: "fetchPagoMovilAccounts" },
        },
      },
      fetchPagoMovilAccounts: {
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


                  const data = await api.post(
                    "/admin/metodos-pago/pago-movil",
                    formData, {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                  );
                  console.log(data);
                  const body = await data;
                  console.log(body);
                  if (data.status == 200) {
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
          onDone: { target: "dataReady", actions: "setPagoMovils" },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      deletePagoMovil: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;

              if (token) {
                try {
                  let formData = new FormData();
                  formData.append("id", _ctx.selectedPagoMovil.id);
                  console.log(_ctx.selectedPagoMovil);

                  const response = await api.post(
                    "/admin/metodos-pago/pago-movil/deshabilitar",
                    formData, {
                    headers: { Authorization: `Bearer ${token}` }
                  }
                  );

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
          onDone: {
            target: "fetchPagoMovilAccounts",
            actions: "clearSelectedPagoMovil",
          },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      enablePagoMovil: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;

              if (token) {
                try {
                  const isActive = _ctx.PagoMovilAccounts.find(element => element.plataforma_id === _ctx.selectedPagoMovil.plataforma_id && element.status == 1 && _ctx.selectedPagoMovil.id != element.id);
                  if (!isActive) {
                    let formData = new FormData();
                    formData.append("id", _ctx.selectedPagoMovil.id);
                    console.log(_ctx.selectedPagoMovil);

                    const response = await api.post(
                      "/admin/metodos-pago/pago-movil/habilitar",
                      formData, {
                      headers: { Authorization: `Bearer ${token}` }
                    }
                    );

                    const body = await response;

                    if (response.status == 200) {
                      resolve(body);
                    } else {
                      reject(body);
                    }
                  } else {
                    resolve(true);

                    _ctx.selectedPagoMovil.status = 0;

                  }
                } catch (e) {
                  reject(e);
                }
              } else {
                reject("No hay token");
              }
            }),
          onDone: {
            target: "fetchPagoMovilAccounts",
            actions: "clearSelectedPagoMovil",
          },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      disablePagoMovil: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;

              if (token) {
                try {
                  let formData = new FormData();
                  formData.append("id", _ctx.selectedPagoMovil.id);
                  console.log(_ctx.selectedPagoMovil);

                  const response = await api.post(
                    "/admin/metodos-pago/pago-movil/deshabilitar",
                    formData, {
                    headers: { Authorization: `Bearer ${token}` }
                  }
                  );

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
          onDone: {
            target: "fetchPagoMovilAccounts",
            actions: "clearSelectedPagoMovil",
          },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      dataReady: {
        on: {
          GOTOEDIT: { actions: "goToEdit" },
          GOTOCREATE: { actions: "goToCreate" },
          GOTODATATABLE: {
            actions: "goToDatatable",
            target: "fetchPagoMovilAccounts",
          },
          GOBACK: { actions: "goToDatatable" },
          NEXTPAGE: { actions: "nextPage", target: "fetchPagoMovilAccounts" },
          PREVPAGE: { actions: "prevPage", target: "fetchPagoMovilAccounts" },
          CLICKPAGE: {
            actions: "onClickPage",
            target: "fetchPagoMovilAccounts",
          },
          SEARCH: {
            actions: "searchPagoMovils",
            target: "fetchPagoMovilAccounts",
          },
          DELETEPAGOMOVIL: {
            actions: "setSelectedPagoMovil",
            target: "deletePagoMovil",
          },
          ENABLEPAGOMOVIL: {
            actions: "setSelectedPagoMovil",
            target: "enablePagoMovil",
          },
          DISABLEPAGOMOVIL: {
            actions: "setSelectedPagoMovil",
            target: "disablePagoMovil",
          },
          SETSEARCHBYACTIVE: {
            actions: "toggleActiveSearch",
            target: "fetchPagoMovilAccounts",
          },
        },
      },
    },
  },
  {
    actions: {
      setPagoMovils: assign({
        PagoMovilAccounts: (_ctx, evt) => evt.data.data.data.PagoMovilAccounts,
        totalPagoMovils: (_ctx, evt) => evt.data.data.data.total,
        fetchError: false,
      }),
      goToEdit: assign({
        selectedPagoMovil: (_ctx, evt) => evt.data,
        toEdit: true,
      }),
      goToCreate: assign({
        toCreate: true,
      }),
      goToDatatable: assign({
        selectedPagoMovil: "",
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
      setSelectedPagoMovil: assign({
        selectedPagoMovil: (_ctx, evt) => evt.data,
      }),

      clearSelectedPagoMovil: assign({
        selectedPagoMovil: "",
      }),
      searchPagoMovils: assign({
        search: (_ctx, evt) => evt.value,
      }),
      toggleActiveSearch: assign({
        searchByActive: (_ctx, evt) => evt.value,
      }),
      setResponseMsg: assign({
        fetchError: true,
        pagoMovilAccounts: [],
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
