import React, { useEffect } from 'react';
import { useMachine } from "@xstate/react";
import Select from 'react-select';
// import { BackgroundFactura, BackgroundFooterFactura } from '../../components/Factura/Paper';
import {
    useTheme,
    Button,
    Typography,
    /* SvgIcon,
    ClickAwayListener,
    ButtonBase,
    Tooltip, */
    Switch,
    TextField
} from "@material-ui/core";
import { Row, Col, FormControl } from "react-bootstrap";
import AgregarProducto from './AgregarProducto';
import { DataGridContainer, NewInvoiceHeader, ProductsGrid, SwicthContainer, SelectNewInvoiceHeader } from '../../components/NewInvoice/NewInvoice.styles';
import { nuevaFacturaMachine } from '../../machines/facturacion/nuevaFacturaMachine';
import { isEmpty } from "lodash";
import ItemFactura from './ItemFactura'
import ActionsFooter from './ActionsFooter'
import {
    StoreStateContext,
    // StoreDispatchContext,
} from "../../context/store/store";

import { CURRENCY_DEFAULT } from "../../config/constants";
import { ReusableModalStateContext, ReusableModalDispatchContext } from "../../context/ReusableModal/reusable-modal";
import { CustomModal } from "../../components/Common/reusable-modal";
import AddProductModal from './AddProductModal'
import Invoice from "../../components/Invoice/Invoice";
import { useHistory } from 'react-router-dom';
import CompletedFormLayout from '../../components/Common/CompletedFormLayout';



const NewBuy = () => {

    const theme = useTheme();
    let history = useHistory();
    const SiteDataState = React.useContext(StoreStateContext);
    const [current, send] = useMachine(nuevaFacturaMachine);
    const [toggled, setToggled] = React.useState(false);
    const [currency, setcurrency] = React.useState(CURRENCY_DEFAULT);
    const modalState = React.useContext(ReusableModalStateContext);
    const modalDispatch = React.useContext(ReusableModalDispatchContext);

    const facturar = () => {
        send({
            type: "FACTURAR",
        });
    }

    const handleRemoveProduct = (product) => {
        send({
            type: "REMOVEPRODUCT",
            product: product,
        });
    }

    const handleToggle = (toggle) => {
        setToggled(toggle)
    }


    useEffect(() => {
        if (toggled === true) {
            setcurrency(
                {
                    prefix: "Bs.S",
                    rate: SiteDataState.dollarRate.context.dollarRate.tasa,
                }
            )
        } else {
            setcurrency(
                CURRENCY_DEFAULT
            )
        }
    }, [toggled]);

    // useEffect(() => {
    //     if (current.matches("completed")) {
    //         sendParent(
    //             {
    //                 type: "GOTODATATABLE",
    //             }
    //         );
    //     }
    // }, [current]);

    useEffect(() => {
        if (current.matches('completed')) {

        }

        modalDispatch(
            {
                type: "UPDATEPROPS",
                modalProps: {
                    currentNewInvoice: current,
                },
            }
        )
    }, [current]);

    return (
        !current.matches('completed') ? (
            <>
                <div className="d-flex justify-content-between mb-3">
                    <Typography variant="h6">Nueva Compra</Typography>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            history.push("/facturacion");
                        }}
                    >
                        Volver
                    </Button>
                </div>

                <NewInvoiceHeader elevation={0}>
                    <Row >
                        <Col md={10}>
                            <Typography variant='subtitle2'>Agregar producto</Typography>

                            {/* <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    modalDispatch(
                                        {
                                            type: "OPENMODAL",
                                            component: AddProductModal,
                                            modalProps: {
                                                sendNewInvoice: (data) => { send(data) },
                                                currentNewInvoice: current,
                                                theme: theme,
                                            },
                                            CustomModal,
                                        }
                                    )
                                }}
                            >
                                <Typography>Agregar producto</Typography>
                            </Button> */}
                        </Col>
                        <Col md={2}>

                        </Col>
                    </Row>
                    <Row className='mt-3'>
                        <Col xl={4}>
                            <TextField
                                variant='outlined'
                                label="Buscar producto"
                                name="search-product"
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        modalDispatch(
                                            {
                                                type: "OPENMODAL",
                                                component: AddProductModal,
                                                modalProps: {
                                                    sendNewInvoice: (data) => { send(data) },
                                                    currentNewInvoice: current,
                                                    theme: theme,
                                                },
                                                CustomModal,
                                            }
                                        )
                                    }
                                }}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    modalDispatch(
                                        {
                                            type: "OPENMODAL",
                                            component: AddProductModal,
                                            modalProps: {
                                                sendNewInvoice: (data) => { send(data) },
                                                currentNewInvoice: current,
                                                theme: theme,
                                            },
                                            CustomModal,
                                        }
                                    )
                                }}
                            >
                            </Button>
                        </Col>
                        <Col xl={3}>
                            <TextField
                                variant='outlined'
                                label="Cantidad"
                                name="quantity-product"
                            />
                        </Col>
                        <Col xl={3}>
                            <TextField
                                variant='outlined'
                                label="Precio"
                                name="price-product"
                            />
                        </Col>
                    </Row>
                </NewInvoiceHeader>
                <Invoice
                    products={current.context.products}
                    currentInvoice={current}
                    sendInvoice={(data) => { send(data) }}
                    currency={currency}
                    removeProduct={(product) => { handleRemoveProduct(product) }}
                />
                <ActionsFooter
                    total={current.context.subtotal}
                    facturar={facturar}
                    currency={currency}
                    toggled={toggled}
                    setToggled={setToggled}
                    isCreate={true}
                />
            </>

        ) : (
            <>
                <CompletedFormLayout
                    message="Se ha realizado la venta correctamente"
                />
                <div className='d-flex justify-content-center mt-3'>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => {
                            history.push("/facturacion");
                        }}
                    >
                        Volver
                    </Button>
                </div>
            </>
        )
    );
}

export default NewBuy;