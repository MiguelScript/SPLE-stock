import { Machine, assign } from "xstate";
import api from "../../config/api";

export const newBuyMachine = Machine(
    {
        id: "newBuyMachine",
        initial: "editInvoice",
        context: {
            responseMsg: "",
            search: "",
            products: [
            ],
            subtotal: 0,
        },
        states: {
            fetchData: {
                invoke: {
                    src: (_ctx, evt) =>
                        new Promise(async (resolve, reject) => {
                            const token = localStorage.token;
                            if (token) {
                                try {
                                    const { data: dt, /* status */ } = await api.get(
                                        "api/compras/nueva", {
                                        headers: { Authorization: `Bearer ${token}` },
                                    });
                                    resolve(dt.data);
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
                        target: "editInvoice",
                        actions: ["setResponseMsg"],
                    },
                    onError: { target: "dataError", actions: "setResponseMsg" },
                },
            },
            editInvoice: {
                on: {
                    ADDPRODUCT: {
                        actions: ["addProductToInvoice", "updatePrice"],
                    },
                    REMOVEPRODUCT: { actions: ["removeProductFromCart", "updatePrice"] },
                    HANDLEVISIBLE: { actions: "handleVisible" },
                    CHANGEQUANTITY: { actions: ["changeProductQuantity", "updatePrice"] },
                    //DELETEPRODUCT: { target: "deleteProduct" },
                    CLEARSHOPPINGCART: { actions: ["clearShoppingCart", "updatePrice"] },
                    SHOWSNACKBAR: { actions: "showSnackbar" },
                    HIDESNACKBAR: { actions: "hideSnackbar" },
                    //DELETESHOPPINGCART: { target: "deleteShoppingCart" },
                    SHOWSHOPPINGCARTACTIVATION: {
                        actions: "showSnackbarAfterAddingProduct",
                    },
                    FACTURAR: { target: "submitFactura" },
                },
            },
            submitFactura: {
                invoke: {
                    src: (_ctx, evt) =>
                        new Promise(async (resolve, reject) => {
                            const token = localStorage.token;
                            if (token) {
                                try {
                                    let formData = new FormData();

                                    formData.append("products", JSON.stringify(_ctx.products));
                                    formData.append("subtotal", _ctx.subtotal);
                                    formData.append("tasa_dolar_id", 1);

                                    const { data: compra_id, /* status */ } = await api.post(
                                        "api/compras",
                                        formData, {
                                        headers: { Authorization: `Bearer ${token}` },
                                    }

                                    );
                                    console.log(compra_id);
                                    resolve(compra_id);
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
                        target: "completed",
                        //actions: ["setProductos", "setResponseMsg"],
                    },
                    onError: { target: "dataError", actions: "setResponseMsg" },
                },
            },
            dataError: {
                on: {
                    //FETCHPRODUCTS: { target: "fetchProductos" },
                    //SEARCH: { actions: "searchProductos", target: "fetchProductos" },
                },
            },

            completed: {

            },

        },
    },
    {
        actions: {
            addProductToInvoice: assign({
                products: (_ctx, evt) => {
                    let productToAdd = evt.product;
                    if (
                        _ctx.products.filter((product) => product.id === productToAdd.id)
                            .length > 0
                    ) {
                        return _ctx.products;
                    }

                    return [..._ctx.products, productToAdd];
                },
            }),
            changeProductQuantity: assign({
                products: (_ctx, evt) => {
                    let productToEdit = _ctx.products.find(
                        (product) => product.id === evt.product.id
                    );
                    if (evt.fromInput) {
                        if (evt.quantity !== 0) {
                            productToEdit.quantityInInvoice = parseInt(evt.quantity);
                        } else {
                            productToEdit.quantityInInvoice = null;
                        }
                    } else {
                        if (evt.quantity !== 0) {
                            productToEdit.quantityInInvoice = parseInt(evt.quantity);
                        } else {
                            productToEdit.quantityInInvoice = 0;
                            const productIndex = _ctx.products.findIndex(
                                (product) => product.id === evt.product.id
                            );
                            _ctx.products.splice(productIndex, 1);
                        }
                    }

                    return _ctx.products;
                },
            }),
            cleanDeleteProduct: assign({
                productToDelete: "",
            }),
            updatePrice: assign({
                subtotal: (_ctx, evt) =>
                    _ctx.products.reduce(
                        (accumulator, product) =>
                            parseFloat(product.precio_costo) * product.quantityInInvoice + accumulator,
                        0
                    ),
            }),
            removeProductFromCart: assign({
                products: (_ctx, evt) => {

                    const productIndex = _ctx.products.findIndex(
                        (product) => product.id === evt.product.id
                    );
                    _ctx.products.splice(productIndex, 1);
                    return _ctx.products;
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