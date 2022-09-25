import { Machine, assign } from "xstate";
import api from "../../config/api";
import isEmpty from "lodash/isEmpty";


export const adminBankAccountsMachine = Machine(
  {
    id: "adminBankAccountsMachine",
    initial: "idle",
    context: {
      selectedBank: "",
      responseMsg: "",
      searchByActive: true,
      search: "",
      bankAccounts: [],
      totalBanks: 0,
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
          FETCHBANKACCOUNTS: { target: "fetchBankAccounts" },
        },
      },
      fetchBankAccounts: {
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

                  const data = await api.post(
                    "/admin/metodos-pago/bancos",
                    formData,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  const body = await data;
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
          onDone: { target: "dataReady", actions: "setBanks" },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      deleteBank: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              
              if (token) {
                try {
                  let formData = new FormData();
                  formData.append("id", _ctx.selectedBank.id);

                  const response = await api.post(
                    "/admin/metodos-pago/bancos/eliminar",
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

              }
              else {
                reject("No hay token");
              }

            }),
          onDone: { target: "fetchBankAccounts", actions: "clearSelectedBank" },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      enableBank: {
        invoke: {
          src: (_ctx, evt) =>
            new Promise(async (resolve, reject) => {

              const token = localStorage.token;
              if (token) {
                try {

                  const isActive = _ctx.bankAccounts.find(element => element.plataforma_id === _ctx.selectedBank.plataforma_id && element.status == 1 && _ctx.selectedBank.id != element.id);

                  if (!isActive) {
                    let formData = new FormData();
                    formData.append("id", _ctx.selectedBank.id);
                    formData.append("status", 1);

                    const response = await api.post(
                      "/admin/metodos-pago/bancos/habilitar",
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
                    _ctx.selectedBank.status = 0;

                    resolve(true);


                  }
                } catch (e) {
                  reject(e);
                }
              } else {
                reject("No hay token");

              }

            }),
          onDone: { target: "fetchBankAccounts", actions: "clearSelectedBank" },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      disableBank: {
        invoke: {
          src: (_ctx) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              
              if (token) {
                try {
                  let formData = new FormData();
                  formData.append("id", _ctx.selectedBank.id);
                  formData.append("status", 0);

                  const response = await api.post(
                    "/admin/metodos-pago/bancos/deshabilitar",
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

              }
              else {
                reject("No hay token");
              }

            }),
          onDone: { target: "fetchBankAccounts", actions: "clearSelectedBank" },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      dataReady: {
        on: {
          GOTOEDIT: { actions: "goToEdit" },
          GOTOCREATE: { actions: "goToCreate" },
          GOTODATATABLE: {
            actions: "goToDatatable",
            target: "fetchBankAccounts",
          },
          GOBACK: { actions: "goToDatatable" },
          NEXTPAGE: { actions: "nextPage", target: "fetchBankAccounts" },
          PREVPAGE: { actions: "prevPage", target: "fetchBankAccounts" },
          CLICKPAGE: { actions: "onClickPage", target: "fetchBankAccounts" },
          SEARCH: { actions: "searchBanks", target: "fetchBankAccounts" },
          DELETEBANK: { actions: "setSelectedBank", target: "deleteBank" },
          ENABLEBANK: { actions: "setSelectedBank", target: "enableBank" },
          DISABLEBANK: { actions: "setSelectedBank", target: "disableBank" },
          SETSEARCHBYACTIVE: {
            actions: "toggleActiveSearch",
            target: "fetchBankAccounts",
          },
        },
      },
    },
  },
  {
    actions: {
      setBanks: assign({
        bankAccounts: (_ctx, evt) => evt.data.data.data.bankAccounts,
        totalBanks: (_ctx, evt) => evt.data.data.data.total,
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
