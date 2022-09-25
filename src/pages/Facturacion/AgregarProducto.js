import React, { useEffect, useState, useRef } from 'react';
import { useMachine } from "@xstate/react";
import TextField from '@material-ui/core/TextField';
import { Row, Col, FormControl, Form } from "react-bootstrap";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import SelectProducts from './SelectProducts'
import { addProductMachine } from '../../machines/facturacion/addProductMachine';
import NumberFormat from 'react-number-format';
import SimpleReactValidator from "simple-react-validator";
import styled from "styled-components";



const useForceUpdate = () => useState()[1];

export const ErrorIndicator = styled.div`
  ${props => props.relative ? (`position: relative;`) : (`position: absolute;`)};
  top: 10px;
  right: 10px;
`;

export const FormContainer = styled(Form)`
  align-items: center;
  justify-content: center;
`;

const AgregarProducto = ({ addProduct }) => {

    const forceUpdate = useForceUpdate();

    const [current, send] = useMachine(addProductMachine);

    const [resetSelect, setResetSelect] = useState(false);

    const simpleValidator = useRef(
        new SimpleReactValidator({
            messages: {
                required: "* Este campo es requerido",
                email: "El correo electrónico debe ser válido",
                numeric: "El número de teléfono debe ser válido",
            },
        })
    );

    let productErrorMessage = simpleValidator.current.message(
        "producto",
        current.context.formData.product,
        "required",
        { messages: { required: "El producto es requerido" } }
    );

    let quantityErrorMessage = simpleValidator.current.message(
        "cantidad",
        current.context.formData.quantity,
        "required",
        { messages: { required: "La cantidad es requerida" } }
    );

    const checkEmptyFields = () =>
        current.context.formData.product == "" ||
        current.context.formData.quantity == ""

    const handleSubmit = (e) => {


        e.preventDefault();
        if (simpleValidator.current.allValid()) {
            if (current.matches("editingForm")) {
                send(
                    {
                        type: "SUBMITFORM",
                    }
                );
                addProduct(current.context.formData.product, current.context.formData.quantity);
            }
        } else {

            //console.log(typeof (current.context.formData.cuenta));
            simpleValidator.current.showMessages(true);
            console.log(simpleValidator.current.getErrorMessages());
            forceUpdate(e);
        }


        e.preventDefault();

    }

    useEffect(() => {
        if (current.matches("completedForm")) {
            console.log("completado");
            send(
                {
                    type: "CLEARFORMDATA",
                }
            );
            setResetSelect(true);
        }

    }, [current])

    const quantityIsAllowed = (inputObj) => {
        const { value } = inputObj;
        if (value > current.context.formData.product.cantidad || value < 1) {
            if (!value == "") {
                return null;
            }
        }
        return inputObj;
    }

    return (
        <FormContainer className="row" onSubmit={(e) => {
            handleSubmit(e);
        }}>
            <Col md={5}>
                <SelectProducts
                    sendParent={send}
                    value={current.context.formData.product}
                    resetSelect={resetSelect}
                    setSelet={() => setResetSelect(false)}
                />
                <TextField
                    name="quantity"
                    label="Cantidad"
                    type="number"
                    variant="outlined"
                    size="small"
                    sendParent={send}
                    value={current.context.formData.product}
                />
            </Col>
            <Col md={3}>

                {current.context.formData.product.cantidad ? (
                    <NumberFormat
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
                    />
                ) : (
                    <TextField
                        name="quantity"
                        label="Cantidad"
                        type="number"
                        variant="outlined"
                        size="small"
                        disabled
                    />
                )
                }

            </Col>
            <Col md={3}>
                <div className="d-flex justify-content-center">
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={checkEmptyFields()}
                    >
                        <AddIcon />
                        <Typography >
                            Agregar
                    </Typography>
                    </Button>
                </div>
            </Col>

            <div className="d-flex justify-content-center">
                <Collapse
                    in={
                        current.matches("error") ||
                        productErrorMessage || quantityErrorMessage
                    }
                >
                    <Typography
                        color="error"
                        className="text-center"
                    >{`${current.context.responseMsg}`}</Typography>
                    {/* {fileErrorMessage ? (
                                    <Typography color="error" className="d-flex text-center">
                                        *{fileErrorMessage}
                                    </Typography>
                                ) : null} */}

                    {productErrorMessage != "" && (
                        <ErrorIndicator relative={true}>
                            <Typography color="error">
                                *{productErrorMessage}
                            </Typography>
                        </ErrorIndicator>
                    )}

                    {quantityErrorMessage ? (
                        <Typography color="error" className="d-flex text-center">
                            *{quantityErrorMessage}
                        </Typography>
                    ) : null}
                </Collapse>
            </div>

        </FormContainer>
    );
}

export default AgregarProducto;