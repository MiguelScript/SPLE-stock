import React, { useEffect, useRef, useState } from 'react';
import { useMachine } from "@xstate/react";
import Select from 'react-select';
import { buscarProductosMachine } from "../../machines/facturacion/buscarProductosMachine";
import { isEmpty } from "lodash";



const SelectCustomer = ({ setCustomer, options }) => {
    // const [current, send] = useMachine(buscarProductosMachine);

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
    
    return (
        <Select
            styles={customStyles}
            className="basic-single"
            classNamePrefix="select"
            // isDisabled={isDisabled}
            // isLoading={true}
            isClearable={true}
            isSearchable={true}
            name="customer"
            getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
            getOptionValue={(option) => `${option.id}`}
            options={options}
            onChange={(e) => { if(e !== null) {setCustomer(e.id)}}}
            placeholder="Escribe para buscar..."
            noOptionsMessage={() => "Sin resultados"}
        />
    );
}

export default SelectCustomer;