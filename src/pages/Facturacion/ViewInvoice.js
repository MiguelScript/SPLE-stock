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
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { viewInvoiceMachine } from '../../machines/facturacion/viewInvoiceMachine';
import { DateTime } from 'luxon';



const ViewInvoice = () => {

    let history = useHistory();
    let location = useLocation();
    let { id } = useParams();

    const SiteDataState = React.useContext(StoreStateContext);
    const [toggled, setToggled] = React.useState(false);
    const [currency, setcurrency] = React.useState(CURRENCY_DEFAULT);
    const [current, send] = useMachine(viewInvoiceMachine);

    const handleToggle = (toggle) => {
        setToggled(toggle)
    }

    useEffect(() => {
        let invoice = location.state?.invoice;

        if (invoice === undefined || invoice === null || invoice === '') {
            send({ type: "FETCHTINVOICE", invoiceId: id });
        } else {
            send({ type: "SETINVOICE", data: invoice });
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
                                className="d-flex justify-content-center flex-column"
                            >
                                {" "}
                                <Typography
                                    variant="subtitle1"
                                    component="span"
                                    className="text-uppercase mb-1 font-weight-bold"
                                >
                                    Codigo
                                </Typography>
                                <Typography variant="" className="">
                                    {current.context.invoice.codigo}
                                </Typography>
                            </Col>
                            <Col
                                xl={3}
                                className="d-flex justify-content-center flex-column"
                            >
                                {" "}
                                <Typography
                                    variant="subtitle1"
                                    component="span"
                                    className="text-uppercase mb-1 font-weight-bold"
                                >
                                    Fecha de creación
                                </Typography>
                                <Typography className="">
                                    {DateTime.fromISO(current.context.invoice.created_at)
                                        .setLocale("es")
                                        .toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
                                </Typography>
                            </Col>
                            <Col
                                xl={3}
                                className="d-flex justify-content-center flex-column"
                            >
                                {" "}
                                <Typography
                                    variant="subtitle1"
                                    component="span"
                                    className="text-uppercase mb-1 font-weight-bold"
                                >
                                    Metodo de pago
                                </Typography>
                                <Typography className="">
                                    {current.context.invoice.payment_method.nombre}
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
                <Row className='mt-4'>
                    <Col md={10}>
                        <Row>
                            <Col
                                xl={3}
                                className="d-flex justify-content-center flex-column"
                            >
                                {" "}
                                <Typography
                                    variant="subtitle1"
                                    component="span"
                                    className="text-uppercase mb-1 font-weight-bold"
                                >
                                    Vendedor
                                </Typography>
                                <Typography variant="" className="">
                                    {current.context.invoice.seller.codigo + " - " + current.context.invoice.seller.nombre + " " + current.context.invoice.seller.apellido}
                                </Typography>
                            </Col>
                            <Col
                                xl={3}
                                className="d-flex justify-content-center flex-column"
                            >
                                {" "}
                                <Typography
                                    variant="subtitle1"
                                    component="span"
                                    className="text-uppercase mb-1 font-weight-bold"
                                >
                                    Cliente
                                </Typography>
                                <Typography className="">
                                    {current.context.invoice.customer.codigo + " - " + current.context.invoice.customer.nombre}
                                </Typography>
                            </Col>
                            <Col
                                xl={3}
                                className="d-flex justify-content-center flex-column align-items-start"
                            >
                                {" "}
                                <Typography
                                    variant="subtitle1"
                                    component="span"
                                    className="text-uppercase mb-1 font-weight-bold"
                                >
                                    Observaciones
                                </Typography>
                                <Typography className="">
                                    {current.context.invoice.observaciones ? current.context.invoice.observaciones : 'Sin observaciones'}
                                </Typography>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={2}>
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

export default ViewInvoice;