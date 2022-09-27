import React, { useEffect, useRef, useState } from 'react';
import { useMachine } from "@xstate/react";
import Select from 'react-select';
import { buscarProductosMachine } from "../../machines/facturacion/buscarProductosMachine";
import { isEmpty } from "lodash";



const SelectSeller = ({ setSeller, options }) => {
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
            name="seller"
            getOptionLabel={(option) => `${option.codigo} - ${option.nombre}`}
            getOptionValue={(option) => `${option.id}`}
            options={options}
            onChange={(e) => { if(e !== null) {setSeller( e.id)}}}
            placeholder="Escribe para buscar..."
            noOptionsMessage={() => "Sin resultados"}
        />
    );
}

export default SelectSeller;