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
import SelectCustomer from './SelectCustomer';
import SelectSeller from './SelectSeller';
import SelectPaymentMethod from './SelectPaymentMethod';
import CompletedFormLayout from '../../components/Common/CompletedFormLayout';



const NuevaFactura = () => {

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

    const handleChange = (name, value) => {
        send({
            type: "SETDATA",
            name: name,
            value: value
        })
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
                    <Typography variant="h6">Nueva Factura</Typography>
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
                    <Row>
                        <Col xl={4}>
                            <div>
                                <Typography
                                    variant='h6'
                                >
                                    Cliente
                                </Typography>
                                <SelectCustomer
                                    options={current.context.customers}
                                    setCustomer={(customerId) => handleChange("customerId", customerId)}
                                />
                            </div>
                        </Col>
                        <Col xl={4}>
                            <div>
                                <Typography
                                    variant='h6'
                                    className='mr-1'
                                >
                                    Vendedor
                                </Typography>
                                <SelectSeller
                                    options={current.context.sellers}
                                    setSeller={(sellerId) => handleChange("sellerId", sellerId)}
                                />
                            </div>

                        </Col>
                        <Col xl={4}>
                            <div>
                                <Typography
                                    variant='h6'
                                >
                                    M.Pago:
                                </Typography>
                                <SelectPaymentMethod
                                    options={current.context.paymentMethods}
                                    setPaymentMethod={(paymentMethodId) => handleChange("paymentMethodId", paymentMethodId)}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row
                        className='mt-4'
                    >
                        <Col xl={4}>
                            <div>
                                <Typography
                                    variant='h6'
                                >
                                    Observaciones:
                                </Typography>
                                <TextField
                                    id="outlined-multiline-static"
                                    className='mt-2'
                                    label="Observaciones"
                                    name="observations"
                                    variant='outlined'
                                    multiline
                                    rows={4}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onChange={(e) => handleChange("observations", e.target.value)}
                                />
                            </div>
                        </Col>
                    </Row>
                    <Row className='mt-4'>
                        <Col md={10}>
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
                                {/* <SvgIcon component={SearchIcon} className="mr-3"></SvgIcon> */}
                                <Typography>Buscar Productos</Typography>
                            </Button>
                        </Col>
                        <Col md={2}>
                            <SwicthContainer>
                                <Typography
                                    variant="subtitle2"
                                >
                                    Mostrar montos en Bs.S:<Switch
                                        color="primary"
                                        checked={toggled}
                                        onChange={e => handleToggle(e.target.checked)}
                                    />
                                </Typography>

                            </SwicthContainer>
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

export default NuevaFactura;