import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ReactComponent as TransferenciaIcon } from "../../assets/icons/bxs-bank.svg";
import { ReactComponent as PagoMovilIcon } from "../../assets/icons/bx-mobile.svg";
import { Link, withRouter } from 'react-router-dom';
import SettingsCard from '../../components/SettingsCard/SettingsCard';
import {PAGO_MOVIL} from "../../config/constants";
import {Button} from '@material-ui/core';
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

const PaymentMethods = ({history}) => {

    const classes = useStyles();

    return (
        <div>
            <Row className={classes.paper}>
            <Col xl={12}><Button variant="contained" color="primary" className="mb-3" onClick={()=>{history.push('/settings')}}>Volver</Button></Col>
                <Col md={12}>
                    <Row>
                        <Col md={6} className="mb-4">
                            <Link to={`/settings/metodos-pago/transferencias-bancarias`} className="text-decoration-none">
                                <SettingsCard
                                    icon={TransferenciaIcon}
                                    title='Transferencia bancaria'
                                />
                            </Link>
                        </Col>
                        <Col md={6}>
                            <Link to={PAGO_MOVIL} className="text-decoration-none">
                                <SettingsCard
                                    icon={PagoMovilIcon}
                                    title='Pago movil'
                                />
                            </Link>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </div>
    );
}

export default withRouter(PaymentMethods);