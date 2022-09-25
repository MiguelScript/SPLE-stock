import { Machine, assign } from "xstate";
import api from "../../config/api";

export const addProductMachine = Machine(
    {
        id: "addProductMachine",
        initial: "editingForm",
        context: {
            selectedProducto: "",
            responseMsg: "",
            formData: {
                product: [],
                quantity: 1,
            }

        },
        states: {
            editingForm: {
                on: {
                    SETDATA: {
                        actions: "setFormData",
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
            setProductos: assign({
                productos: (_ctx, evt) => evt.data.data.productos,
                totalProductos: (_ctx, evt) => evt.data.data.total_productos,
            }),
            setLimit: assign({
                pageInfo: (_ctx, evt) => {
                    return { ..._ctx.pageInfo, limit: parseInt(evt.value) };
                },
            }),
            goToEdit: assign({
                selectedProducto: (_ctx, evt) => evt.data,
                toEdit: true,
            }),
            goToCreate: assign({
                toCreate: true,
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
            setResponseMsg: assign({
                fetchError: true,
                responseMsg: (_ctx, evt) => {
                    return evt.data.msg;
                },
            }),
            clearFormData: assign({
                formData: (_ctx, evt) => {
                    return {
                        product: [],
                        quantity: 1,
                    }
                },
            }),
            clearResponseMsg: assign({
                fetchError: false,
                responseMsg: "",
            }),
        },
    }
);