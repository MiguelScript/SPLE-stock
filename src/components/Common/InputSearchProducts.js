import React, { useEffect, useRef, useCallback } from 'react';
import { useMachine } from "@xstate/react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { buscarProductosMachine } from "../../machines/facturacion/buscarProductosMachine";
import { isEmpty } from "lodash";
import debounce from "lodash/debounce";


const InputSearchProducts = ({ sendParent, preSearch }) => {

    const [current, send] = useMachine(buscarProductosMachine);

    const debouncedVerify = useCallback(
        debounce(function (value) {
            sendParent(
                {
                    type: "SEARCHPRODUCTS",
                }
            );
            send(
                {
                    type: "SEARCH", value
                }
            );

        }, 500),
        []
    );

    const handleChange = (e) => {
        const { value } = e.target
        if (value !== '') {
            debouncedVerify(value)
        }
    }

    useEffect(() => {
        if (preSearch !== '') {            
            debouncedVerify(preSearch)
        }
    }, [])

    useEffect(() => {
        if (current.matches("dataReady")) {
            const products = current.context.productos;
            const totalProducts = current.context.totalProductos;
            sendParent(
                {
                    type: "SETPRODUCTS",
                    products: products,
                    totalProducts: totalProducts
                }
            );
        }
    }, [current])

    /* useEffect(() => {
        console.log(value);
        if (isEmpty(value)) {
            console.log("clear input");
            selectInputRef.current.select.clearValue();
        }
    }, [value]) */



    /* const select = e => {
        let name = "product";
        console.log(e);
        let value = e ? (JSON.parse(e.value)) : [];
        console.log(value);

        sendParent(
            {
                type: "SETDATA",
                name,
                value
            }
        );

        //para limpiar el input de cantidad
        let nameQuantity = "quantity";
        let valueQuantity = 1;
        sendParent(
            {
                type: "SETDATA",
                nameQuantity,
                valueQuantity
            }
        );

        //setSelet();
    }
 */
    return (
        <TextField
            label="Escribe aqui para buscar"
            variant="outlined"
            size="small"
            name="product"
            defaultValue={preSearch !== '' || preSearch !== undefined ? preSearch : ''}
            onChange={handleChange}
        //placeholder="Escribe aqui para buscar un producto"
        />
    );
}

export default InputSearchProducts;