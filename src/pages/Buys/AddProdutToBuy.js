import { Button, SvgIcon, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { Col } from 'react-bootstrap';
import AddProductModal from './AddProductModal';
import SearchIcon from "@material-ui/icons/Search";
import { ReusableModalStateContext, ReusableModalDispatchContext } from "../../context/ReusableModal/reusable-modal";
import { CustomModal } from "../../components/Common/reusable-modal";
import { useMachine } from '@xstate/react';
import { addProductToBuyMachine } from '../../machines/buys/addProductToBuyMachine';
import NumberFormat from 'react-number-format';

const AddProdutToBuy = ({ currentBuy, sendNewBuy, theme, currency }) => {
    const [current, send] = useMachine(addProductToBuyMachine);
    const modalState = React.useContext(ReusableModalStateContext);
    const modalDispatch = React.useContext(ReusableModalDispatchContext);

    const handleChange = (e) => {
        const { name, value } = e.target;
        send({ type: "SETDATA", name, value });
    };

    const isProductSelect = current.context.selectedProduct == null;

    const handleAddProduct = () => {
        send({ type: "SUBMITFORM" });
    };

    useEffect(() => {
        if (current.matches('completedForm')) {

            const productToAdd = {
                ...current.context.selectedProduct,
                quantityInInvoice: current.context.formData.quantity,
                precio_costo: current.context.formData.price
            }

            sendNewBuy(
                {
                    type: "ADDPRODUCT",
                    product: productToAdd,
                }
            )

            send({ type: "CLEARFORMDATA" });

        }
    }, [current]);

    return (
        <>
            <Col xl={4}>
                <TextField
                    variant='outlined'
                    label="Buscar producto"
                    name="search"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleChange}
                    value={current.context.formData.search}
                    onKeyPress={e => {
                        if (e.key === 'Enter') {
                            modalDispatch(
                                {
                                    type: "OPENMODAL",
                                    component: AddProductModal,
                                    modalProps: {
                                        sendNewInvoice: (data) => { sendNewBuy(data) },
                                        currentNewInvoice: currentBuy,
                                        sendAddProduct: (data) => { send(data) },
                                        preSearch: current.context.formData.search,
                                        theme: theme,
                                    },
                                    CustomModal,
                                }
                            )
                        }
                    }}
                />
                <Button
                    variant="containedPrimary"
                    color="secondary"
                    className='ml-2'
                    onClick={() => {
                        modalDispatch(
                            {
                                type: "OPENMODAL",
                                component: AddProductModal,
                                modalProps: {
                                    sendNewInvoice: (data) => { sendNewBuy(data) },
                                    currentNewInvoice: currentBuy,
                                    preSearch: current.context.formData.search,
                                    theme: theme,
                                    sendAddProduct: (data) => { send(data) },
                                },
                                CustomModal,
                            }
                        )
                    }}
                >
                    <SvgIcon component={SearchIcon}></SvgIcon>
                </Button>
            </Col>
            <Col xl={2}>
                <TextField
                    variant='outlined'
                    label="Cantidad"
                    name="quantity"
                    disabled={isProductSelect}
                    onChange={handleChange}
                    value={current.context.formData.quantity}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Col>
            <Col xl={3}>
                <NumberFormat
                    customInput={TextField}
                    prefix={currency.prefix}
                    thousandSeparator="."
                    decimalSeparator=","
                    fixedDecimalScale={true}
                    decimalScale={2}
                    value={current.context.formData.price}
                    variant='outlined'
                    label="Precio"
                    name="price"
                    disabled={isProductSelect}
                    onValueChange={(values) => {
                        const { floatValue } = values;
                        const name = "price";
                        const value = floatValue;

                        send({
                            type: "SETDATA",
                            name,
                            value
                        });
                    }}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Col>
            <Col xl={2}>
                <div className='d-flex align-items-center h-100'>
                    <Button
                        className='ml-4'
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            handleAddProduct()
                        }}
                    >
                        <Typography
                            variant='subtitle1'
                        >
                            Agregar
                        </Typography>
                    </Button>
                </div>
            </Col>
        </>
    );
}

export default AddProdutToBuy;