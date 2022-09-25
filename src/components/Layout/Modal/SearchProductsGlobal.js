import React from 'react';
import SearchProductModal from './SearchProductModal'
import NumberFormat from 'react-number-format';
import { ProductsGrid, DataGridContainer, ProductsTable, DataGridHeader, ProductsTableBody } from "./SearchProductModel.styles";
import Typography from "@material-ui/core/Typography";
import isEmpty from 'lodash/isEmpty';


const ProductsTables = ({theme, currency, products}) => {

    return (
    <ProductsTable theme={theme}>
        <DataGridHeader>
            <tr>
                <th>Codigo</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Precio venta</th>
                {/* {isNewInvoice && (
                        <>
                            <th>Acciones</th>
                        </>

                    )} */}
            </tr>
        </DataGridHeader>

        <ProductsTableBody>
            {products.map(product => (
                <tr key={product.id}>
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
                </tr>
            ))} 
        </ProductsTableBody>
    </ProductsTable>

    )
}


const SearchProductsGlobal = ({ theme, currency, products }) => {
    return (

        <SearchProductModal ElHijo={ProductsTables}>
            {/*  {
                !isEmpty(products) ? ( */}

                {/* <ProductsTables 
                    theme={theme}
                    currency={currency}
                    products={products}
                /> */}

            {/*  ) : (
                    <div>no hay productos por este nombre</div>

                )
            } */}
        </SearchProductModal>
    );
}

export default SearchProductsGlobal;