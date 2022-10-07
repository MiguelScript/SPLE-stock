import { Machine, assign } from "xstate";
import api from "../../config/api";

export const viewCustomerMachine = Machine(
  {
    id: "viewCustomerMachine",
    initial: "idle",
    context: {
      customer: null,
      responseMsg: "",
    },
    states: {
      idle: {
        on: {
          SETINVOICE: { target: "dataReady", actions: "setCustomer" },
          FETCHTCUSTOMER: { target: "fetch" },
        },
      },
      fetch: {
        invoke: {
          src: (_ctx, evt) =>
            new Promise(async (resolve, reject) => {
              const token = localStorage.token;
              if (token) {
                try {
                  const { data: results, status } = await api.get(
                    "api/clientes/" + evt.customerId,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );
                  console.log(results)
                  if (status === 200) {
                    resolve(results.data);
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
          onDone: { target: "dataReady", actions: "setCustomer" },
          onError: { target: "dataReady", actions: "setResponseMsg" },
        },
      },
      dataReady: {
        on: {
          GOTOEDIT: { actions: "goToEdit" },
          GOTOCREATE: { actions: "goToCreate" },
          GOTODATATABLE: {
            actions: "goToDatatable",
            target: "fetch",
          },
          GOBACK: { actions: "goToDatatable" },
        },
      },
    },
  },
  {
    actions: {
      setCustomer: assign({
        customer: (_ctx, evt) => evt.data,
        fetchError: false,
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
