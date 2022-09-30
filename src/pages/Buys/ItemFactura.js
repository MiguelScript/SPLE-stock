import React from 'react';

const ItemFactura = ({ producto }) => {
    return (
        <div>
            <p>{producto.nombre}</p>
            <p>{producto.cantidad}</p>
            <p>{producto.precio_costo}</p>
        </div>
    );
}

export default ItemFactura;