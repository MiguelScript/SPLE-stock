import React, { useEffect, useState } from 'react';
import { useMachine } from "@xstate/react";
import styled from "styled-components";
import SearchProductModal from '../../components/Layout/Modal/SearchProductModal'
import NumberFormat from 'react-number-format';
import { ProductsGrid, DataGridContainer, ProductsTable, DataGridHeader, ProductsTableBody } from "../../components/Layout/Modal/SearchProductModel.styles";
import { ButtonBase, Button, Typography, TextField, SvgIcon } from "@material-ui/core";
import isEmpty from 'lodash/isEmpty';
import { addProductMachine } from '../../machines/facturacion/addProductMachine';
import AddIcon from "@material-ui/icons/Add";
import { ReactComponent as MinusIcon } from "../../assets/icons/bx-minus.svg";
import { ReactComponent as PlusIcon } from "../../assets/icons/bx-plus.svg";

export const QuantityBtn = styled(ButtonBase)`
  background-color: #fff !important;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 28px;
  border-radius: 5px !important;
  background: white;
  border: 2px solid ${(props) => props.theme.palette.primary.main};
  span{
    pointer-events:none;
  }
  svg {
    pointer-events:none;
    width: 25px;
    height: 25px;
    color: ${(props) => props.theme.palette.primary.main};
  }
  &:focus {
    outline: none;
  }
`;
export const QuantityInput = styled(TextField)`
  background-color: #fff !important;
  height: 28px;
  width: 28px;
  border-radius: 14px !important;
  border:none;
  font-weight:bold;
  padding:0;
  margin:0;
  flex:1;
  input{
    text-align:center;

  }
`;
export const ContainerBtnProductInInvoice = styled.div`
  display: flex;

`;
const BtnProductInInvoice = ({ productInInvoice, theme, handleDiscountQuantity, handleAddQuantity, handleQuantityInput }) => {
    return (
        <ContainerBtnProductInInvoice
            className="shoppingCart-btns"
            onClick={(e) => {
                e.stopPropagation();
            }}
            aria-label="skip-drag"
        >
            <QuantityBtn
                theme={theme}
                onClick={handleDiscountQuantity}
                aria-label="skip-drag"
            >
                <SvgIcon component={MinusIcon}></SvgIcon>
            </QuantityBtn>
            <QuantityInput
                aria-label="skip-drag"
                onClick={(e) => {
                    e.stopPropagation();
                }}
                value={productInInvoice.cantidad}
                onChange={(e) => {
                    handleQuantityInput(e, productInInvoice)
                }}
            ></QuantityInput>

            {/* <NumberFormat
                                customInput={TextField}
                                name="quantity"
                                label="Cantidad"
                                variant="outlined"
                                size="small"
                                allowNegative={false}
                                isAllowed={quantityIsAllowed}
                                onValueChange={(e) => {
                                    const name = "quantity";
                                    const value = e.value;
                                    //console.log(e);
                                    send({
                                        type: "SETDATA",
                                        name,
                                        value
                                    });
                                }}
                                value={current.context.formData.quantity}
                                helperText={`Disponible en inventario: ${current.context.formData.product.cantidad}`}
                            /> */}

            <QuantityBtn
                theme={theme}
                onClick={handleAddQuantity}
                aria-label="skip-drag"
            >
                <SvgIcon component={PlusIcon}></SvgIcon>
            </QuantityBtn>
        </ContainerBtnProductInInvoice>
    )
}

const Item = ({ currency, product, theme, sendNewInvoice, currentNewInvoice }) => {

    const isProductInInvoice = currentNewInvoice.context.products.find(
        productInInvoice => productInInvoice.id === product.id
    );


    const handleAddProduct = (product) => {
        //e.stopPropagation();
        sendNewInvoice(
            {
                type: "ADDPRODUCT",
                product: product,
                quantity: product.quantity + 1
            }
        )
    };

    const handleAddQuantity = (product) => {
        //e.stopPropagation();
        sendNewInvoice(
            {
                type: "CHANGEQUANTITY",
                product: product,
                quantity: product.quantity + 1
            }
        )
    };

    const handleDiscountQuantity = (product) => {
        //e.stopPropagation();
        sendNewInvoice(
            {
                type: "CHANGEQUANTITY",
                product: product,
                quantity: product.quantity - 1
            }
        )
    };

    const handleQuantityInput = (e, productInInvoice) => {
        //e.stopPropagation();
        let numbersOnly = new RegExp("^[0-9]+$");
        let isValid = numbersOnly.exec(e.target.value);
        if (isValid || e.target.value === "") {
            sendNewInvoice({
                type: "CHANGEQUANTITY",
                value: productInInvoice,
                quantity: e.target.value,
                fromInput: true,
            });
        }
    };

    return (
        <tr>
            <td>
                <Typography variant="subtitle1">
                    {product.codigo}
                </Typography>
            </td>
            <td>
                <Typography variant="subtitle2">
                    {product.nombre}
                </Typography>
            </td>
            <td>
                <Typography variant="subtitle1">
                    {product.cantidad}
                </Typography>
            </td>
            <td>
                <Typography className="font-weight-bold" variant="subtitle1">
                    <NumberFormat
                        //customInput={TextField}
                        prefix={currency.prefix}
                        thousandSeparator="."
                        decimalSeparator=","
                        fixedDecimalScale={true}
                        decimalScale={2}
                        displayType='text'
                        value={parseFloat(product.precio_venta * currency.rate)}
                    />
                </Typography>
            </td>

            <td>
                {isProductInInvoice ? (
                    <BtnProductInInvoice
                        productInInvoice={isProductInInvoice}
                        theme={theme}
                        handleDiscountQuantity={handleDiscountQuantity}
                        handleAddQuantity={handleAddQuantity}
                        handleQuantityInput={handleQuantityInput}
                    />
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={
                            () => {
                                handleAddProduct(product)
                            }
                        }
                    //type="submit"
                    //disabled={checkEmptyFields()}
                    >
                        <AddIcon />
                        <Typography >
                            Agregar
                        </Typography>
                    </Button>
                )
                }
            </td>
        </tr >
    )
}

const ProductsTables = ({ currency, products, theme, currentNewInvoice, sendNewInvoice }) => {
    return (
        <ProductsTable theme={theme}>
            <DataGridHeader>
                <tr>
                    <th>Codigo</th>
                    <th>Nombre</th>
                    <th>Disponible</th>
                    <th>Precio venta</th>
                    <th>Acciones</th>
                </tr>
            </DataGridHeader>

            <ProductsTableBody>
                {products.map((product, index) => (
                    <Item
                        key={index}
                        theme={theme}
                        product={product}
                        currentNewInvoice={currentNewInvoice}
                        sendNewInvoice={sendNewInvoice}
                        currency={currency}
                    />
                ))}
            </ProductsTableBody>
        </ProductsTable >
    )
}


const AddProductModal = ({ currentNewInvoice, sendNewInvoice, theme }) => {

    return (

        <SearchProductModal
            currentNewInvoice={currentNewInvoice}
            sendNewInvoice={sendNewInvoice}
            ElHijo={ProductsTables}
        >
            {/*  {
                !isEmpty(products) ? ( */}

            {/*  <ProductsTables
                theme={theme}
                currency={currency}
                products={products}
                currentNewInvoice={currentNewInvoice}
                productsInInvoice={productsInInvoice}
                sendNewInvoice={sendNewInvoice}
            /> */}

            {/*  ) : (
                    <div>no hay productos por este nombre</div>

                )
            } */}
        </SearchProductModal>
    );
}

export default AddProductModal;