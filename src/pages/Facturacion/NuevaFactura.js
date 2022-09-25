import React, { useEffect} from 'react';
import { useMachine } from "@xstate/react";
// import { BackgroundFactura, BackgroundFooterFactura } from '../../components/Factura/Paper';
import {
    useTheme,
    Button,
    Typography,
    /* SvgIcon,
    ClickAwayListener,
    ButtonBase,
    Tooltip, */
    Switch
} from "@material-ui/core";
import { Row, Col, FormControl } from "react-bootstrap";
import AgregarProducto from './AgregarProducto';
import { DataGridContainer, NewInvoiceHeader, ProductsGrid, SwicthContainer } from '../../components/NewInvoice/NewInvoice.styles';
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
        console.log(current.context.products);
    }, [current.context.products]);

    return (
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
                    <Col md={10}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                console.log("click en boton para abrir modal");
                                modalDispatch(
                                    {
                                        type: "OPENMODAL",
                                        component: AddProductModal,
                                        modalProps: {
                                            /* actions: {
                                                addProduct: (product, quantity) => { addProduct(product, quantity) },
                                                addQuantity: (product, quantity) => { addProduct(product, quantity) },
                                                discountQuantity: (product, quantity) => { addProduct(product, quantity) },
                                            }, */
                                            sendNewInvoice: (data) => { send(data) },
                                            currentNewInvoice: current,
                                            productsInInvoice: current.context.products,
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
                currency={currency}
                removeProduct={(product) => {handleRemoveProduct(product)}}
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
    );
}

export default NuevaFactura;