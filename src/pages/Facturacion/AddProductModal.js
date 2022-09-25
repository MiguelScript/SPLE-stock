import React, { useEffect, useState } from 'react';
import { useMachine } from "@xstate/react";
import styled from "styled-components";
import SearchProductModal from '../../components/Layout/Modal/SearchProductModal'
import NumberFormat from 'react-number-format';
import { ProductsGrid, DataGridContainer, ProductsTable, DataGridHeader, ProductsTableBody } from "../../components/Layout/Modal/SearchProductModel.styles";
import { ButtonBase, Button, Typography, TextField } from "@material-ui/core";
import isEmpty from 'lodash/isEmpty';
import { addProductMachine } from '../../machines/facturacion/addProductMachine';
import AddIcon from "@material-ui/icons/Add";


export const QuantityBtn = styled(ButtonBase)`
  background-color: #fff !important;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 28px;
  border-radius: 14px !important;
  background: white;
  
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
  text-align:center;
  height: 28px;
  width: 28px;
  border-radius: 14px !important;
  border:none;
  font-weight:bold;
  padding:0;
  margin:0;
`;

const Item = ({ currency, product, theme, sendNewInvoice, currentNewInvoice, isAlreadyInInvoice }) => {

    //const [isInInvoice, setIsInInvoice] = useState(isAlreadyInInvoice)




}

const ProductsTables = ({ currency, products, theme, currentNewInvoice, sendNewInvoice }) => {

    //const [current, send] = useMachine(addProductMachine);
    //const { products: productsInInvoice } = currentNewInvoice.context;




    /* const isAlreadyInInvoice = (productId) => {
        console.log(currentNewInvoice.context.products);
        return currentNewInvoice.context.products.find(product => product.id == productId);
    } */

    const isProductInCart = (productId) => {
        return currentNewInvoice.context.products.find(
            product => product.id == productId
        );
    }

    /* const quantityIsAllowed = (inputObj) => {
        const { value } = inputObj;
        if (value > product.cantidad || value < 1) {
            if (!value == "") {
                return null;
            }
        }
        return inputObj;
    } */

    const handleAddProduct = (product) => {
        //console.log(isAlreadyInInvoice(product.id));
        console.log(isProductInCart(product.id));
        console.log(currentNewInvoice.context.products);


        sendNewInvoice(
            {
                type: "ADDPRODUCT",
                product: product,
            }
        )
        //setIsInInvoice(true)
        /* shoppingCartDispatch({
            type: "CHANGEQUANTITY",
            value: isProductInCart,
            quantity: isProductInCart.quantity + 1,
            fromInput: false,
        });
        debouncedVerify(isProductInCart); */
    };

    const handleAddQuantity = (product) => {
        //e.stopPropagation();
        sendNewInvoice(
            {
                type: "ADDPRODUCT",
                product: product,
                quantity: product.quiantity + 1
            }
        )
    };

    const handleDiscountQuantity = (product) => {
        //e.stopPropagation();
        sendNewInvoice(
            {
                type: "ADDPRODUCT",
                product: product,
                quantity: product.quiantity - 1
            }
        )
    };

    useEffect(() => {

        console.log("cambiaron los productos - desde tabla");
        //console.log(productsInInvoice);
        console.log(currentNewInvoice.context.products);
        //console.log(currentNewInvoice.context.products.find(product => product.id == 1));
    }, [currentNewInvoice])

    return (
        <ProductsTable theme={theme}>
            <DataGridHeader>
                <tr>
                    <th>Codigo</th>
                    <th>Nombre</th>
                    <th>Disponible</th>
                    <th>Precio venta</th>
                    <th>Acciones</th>
                    {/* {isNewInvoice && (
                        <>
                            <th>Acciones</th>
                        </>

                    )} */}
                </tr>
            </DataGridHeader>

            <ProductsTableBody>
                {products.map(product => (
                    <>
                        {/* <Item
                        theme={theme}
                        key={product.id}
                        product={product}
                        currency={currency}
                        sendNewInvoice={sendNewInvoice}
                        currentNewInvoice={currentNewInvoice}
                    /> */}
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
                                {isProductInCart(product.id) ? (
                                    <>
                                        <div
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
                                                -
                                            {/* <SvgIcon component={MinusIcon}></SvgIcon> */}
                                            </QuantityBtn>
                                            <QuantityInput
                                                aria-label="skip-drag"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                }}
                                                value={isProductInCart.cantidad}
                                                onChange={(e) => {
                                                    let numbersOnly = new RegExp("^[0-9]+$");
                                                    let isValid = numbersOnly.exec(e.target.value);
                                                    if (isValid || e.target.value == "") {
                                                        /* shoppingCartDispatch({
                                                            type: "CHANGEQUANTITY",
                                                            value: isProductInCart,
                                                            quantity: e.target.value,
                                                            fromInput: true,
                                                        });
                                                        debouncedVerify(isProductInCart); */
                                                    }
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
                                                +
                                            {/* <SvgIcon component={PlusIcon}></SvgIcon> */}
                                            </QuantityBtn>
                                        </div>
                                    </>
                                ) : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => {
                                            handleAddProduct(product)
                                        }}
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
                        </tr>
                    </>
                ))}
            </ProductsTableBody>
        </ProductsTable >

    )
}


const AddProductModal = ({ currentNewInvoice, sendNewInvoice }) => {

    /* useEffect(() => {
        
        console.log(productsInInvoice);
    }, [currentNewInvoice]) */
    return (

        <SearchProductModal
            currentNewInvoice={currentNewInvoice}
            //productsInInvoice={productsInInvoice}
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