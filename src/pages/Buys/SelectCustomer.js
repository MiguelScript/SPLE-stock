import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

const SelectCustomer = ({ setCustomer, options }) => {

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
            className="select-new-invoice-header"
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