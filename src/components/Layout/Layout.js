import React from "react";
// import Sidebar from "./Sidebar/Sidebar";
import Topbar from "./Topbar/Topbar";
import { makeStyles } from "@material-ui/core";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Sidebar from "./Sidebar/Sidebar";
import styled from "styled-components";
import { ReusableModalContextProvider } from "../../context/ReusableModal/reusable-modal";
import ReusableModal from "../../components/Common/reusable-modal";

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    minHeight: "100vh",
  },
  contentContainer: {
    backgroundColor: "#f2f5f8", //#f2f3f8
    minHeight: "calc(100vh - 70px)",
    padding: "0",
    alignItems: "start"
  },
  content: {
    width: "100%",
    height: "100%",
    padding: "30px 30px",
  },
  zeroPadding: {
    padding: 0,
  },
  asideContainer: {
    position: 'sticky',
    top: '70px'
  }
}));

const ContentWrapper = styled.div`

padding:2rem;

`;

const Layout = ({ children }) => {
  const classes = useStyles();

  return (
    <Container fluid>
      <ReusableModalContextProvider>
        <Topbar />

        <Row className={classes.contentContainer}>
          {/* <Col md={2}  className={classes.zeroPadding}> <Sidebar /> </Col> */}
          <Col md={2} className={`px-0 ${classes.asideContainer}`} >
            <Sidebar />
          </Col>
          <Col md={10}>
            <ContentWrapper>{children}</ContentWrapper>
          </Col>
        </Row>
        <ReusableModal />
      </ReusableModalContextProvider>
    </Container>
  );
};

export default Layout;
