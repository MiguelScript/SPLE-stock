import { Machine, assign } from "xstate";
import api from "../../config/api";

export const newBuyMachine = Machine(
    {
        id: "newBuyMachine",
        initial: "editInvoice",
        context: {
            responseMsg: "",
            productsInBuy: [
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
                        actions: ["setGeneralData", "setResponseMsg"],
                    },
                    onError: { target: "dataError", actions: "setResponseMsg" },
                },
            },
            editInvoice: {
                on: {
                    ADDPRODUCT: {
                        actions: ["addProductToInvoice", "updatePrice"],
                    },
                    SETCUSTOMER: { actions: "setCustomer" },
                    SETSELLER: { actions: "setSeller" },
                    SETPAYMENTMETHOD: { actions: "setPaymentMethod" },
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

                                    formData.append("products", JSON.stringify(_ctx.productsInBuy));
                                    formData.append("subtotal", _ctx.subtotal);
                                    formData.append("tasa_dolar_id", 1);

                                    const { data: venta_id, /* status */ } = await api.post(
                                        "api/ventas",
                                        formData, {
                                        headers: { Authorization: `Bearer ${token}` },
                                    }

                                    );
                                    console.log(venta_id);
                                    resolve(venta_id);
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
            setGeneralData: assign({
                customers: (_ctx, evt) => evt.data.customers,
                sellers: (_ctx, evt) => evt.data.sellers,
                paymentMethods: (_ctx, evt) => evt.data.paymentMethods,
            }),
            setCustomer: assign({
                customerId: (_ctx, evt) => evt.customerId,
            }),
            setSeller: assign({
                sellerId: (_ctx, evt) => evt.sellerId,
            }),
            setPaymentMethod: assign({
                paymentMethodId: (_ctx, evt) => evt.paymentMethodId,
            }),
            addProductToInvoice: assign({
                products: (_ctx, evt) => {
                    //evt.value.quantity = 1;
                    let productToAdd = evt.product;
                    if (
                        _ctx.products.filter((product) => product.id === productToAdd.id)
                            .length > 0
                    ) {
                        return _ctx.products;
                    }

                    productToAdd.quantityInInvoice = 1;
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
                productToDelete: (_ctx, evt) => {
                    let productToDelete = _ctx.productToDelete;
                    if (!evt.fromInput && evt.quantity === 0) {
                        // _ctx.productsToDelete.push(evt.value.id);
                        productToDelete = evt.product.id;
                    }

                    return productToDelete;
                },
            }),
            setProductCartId: assign({
                products: (_ctx, evt) => {
                    let productToEdit = _ctx.products.find(
                        (product) => product.id === evt.data.product_id
                    );
                    let cantidadDisponible = evt.data.data.data.cantidad_disponible;
                    if (productToEdit) {
                        productToEdit.cantidad_disponible = cantidadDisponible;
                        productToEdit.quantity = parseInt(
                            evt.data.data.data.cantidad_producto
                        );
                        if (productToEdit.quantity <= 0) {
                            const productIndex = _ctx.products.findIndex(
                                (product) => product.id === evt.data.product_id
                            );
                            _ctx.products.splice(productIndex, 1);
                        }
                    }

                    return _ctx.products;
                },
                cartId: (_ctx, evt) => evt.data.data.data.carrito_id,
                shownAlert: true,
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