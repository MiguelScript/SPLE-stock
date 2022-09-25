import React, { useState, useRef, useContext, useCallback } from 'react';
import DrawerContext from '../../context/Drawer/DrawerContext';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Paper from '@material-ui/core/Paper';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useMachine } from "@xstate/react";
import SimpleReactValidator from "simple-react-validator";
import { CreateProductoMachine } from '../../machines/products/createProductsMachine';

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

    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    formTitle: {
        position: 'sticky',
        padding: '15px',
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

const ProductForm = () => {

    const [drawerState, drawerDispatch] = useContext(DrawerContext);

    const closeDrawer = useCallback(() => drawerDispatch({ type: 'CLOSE_DRAWER' }), [
        drawerDispatch,
    ]);

    const sendParent = drawerState.data;


    const classes = useStyles();


    const [current, send] = useMachine(CreateProductoMachine);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name + ': ' + value);
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

    const handleSubmit = e => {

        e.preventDefault();
        if (simpleValidator.current.allValid()) {

            if (current.matches("editingForm")) {
                send({ type: "SUBMITFORM" });
                //console.log('Producto actualizado');
                //closeDrawer();
            }

        } else {
            simpleValidator.current.showMessages();
            //forceUpdate(e);
        }

        //closeDrawer();
    };

    return (
            <Container className={classes.formContainer}>
                <Form onSubmit={handleSubmit}>
                    <Row className={classes.formTitle}>
                        <Col md="12">
                            <Typography>Crear producto</Typography>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <Row>
                                <Col md={4}>
                                    Agrega un titulo, descripcion y informacion formacion adicional de producto
                                </Col>
                                <Col md={8}>
                                    <Paper className={classes.padding} elevation={3}>
                                        <Col md={12}>
                                            <Form.Group controlId="exampleForm.ControlInput1">
                                                <TextField
                                                    id="outlined-basic"
                                                    label="Titulo"
                                                    variant="outlined"
                                                    name='titulo'
                                                    onChange={handleChange}
                                                    fullWidth
                                                />
                                            </Form.Group>
                                        </Col>

                                        <Col md={12}>
                                            <TextField
                                                id="outlined-basic"
                                                label="Descripcion"
                                                variant="outlined"
                                                margin="normal"
                                                name='descripcion'
                                                onChange={handleChange}
                                                fullWidth
                                            />

                                        </Col>

                                        <Col md={12}>
                                            <TextField
                                                id="outlined-basic"
                                                label="Cantidad"
                                                variant="outlined"
                                                margin="normal"
                                                name='cantidad'
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                        </Col>
                                        <Col md={12}>
                                            <TextField
                                                id="outlined-basic"
                                                label="Precio"
                                                variant="outlined"
                                                margin="normal"
                                                name='precio'
                                                onChange={handleChange}
                                                fullWidth
                                            />
                                        </Col>
                                    </Paper>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row className={classes.formButtoms}>
                        <Col md={12}>
                            <Row className={classes.flexButtoms}>
                                <Col md={6}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={closeDrawer}
                                    >
                                        Cancelar
                            </Button>
                                </Col>
                                <Col md={6}>
                                    <Button
                                        type='submit'
                                        variant="contained"
                                        color="primary"
                                    >
                                        Crear producto
                            </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>

            </Container>
    );
};

export default ProductForm;