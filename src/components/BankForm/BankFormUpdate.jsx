import React, { useEffect, useRef } from 'react';
import Button from '@material-ui/core/Button';
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
import { updateBankMachine } from '../../machines/bankAccounts/updateBankMachine';
import { ReusableDrawerDispatchContext } from "../../context/ReusableDrawer/reusable-drawer";
import { ActionBtnsContainer } from '../../components/Common/reusable-drawer';
import NumberFormat from 'react-number-format';

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

const BankFormUpdate = ({ goToDataTable , bank }) => {

    const reusableDrawerDispatch = React.useContext(
        ReusableDrawerDispatchContext
    );

    const [current, send] = useMachine(updateBankMachine);
    const classes = useStyles();

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

    const checkEmptyFields = () =>
        current.context.formData.cuenta === "" ||
        current.context.formData.alias === "" ||
        current.context.formData.titular === "" ||
        current.context.formData.documentoIdentificacion === ""

    const handleSubmit = (e) => {
        e.preventDefault();
        if (simpleValidator.current.allValid()) {
            if (current.matches("editingForm")) {
                send({ type: "SUBMITFORM" });
            }
        } else {
            console.log('error');
            simpleValidator.current.showMessages();
            //forceUpdate(e);
        }
    };

    const handleClose = () => {
        reusableDrawerDispatch({ type: "CLOSEDRAWER" });
    };

    useEffect(() => {
        send({
            type: "SETFORMDATA",
            bankId: bank.id,
            alias: bank.alias,
            titular: bank.titular,
            cuenta: bank.cuenta,
            documentoIdentificacion: bank.documento_identificacion,
            plataforma: bank.plataforma_id,
        });
    }, []);

    useEffect(() => {
        if (current.matches("completedForm")) {
            // closeDrawer();
              setTimeout(() => {
                handleClose();
                goToDataTable();
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
                                        label="Tiular de la cuenta"
                                        variant="outlined"
                                        name="titular"
                                        onChange={handleChange}
                                        defaultValue={bank.titular}
                                        fullWidth
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12}>
                                {/* <TextField
                                    label="Numero de cuenta"
                                    variant="outlined"
                                    margin="normal"
                                    name='cuenta'
                                    onChange={handleChange}
                                    defaultValue={bank.cuenta}
                                    fullWidth
                                /> */}
                                <NumberFormat
                                    type="tel"
                                    defaultValue={bank.cuenta}
                                    format="####-####-####-####-####"
                                    onChange={handleChange}
                                    label="Numero de cuenta"
                                    placeholder="Cédula o RIF"
                                    name="cuenta"
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth
                                    aria-label="numero_cuenta"
                                    customInput={TextField}
                                />
                            </Col>

                            <Col md={12}>
                                <TextField
                                    label="Documento de identificacion"
                                    variant="outlined"
                                    margin="normal"
                                    name='documentoIdentificacion'
                                    onChange={handleChange}
                                    defaultValue={bank.documento_identificacion}
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
                                    defaultValue={bank.alias}
                                    fullWidth
                                />
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
                                        defaultValue={parseInt(bank.plataforma_id)}

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
                                Actualizar Banco
            </Button>
                        </ActionBtnsContainer>
                    </>
                ) : (
                        <CompletedFormLayout message={"¡El banco se ha acltualizado correctamente!"} />
                    )}
            </Form>
        </Container>
    );
};

export default BankFormUpdate;