import React, { useEffect } from 'react';
import { useMachine } from "@xstate/react";
// import { BackgroundFactura, BackgroundFooterFactura } from '../../components/Factura/Paper';
import {
    // useTheme,
    // SvgIcon,   
    // ClickAwayListener,
    // ButtonBase,
    // Tooltip,
    Switch,
    Button,
    Typography,
} from "@material-ui/core";
import { Row, Col, /* FormControl */ } from "react-bootstrap";
import { NewInvoiceHeader, SwicthContainer } from '../../components/NewInvoice/NewInvoice.styles';
import ActionsFooter from './ActionsFooter'
import {
    StoreStateContext,
} from "../../context/store/store";

import { CURRENCY_DEFAULT } from "../../config/constants";
// import { ReusableModalStateContext, ReusableModalDispatchContext } from "../../context/ReusableModal/reusable-modal";
// import { CustomModal } from "../../components/Common/reusable-modal";
import ProductsInInvoice from "../../components/Invoice/ProductsInInvoice";
import moment from "moment";
import { useHistory, useLocation } from 'react-router-dom';
import { viewInvoiceMachine } from '../../machines/facturacion/viewInvoiceMachine';



const ViewInvoice = () => {

    let history = useHistory();
    let location = useLocation();

    const SiteDataState = React.useContext(StoreStateContext);
    const [toggled, setToggled] = React.useState(false);
    const [currency, setcurrency] = React.useState(CURRENCY_DEFAULT);
    const [current, send] = useMachine(viewInvoiceMachine);

    const handleToggle = (toggle) => {
        setToggled(toggle)
    }

    const handleDateReFormat = (date) => {
        let stringDate = moment(new Date(date)).format("LL");
        let StringDia = moment(new Date(date)).format('dddd').charAt(0).toUpperCase() + moment(new Date(date)).format('dddd').slice(1);
        let StringHora = moment(new Date(date)).locale('en').format("LT");
        return (
            `${StringDia}, ${stringDate} ${StringHora} `
        );
    };

    useEffect(() => {
        console.log(SiteDataState.dollarRate.context.dollarRate);
        let invoice = location.state?.invoice;
        if (invoice === undefined || invoice === null) {
            console.log("buscar");
            send({ type: "FETCHTINVOICE" });
        } else {
            console.log("seteat");
            send({ type: "SETINVOICE", invoice });
        }
    }, []);

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

    return current.matches("dataReady") ? (
        <>
            <div className="d-flex justify-content-between mb-3">
                <Typography variant="h6">Ver Factura</Typography>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        history.push("/facturacion")
                    }}
                >
                    Volver
                </Button>
            </div>

            <NewInvoiceHeader elevation={0}>
                <Row>
                    <Col md={10}>
                        <Row>
                            <Col
                                xl={3}
                                className="d-flex justify-content-center flex-column align-items-center"
                            >
                                {" "}
                                <Typography
                                    variant="subtitle1"
                                    component="span"
                                    className="text-uppercase mb-1"
                                >
                                    Codigo
                                </Typography>
                                <Typography variant="h6" className="font-weight-bold">
                                    {current.context.invoice.codigo}
                                </Typography>
                            </Col>
                            <Col
                                xl={3}
                                className="d-flex justify-content-center flex-column align-items-center"
                            >
                                {" "}
                                <Typography
                                    variant="subtitle1"
                                    component="span"
                                    className="text-uppercase mb-1"
                                >
                                    Fecha de creación
                                </Typography>
                                <Typography variant="h6" className="font-weight-bold">
                                    {handleDateReFormat(current.context.invoice.created_at)}
                                </Typography>
                            </Col>

                        </Row>
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
            <ProductsInInvoice
                products={current.context.invoice.products}
                currency={currency}
            />
            <ActionsFooter
                total={current.context.invoice.products.reduce(
                    (accumulator, product) =>
                        parseFloat(product.pivot.producto_precio_unitario) + parseFloat(accumulator), 0
                )}
                currency={currency}
            />
        </>
    )
        : (
            <></>
        )
}

export default ViewInvoice;