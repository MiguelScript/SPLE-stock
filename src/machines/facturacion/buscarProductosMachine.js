import { Machine, assign } from "xstate";
import api from "../../config/api";

export const buscarProductosMachine = Machine(
    {
        id: "buscarProductosMachine",
        initial: "idle",
        context: {
            selectedProducto: "",
            responseMsg: "",
            search: "",
            productos: [],
            totalProductos: 0,
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
                                    let formData = new FormData();
                                    formData.append("search", _ctx.search);
                                    formData.append("status", "1");
                                    formData.append("search", _ctx.search);
                                    formData.append("limit", _ctx.pageInfo.limit);
                                    formData.append("offset", _ctx.pageInfo.offset);
                                    formData.append("status", "1");
                                    let route = `?page=${_ctx.pageInfo.offset}&results=${_ctx.pageInfo.limit}`
                                    const { data: productos, status } = await api.get(
                                        "api/productos" + route,
                                        formData, {
                                        headers: { Authorization: `Bearer ${token}` },
                                    }

                                    );
                                    console.log(productos);
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
                    CLICKPAGE: { actions: "onClickPage", target: "fetchProductos" },
                    SEARCH: { actions: "searchProductos", target: "fetchProductos" },
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
                productos: (_ctx, evt) => evt.data.data.productos,
                totalProductos: (_ctx, evt) => evt.data.data.total_productos,
            }),
            setLimit: assign({
                pageInfo: (_ctx, evt) => {
                    return { ..._ctx.pageInfo, limit: parseInt(evt.value) };
                },
            }),
            goToDatatable: assign({
                selectedProducto: "",
                toEdit: false,
                toCreate: false,
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
