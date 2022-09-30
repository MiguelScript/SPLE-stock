import { Machine, assign } from "xstate";
import api from "../../config/api";

export const addProductToBuyMachine = Machine(
    {
        id: "addProductToBuyMachine",
        initial: "editingForm",
        context: {
            responseMsg: "",
            selectedProduct: null,
            formData: {
                search: "",
                quantity: null,
                price: null,
            }
        },
        states: {
            editingForm: {
                on: {
                    SETDATA: {
                        actions: "setFormData",
                    },
                    SETSELECTEDPRODUCT: {
                        actions: "setSelectedProduct",
                    },
                    SUBMITFORM: {
                        target: "completedForm",
                    },
                },
            },
            /*  submittingForm: {
                 target: "completedForm",
             }, */
            completedForm: {
                on: {
                    CLEARFORMDATA: {
                        target: "editingForm",
                        actions: "clearFormData",
                    },
                },
                actions: "clearFormData",
            },
            dataError: {
                /* on: {
                    FETCHPRODUCTS: { target: "fetchProductos" },
                    SEARCH: { actions: "searchProductos", target: "fetchProductos" },
                }, */
            },
        },
    },
    {
        actions: {
            setFormData: assign({
                formData: (_ctx, evt) => {
                    console.log(evt);
                    return { ..._ctx.formData, [evt.name]: evt.value };
                },
            }),
            setSelectedProduct: assign({
                selectedProduct: (_ctx, evt) => evt.product,
                formData: (_ctx, evt) => {
                    return {
                        ..._ctx.formData,
                        search: evt.product.nombre,
                        quantity: 1,
                        price: evt.product.precio_costo
                    };
                },
            }),
            clearFormData: assign({
                selectedProduct: (_ctx, evt) => null,
                formData: (_ctx, evt) => {
                    return {
                        search: "",
                        quantity: null,
                        price: null
                    }
                },
            }),
        },
    }
);