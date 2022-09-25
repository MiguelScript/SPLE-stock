import React, { useEffect, Fragment, useContext, useRef } from 'react';
import { BackgroundFactura, BackgroundFooterFactura } from '../../components/Factura/Paper';
import {
    useTheme,
    SvgIcon,
    Button,
    Typography,
    ClickAwayListener,
    ButtonBase,
    Tooltip,
    Switch
} from "@material-ui/core";
import { Row, Col, FormControl } from "react-bootstrap";
import { DataGridContainer, NewInvoiceHeader, ProductsGrid, SwicthContainer } from '../../components/NewInvoice/ShowInvoice.styles';
import { isEmpty } from "lodash";
import NumberFormat from 'react-number-format';

const ProductsInInvoice = ({ products, currency }) => {
    const theme = useTheme();
    const dataGridContent = useRef();

    useEffect(() => {
        dataGridContent.current.scrollTo(0, 0);
    }, []);

    return (
        <BackgroundFactura elevation={0} className="mt-3">

            <Col md={12}>
                <DataGridContainer ref={dataGridContent}>

                    <ProductsGrid theme={theme} >
                        <div className="header-column">
                            <Typography>Nombre</Typography>
                        </div>
                        <div className="header-column">
                            <Typography>cantidad</Typography>
                        </div>
                        <div className="header-column">
                            <Typography>Precio U.</Typography>
                        </div>
                        <div className="header-column">
                            <Typography>Precio T.</Typography>
                        </div>
                        {
                            !isEmpty(products) ? (
                                products.map((producto, index) => (
                                    <Fragment key={index}>
                                        <div>
                                            <Typography className="product-attribute" variant="h6">
                                                {producto.nombre}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography className="product-attribute" variant="h6">
                                                {producto.pivot.producto_cantidad}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography className="product-attribute font-weight-bold" variant="h6">
                                                <NumberFormat
                                                    //customInput={TextField}
                                                    prefix={currency.prefix}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    displayType='text'
                                                    value={parseFloat(producto.pivot.producto_precio_unitario * currency.rate)}
                                                />
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography className="product-attribute font-weight-bold" variant="h6">
                                                <NumberFormat
                                                    //customInput={TextField}
                                                    prefix={currency.prefix}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    displayType='text'
                                                    value={parseFloat(producto.pivot.producto_cantidad * producto.pivot.producto_precio_unitario * currency.rate)}
                                                />
                                            </Typography>
                                        </div>
                                    </Fragment>
                                ))
                            ) : (
                                <>Agrega productos a la factura</>
                            )
                        }
                    </ProductsGrid>
                </DataGridContainer>
            </Col>
        </BackgroundFactura>
    );
}

export default ProductsInInvoice;