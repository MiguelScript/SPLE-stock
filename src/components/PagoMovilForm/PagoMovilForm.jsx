import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import CompletedFormLayout from '../Common/CompletedFormLayout';
import { useMachine } from "@xstate/react";
import SimpleReactValidator from "simple-react-validator";
import { CreatePagoMovilMachine } from '../../machines/pagoMovil/createPagoMovilMachine';
import { ActionBtnsContainer } from '../../components/Common/reusable-drawer';
import { ReusableDrawerDispatchContext } from "../../context/ReusableDrawer/reusable-drawer";


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    container: {
        backgroundColor: '#f2f3f8',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
    },
    formTitle: {
        height: '100px',
        padding: '30px',
    },
    padding: {
        padding: '16px',
    },
    formButtoms: {
        position: 'absolute',
        bottom: '0',
        width: '100%',
        textAlign: 'center',
    },
    flexButtoms: {
        padding: '30px',
    }
}));
const useForceUpdate = () => useState()[1];


const BankForm = ({ goToDataTable }) => {

    const forceUpdate = useForceUpdate();



    const reusableDrawerDispatch = React.useContext(
        ReusableDrawerDispatchContext
    );

    const classes = useStyles();

    const [current, send] = useMachine(CreatePagoMovilMachine);

    const handleChange = (e) => {
        const { name, value } = e.target;
        send({ type: "SETDATA", name, value });
    };

    const simpleValidator = useRef(
        new SimpleReactValidator({
            messages: {
                required: "* Este campo es requerido",
                email: "El correo electrónico debe ser válido",
                numeric: "El número de teléfono debe ser válido",
            },
        })
    );

    const handleUploader = (e) => {

    }

    const checkEmptyFields = () =>
        current.context.formData.telefono == "" ||
        current.context.formData.alias == "" ||
        current.context.formData.titular == "" ||
        current.context.formData.documentoIdentificacion == ""

    const handleSubmit = (e) => {
        e.preventDefault();
        if (simpleValidator.current.allValid()) {
            if (current.matches("editingForm")) {
                send({ type: "SUBMITFORM" });
            }
        } else {

            console.log(typeof (current.context.formData.cuenta));
            simpleValidator.current.showMessages(true);
            console.log(simpleValidator.current.getErrorMessages());
            forceUpdate(e);
        }
    };

    const handleClose = () => {
        reusableDrawerDispatch({ type: "CLOSEDRAWER" });
    };

    useEffect(() => {
        if (current.matches("completedForm")) {
            // closeDrawer();
            setTimeout(() => {
                handleClose();
                goToDataTable()
            }, 2000);
        }
    }, [current]);

    return (
        <Container className={classes.formContainer}>
            <Form onSubmit={handleSubmit} className="form-row">
                {!(current.matches('completedForm')) ? (
                    <>
                        <Paper className={`${classes.padding} w-100`} elevation={1}>
                            <Col md={12}>
                                <Form.Group controlId="exampleForm.ControlInput1">
                                    <TextField
                                        label="Titular de la cuenta"
                                        variant="outlined"
                                        name="titular"
                                        onChange={handleChange}
                                        //required={}
                                        fullWidth
                                    />


                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                <TextField
                                    label="Numero de telefono"
                                    type="number"
                                    variant="outlined"
                                    margin="normal"
                                    name='telefono'
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Col>

                            <Col md={12}>
                                <TextField
                                    label="Documento de identificacion"
                                    variant="outlined"
                                    margin="normal"
                                    name='documentoIdentificacion'
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Col>
                            <Col md={12}>
                                <TextField
                                    label="Alias de la cuenta"
                                    variant="outlined"
                                    margin="normal"
                                    name='alias'
                                    onChange={handleChange}

                                    fullWidth
                                />
                                <p>
                                    {simpleValidator.current.message('alias', current.context.formData.titular, 'required')}

                                </p>
                            </Col>
                            <Col md={12}>
                                <FormControl variant="outlined" fullWidth margin="normal">
                                    <InputLabel id="demo-simple-select-outlined-label">
                                        Plataforma
                </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        onChange={handleChange}
                                        label="Plataforma"
                                        name="plataforma"
                                        defaultValue={0}
                                    >
                                        <MenuItem value={0}>
                                            <em>Ninguna</em>
                                        </MenuItem>
                                        <MenuItem value={7}>Banco Banesco</MenuItem>
                                        <MenuItem value={8}>Banco Provincial</MenuItem>
                                        <MenuItem value={6}>Banco de Venezuela</MenuItem>
                                    </Select>
                                </FormControl>
                            </Col>
                        </Paper>

                        <ActionBtnsContainer>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={handleClose}
                                className="mr-3"
                                onClick={() => {
                                    if (!current.matches("submittingForm")) {
                                        handleClose();
                                    }
                                }}
                            >
                                Cancelar
            </Button>{" "}
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={checkEmptyFields()}
                            >
                                Crear Banco
            </Button>
                        </ActionBtnsContainer>
                    </>
                ) : (
                        <CompletedFormLayout message={"¡El Pago movil se ha creado correctamente!"} />
                    )}
            </Form>
        </Container>
    );
};

export default BankForm;