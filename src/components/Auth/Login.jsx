import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import LoginForm from "./LoginForm";

const useStyles = makeStyles(theme => ({
    mainContainer: {
        minHeight: "100vh",
        minWidth: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#f5f6f8", //#f2f3f8

    },
    loginConainer: {

        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        backgroundColor: "#f5f6f8", //#f2f3f8
        minHeight: "calc(100vh - 64px)",
        padding: "0"
    },
    content: {
        width: '100%',
        height: '100%',
        padding: '30px 30px',
    },
    zeroPadding: {
        padding: 0
    }
}));

const Login = () => {

    const classes = useStyles();

    return (


        <div className={classes.mainContainer}>
            <Container>
                <Row className={classes.loginConainer}>
                    <Col md={6}>
                        <Card>
                            <CardContent>
                                <LoginForm/>
                            </CardContent>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>



    );
}

export default Login;
