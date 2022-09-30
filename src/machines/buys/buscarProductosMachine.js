import { Machine, assign } from "xstate";
import api from "../../config/api";

export const buscarProductosMachine = Machine(
    {
        id: "buscarProductosMachine",
        initial: "idle",
        context: {
            responseMsg: "",
            search: "",
            productos: [],
        },
        states: {
            idle: {
                on: {
                    SEARCH: { target: "fetchProductos", actions: "searchProductos" },
                },
            },
            fetchProductos: {
                invoke: {
                    src: (_ctx, evt) =>
                        new Promise(async (resolve, reject) => {
                            const token = localStorage.token;
                            if (token) {
                                try {
                                    let route = `?search=${_ctx.search}`
                                    const { data: productos } = await api.get(
                                        "api/productos/search" + route, {
                                        headers: { Authorization: `Bearer ${token}` },
                                    }

                                    );
                                    resolve(productos);
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
            dataReady: {
                on: {
                    GOTODATATABLE: { actions: "goToDatatable", target: "fetchProductos" },
                    SEARCH: { actions: "searchProductos", target: "fetchProductos" },
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
            }),
            goToDatatable: assign({
                selectedProducto: "",
            }),
            clearSelectedProducto: assign({
                selectedProducto: "",
            }),
            searchProductos: assign({
                search: (_ctx, evt) => evt.value,
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
