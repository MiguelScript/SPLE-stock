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
import { viewBuyMachine } from '../../machines/buys/viewBuyMachine';
import { DateTime } from 'luxon';
import ProductsInBuy from '../../components/Buy/ProductsInBuy';



const ViewBuy = () => {

    let history = useHistory();
    let location = useLocation();

    const SiteDataState = React.useContext(StoreStateContext);
    const [toggled, setToggled] = React.useState(false);
    const [currency, setcurrency] = React.useState(CURRENCY_DEFAULT);
    const [current, send] = useMachine(viewBuyMachine);

    const handleToggle = (toggle) => {
        setToggled(toggle)
    }

    useEffect(() => {
        let buy = location.state?.buy;

        if (buy === undefined || buy === null || buy === '') {
            send({ type: "FETCHTINVOICE" });
        } else {
            send({ type: "SETINVOICE", buy });
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
                <Typography variant="h6">Ver Compra</Typography>
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => {
                        history.push("/compras")
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
                                    {current.context.buy.codigo}
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
                                    {DateTime.fromISO(current.context.buy.created_at)
                                        .setLocale("es")
                                        .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
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
            <ProductsInBuy
                products={current.context.buy.products}
                currency={currency}
            />
            <ActionsFooter
                total={current.context.buy.products.reduce(
                    (accumulator, product) =>
                        parseFloat(product.pivot.producto_precio_unitario) * product.pivot.producto_cantidad + parseFloat(accumulator), 0
                )}
                currency={currency}
            />
        </>
    )
        : (
            <></>
        )
}

export default ViewBuy;