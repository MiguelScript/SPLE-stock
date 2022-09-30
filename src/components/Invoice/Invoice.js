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
import { DataGridContainer, NewInvoiceHeader, ProductsGrid, SwicthContainer } from '../../components/NewInvoice/NewInvoice.styles';
import { isEmpty } from "lodash";
import { ReactComponent as TrashIcon } from "../../assets/icons/bx-trash.svg";
import NumberFormat from 'react-number-format';
import DeleteContained from '../../components/Buttons/DeleteContained';
import { HandleQuantityBtns } from '../../pages/Facturacion/AddProductModal';

const Invoice = ({ products, isView = false, currency, removeProduct, currentInvoice, sendInvoice }) => {
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
                        <div className="header-column numeric">
                            <Typography>cantidad</Typography>
                        </div>
                        <div className="header-column numeric">
                            <Typography>Precio U.</Typography>
                        </div>
                        <div className="header-column numeric">
                            <Typography>Precio T.</Typography>
                        </div>
                        {isView === false && (
                            <div className="header-column">
                                <Typography>Acciones</Typography>
                            </div>
                        )}
                        {
                            !isEmpty(products) ? (
                                products.map((producto, index) => (
                                    <Fragment key={index}>
                                        <div>
                                            <Typography className="product-attribute" variant="h6">
                                                {producto.nombre}
                                            </Typography>
                                        </div>
                                        <div className='numeric'>
                                            {/* <Typography className="product-attribute" variant="h6">
                                                {producto.quantityInInvoice}
                                            </Typography> */}
                                            <HandleQuantityBtns
                                                theme={theme}
                                                currentNewInvoice={currentInvoice}
                                                sendNewInvoice={sendInvoice}
                                                product={producto}
                                            />
                                        </div>
                                        <div className='numeric'>
                                            <Typography className="product-attribute font-weight-bold" variant="h6">
                                                <NumberFormat
                                                    //customInput={TextField}
                                                    prefix={currency.prefix}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    displayType='text'
                                                    value={parseFloat(producto.precio_costo * currency.rate)}
                                                />
                                            </Typography>
                                        </div>
                                        <div className='numeric'>
                                            <Typography className="product-attribute font-weight-bold" variant="h6">
                                                <NumberFormat
                                                    //customInput={TextField}
                                                    prefix={currency.prefix}
                                                    thousandSeparator="."
                                                    decimalSeparator=","
                                                    fixedDecimalScale={true}
                                                    decimalScale={2}
                                                    displayType='text'
                                                    value={parseFloat(producto.quantityInInvoice * producto.precio_costo * currency.rate)}
                                                />
                                            </Typography>
                                        </div>
                                        {
                                            isView === false && (
                                                <div>
                                                    <Tooltip title="Eliminar">
                                                        <DeleteContained
                                                            onClick={() => {
                                                                removeProduct(producto)
                                                            }}
                                                        >
                                                            <SvgIcon component={TrashIcon}></SvgIcon>
                                                        </DeleteContained>
                                                    </Tooltip>

                                                </div>
                                            )
                                        }

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

export default Invoice;