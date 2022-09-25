import { Machine, assign } from "xstate";
import api from "../../config/api";

export const viewInvoiceMachine = Machine(
  {
    id: "viewInvoiceMachine",
    initial: "idle",
    context: {
      invoice: null,
      responseMsg: "",
    },
    states: {
      idle: {
        on: {
          SETINVOICE: { target: "dataReady", actions: "setInvoice" },
          FETCHTINVOICE: { target: "fetchInvoice" },
        },
      },
      fetchInvoice: {
        invoke: {
          src: (_ctx, evt) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              if (token) {
                try {
                  const { data: results } = await api.get(
                    "api/ventas",
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  if (results.status === 200) {
                    resolve(results.invoice);
                  } else {
                    reject(results);
                  }
                } catch (e) {
                  reject(e);
                }
              } else {
                reject("No hay token");
              }
            }),
          onDone: { target: "dataReady", actions: "setInvoice" },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      dataReady: {
        on: {
          GOTOEDIT: { actions: "goToEdit" },
          GOTOCREATE: { actions: "goToCreate" },
          GOTODATATABLE: {
            actions: "goToDatatable",
            target: "fetchInvoice",
          },
          GOBACK: { actions: "goToDatatable" },
          NEXTPAGE: { actions: "nextPage", target: "fetchInvoice" },
          PREVPAGE: { actions: "prevPage", target: "fetchInvoice" },
          CLICKPAGE: { actions: "onClickPage", target: "fetchInvoice" },
          SEARCH: { actions: "searchBanks", target: "fetchInvoice" },
          SETSEARCHBYACTIVE: {
            actions: "toggleActiveSearch",
            target: "fetchInvoice",
          },
        },
      },
    },
  },
  {
    actions: {
      setInvoice: assign({
        invoice: (_ctx, evt) => evt.invoice,
        fetchError: false,
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
