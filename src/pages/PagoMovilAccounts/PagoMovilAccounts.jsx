import React, { useEffect } from 'react';
import isEmpty from "lodash/isEmpty";
import Paginador from "../../components/Common/Paginador";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import LoadingSpinner from '../../components/Loading/LoadingSpinner';

import { useMachine } from "@xstate/react";
import { adminPagoMovilAccountsMachine } from '../../machines/pagoMovil/adminPagoMovilAccountsMachine';
import {
  ReusableDrawerContextProvider,
  ReusableDrawerDispatchContext,
} from "../../context/ReusableDrawer/reusable-drawer";
import PagoMovilForm from "../../components/PagoMovilForm/PagoMovilForm";
import PagoMovilCard from './PagoMovilCard';
import { withRouter } from 'react-router-dom';

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


export function PagoMovilAccounts({ history }) {
  const classes = useStyles();
  const [current, send] = useMachine(adminPagoMovilAccountsMachine);
  const reusableDrawerDispatch = React.useContext(
    ReusableDrawerDispatchContext
  );

  const handleChangeSearch = (e) => {
    const { name, value } = e.target;
    send({ type: "SEARCH", value });
  };

  useEffect(() => {
    send({ type: 'FETCHPAGOMOVILACCOUNTS' })
  }, []);

  const handleCreate = () => {
    reusableDrawerDispatch({
      type: "OPENDRAWER",
      drawerProps: {
        goToDataTable: () => {
          send({ type: "GOTODATATABLE" });
        },
        layout: {
          title: "Crear banco",
        },
      },
      component: PagoMovilForm,
    });
  };

  return (

    <div>
      <Row className={classes.paper}>
        <Col xl={12}><Button variant="contained" color="primary" className="mb-3" onClick={() => { history.push('/settings/metodos-pago') }}>Volver</Button></Col>
        <Col md={12} className={classes.flexBetween}>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            <AddIcon />
            <Typography className={classes.center} >
              Agregar
            </Typography>

          </Button>
          <TextField
            id="outlined-basic"
            label="Buscar"
            variant="outlined"
            name='searchUserName'
            size="small"
            className={classes.formControl}
            onChange={handleChangeSearch}
          />
        </Col>
      </Row>
      <Row className={classes.content}>
        {current.matches("dataReady") ? (
          <>
            <Col md={12}
            >
              <Row>
                {!isEmpty(current.context.PagoMovilAccounts) ? (
                  current.context.PagoMovilAccounts.map((pagoMovil, index) => (
                    <div key={pagoMovil.id} className="col-md-3 mb-3">
                      <PagoMovilCard
                        currentParent={current}
                        sendParent={send}
                        pagoMovil={pagoMovil}
                      />
                    </div>
                  ))
                ) : (
                    <div className="col-md-12 d-flex justify-content-center">
                      <Typography variant="h5">
                        {current.context.responseMsg}
                      </Typography>
                    </div>
                  )}
              </Row>
            </Col>
            <Col xl={12} className="mt-3">
              <Paginador
                limit={current.context.pageInfo.limit}
                total={current.context.totalPagoMovils}
                actualPage={current.context.pageInfo.actualPage}
                sendParent={send}
                hasPageNumbers={false}
              />
            </Col>
          </>
        ) : (
            <div
              className={`col-md-12 d-flex justify-content-center  ${classes.content}`}
            >
              {" "}
              <LoadingSpinner />
            </div>
          )}
      </Row>
    </div>
  );
}

export default withRouter(PagoMovilAccounts);