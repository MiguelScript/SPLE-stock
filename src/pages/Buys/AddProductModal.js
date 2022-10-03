import React, { useEffect, useState } from 'react';
import { useMachine } from "@xstate/react";
import styled from "styled-components";
import SearchProductModal from '../../components/Layout/Modal/SearchProductModal'
import NumberFormat from 'react-number-format';
import { ProductsGrid, DataGridContainer, ProductsTable, DataGridHeader, ProductsTableBody } from "../../components/Layout/Modal/SearchProductModel.styles";
import { ButtonBase, Button, Typography, TextField, SvgIcon } from "@material-ui/core";
import isEmpty from 'lodash/isEmpty';
import AddIcon from "@material-ui/icons/Add";
import { ReusableModalDispatchContext } from '../../context/ReusableModal/reusable-modal';

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
  width: 40px;
  border-radius: 14px !important;
  border:none;
  font-weight:bold;
  padding:0;
  margin: 0 0.5rem;
  input{
    text-align:center;

  }
`;
export const ContainerBtnProductInInvoice = styled.div`
  display: flex;

`;

export const HandleQuantityBtns = ({
    product, theme, currentNewInvoice,
    sendNewInvoice, sendAddProduct }) => {
    const modalDispatch = React.useContext(ReusableModalDispatchContext);

    const handleAddProduct = (product) => {
        //e.stopPropagation();
        sendAddProduct(
            {
                type: "SETSELECTEDPRODUCT",
                product: product,
            }
        )

        modalDispatch({
            type: "CLOSEMODAL"
        }
        )
    };

    return (
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
                Seleccionar
            </Typography>
        </Button>
    )
}


const Item = ({ currency, product, theme, sendNewInvoice, currentNewInvoice, sendAddProduct }) => {

    return (
        <tr>
            <td>
                <Typography variant="subtitle1">
                    {product.codigo}
                </Typography>
            </td>
            <td colSpan={3}>
                <Typography variant="subtitle2">
                    {product.nombre}
                </Typography>
            </td>
            <td colSpan={1}>
                <HandleQuantityBtns
                    theme={theme}
                    sendNewInvoice={sendNewInvoice}
                    currentNewInvoice={currentNewInvoice}
                    product={product}
                    sendAddProduct={sendAddProduct}
                />
            </td>
        </tr >
    )
}

const ProductsTables = ({ currency, products, theme, currentNewInvoice, sendNewInvoice, sendAddProduct }) => {
    return (
        <ProductsTable theme={theme}>
            <DataGridHeader>
                <tr>
                    <th>Codigo</th>
                    <th colSpan={3}>Nombre</th>
                    <th colSpan={1}>Acciones</th>
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
                        sendAddProduct={sendAddProduct}
                        currency={currency}
                    />
                ))}
            </ProductsTableBody>
        </ProductsTable >
    )
}


const AddProductModal = ({ currentNewInvoice, sendNewInvoice, preSearch, theme, sendAddProduct }) => {

    return (

        <SearchProductModal
            currentNewInvoice={currentNewInvoice}
            sendNewInvoice={sendNewInvoice}
            ElHijo={ProductsTables}
            preSearch={preSearch}
            sendAddProduct={sendAddProduct}
            showCurrencySwitch={false}
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