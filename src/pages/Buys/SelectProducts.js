import React, { useEffect, useRef  } from 'react';
import { useMachine } from "@xstate/react";
import Select from 'react-select';
import { buscarProductosMachine } from "../../machines/facturacion/buscarProductosMachine";
import { isEmpty } from "lodash";



const SelectProducts = ({ sendParent, value , resetSelect, setSelet}) => {
    const selectInputRef = useRef();

    const [current, send] = useMachine(buscarProductosMachine);

    const customStyles = {

        container: (provided, state) => ({
            ...provided,
            height: "100%"
        }),

        control: (provided, state) => ({
            ...provided,
            //height: "100%"
        }),

    }

    useEffect(() => {
        console.log(value);
        send({ type: "WAITING" });
    }, [])

    useEffect(() => {
        console.log(value);
        if (resetSelect === true) {
            selectInputRef.current.select.clearValue();
        }
    }, [resetSelect])

    /* useEffect(() => {
        console.log(value);
        if (isEmpty(value)) {
            console.log("clear input");
            selectInputRef.current.select.clearValue();
        }
    }, [value]) */

    const handleSelectChange = (value) => {
        send({ type: "SEARCH", value });
        console.log(value);
    }



    let options = current.context.productos.map(e => {
        let item = {};
        item.id = e.id;
        item.value = JSON.stringify(e);
        item.label = e.nombre + " - " + e.precio_costo;

        return item;
    });

    const select = e => {
        //current.context.productos.find()
        //sendParent(e)
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

        setSelet();
    }

    return (
        <Select
            styles={customStyles}
            /* options={current.context.productos.map(ele => ({
                value: JSON.stringify(ele),
                label: ele.nombre + " - " + ele.precio_costo
            }))} */
            options={options}
            onInputChange={(e) => {
                handleSelectChange(e);
            }}
            onChange={(e) => { select(e) }}
            /* getOptionValue={(option) => {
                if (!isEmpty(value)) {
                    console.log(value);
                    let selected = options.find(e => e.id == value.id)
                    console.log(selected);
                    return selected;

                }
                else { return option }

            }}
            getOptionLabel={(option) => {
                if (!isEmpty(value)) {
                    let optione = options.find(e => e.id == value.id)
                    return optione.label
                }
                else { return option.label }

            }} */
            name="product"
            /* Inputvalue={(option) => {
                if (!isEmpty(value)) {
                    console.log("value lleno");

                    let optione = options.find(e => e.id == value.id)
                    console.log(optione);
                    return optione;
                }
                else {
                    console.log("value vacio");
                    return null
                }

            }} */
             Inputvalue={(option) => {
                if (!isEmpty(value)) {
                    console.log("value lleno");

                    let optione = options.find(e => e.id == value.id)
                    console.log(optione);
                    return optione;
                }
                else {
                    console.log("value vacio");
                    return null
                }

            }} 
            ref={selectInputRef}
            placeholder="Escribe aqui para buscar un producto"
        /* value={value ? (options.find(element => element.id == value.id)) : ("")}
        getOptionLabel={(value) => value ? (options.find(element => element.id == value.id)) : ("")} */
        />
    );
}

export default SelectProducts;