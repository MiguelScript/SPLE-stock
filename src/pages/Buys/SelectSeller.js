import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';

const SelectSeller = ({ setSeller, options }) => {

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