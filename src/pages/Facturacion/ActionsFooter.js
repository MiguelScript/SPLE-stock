import React from 'react';
import Button from '@material-ui/core/Button';
import { Container, Row, Col, FormControl } from "react-bootstrap";
import { InvoiceFooterContainer } from '../../components/NewInvoice/NewInvoice.styles';
import Typography from '@material-ui/core/Typography';
import NumberFormat from 'react-number-format';



const ActionsFooter = ({ total, facturar, currency, isCreate = false }) => {

    return (
        <div>
            <InvoiceFooterContainer elevation={0} className="mt-3">
                <Container>
                    <Row className=" no-gutters">
                        <Col md={6}>
                            <Typography className="product-attribute font-weight-bold" variant="h6">
                                Total a pagar: {" "}
                                <NumberFormat
                                    //customInput={TextField}
                                    prefix={currency.prefix}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    fixedDecimalScale={true}
                                    decimalScale={2}
                                    displayType='text'
                                    value={parseFloat(total * currency.rate)}
                                />
                            </Typography>
                        </Col>
                        {
                            isCreate && (
                                <Col md={6} className="text-right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        onClick={facturar}
                                    >
                                        Facturar
                                    </Button>
                                </Col>
                            )
                        }
                    </Row>
                </Container>


            </InvoiceFooterContainer>

        </div>
    );
}

export default ActionsFooter;
