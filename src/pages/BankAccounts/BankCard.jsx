import React from 'react';
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { ReusableDrawerDispatchContext } from "../../context/ReusableDrawer/reusable-drawer";
import BankFormUpdate from "../../components/BankForm/BankFormUpdate";


const useStyles = makeStyles((theme) => ({
    container: {
        backgroundColor: '#f2f3f8',
    },
    paper: {
        marginTop: '15px',
    },
    padding: {
        padding: '15px 0',
    },
    formControl: {
        background: 'white',
    },
    migajasContainer: {
        padding: '15px',
        background: '#FFF',
    },
    migajas: {
        justifyContent: 'end',
    },
    flex: {
        display: 'flex',
        justifyContent: 'center'
    },
    flexBetween: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    media: {
        height: 140,
        backgroundSize: 'contain',
    },
    content: {
        marginTop: '1.5rem',
    }
}));

const BankCard = ({ currentParent, sendParent, bank }) => {

    const classes = useStyles();

    const reusableDrawerDispatch = React.useContext(
        ReusableDrawerDispatchContext
    );

    const handleEdit = () => {
        reusableDrawerDispatch({
            type: "OPENDRAWER",
            drawerProps: {
                goToDataTable: () => {
                    sendParent({ type: "GOTODATATABLE" });
                },
                bank,
                layout: {
                    title: "Editar banco"
                }
            },
            component: BankFormUpdate,
        });
    };

    const handleChangeSwitch = (event) => {
        //setState({ ...state, [event.target.name]: event.target.checked });
        const nuevoEstado = event.target.checked;
        if (nuevoEstado == 1) {
            sendParent({ type: "ENABLEBANK", data: bank });
            console.log("chequeado");
        } else {
            sendParent({ type: "DISABLEBANK", data: bank });
        }
    };

    return (
        <Card className={`${classes.card}`}>
            <CardActionArea>
                <CardMedia
                    className={classes.media}
                    image={`${process.env.REACT_APP_BACKEND_URL_IMG}/cuentas/${bank.imagen}`}
                    title={bank.alias}
                />
                <CardContent className={'text-left'}>
                    <Typography
                        gutterBottom
                        variant="h6"
                        component="h6"
                    >
                        {bank.alias}
                    </Typography>
                    <Typography
                        gutterBottom
                    >
                        D.I: {bank.documento_identificacion}
                    </Typography>
                    <FormControlLabel
                        control={<Switch checked={bank.status == 1 ? true : false} onChange={handleChangeSwitch} name="status" />}
                        label="Estado"
                    />
                </CardContent>
            </CardActionArea>

            <CardActions className={'justify-content-center'}>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => {
                        sendParent({ type: "GOTOEDIT", data: bank });
                        handleEdit()
                    }}
                >
                    Editar
                              </Button>
                <Button
                    size="small"
                    //color="error"
                    className={`${classes.btnEliminar}`}
                    onClick={() => {
                        if (currentParent.context.searchByActive) {
                            sendParent({
                                type: "DELETEBANK",
                                data: bank,
                            });
                        } else {
                            sendParent({
                                type: "ENABLEBANK",
                                data: bank,
                            });
                        }
                    }}
                >
                    {(currentParent.context.searchByActive) ? ' Eliminar' : 'Habilitar'}
                </Button>
            </CardActions>
        </Card>
    );
}

export default BankCard;