import styled from "styled-components";
import { lg, md } from "../../../theme/breakpoints";
import { Col, Modal } from "react-bootstrap";

export const Container = styled.form`
  position: relative;
  width: 768px;
  max-width: 100%;
  padding: 2rem 3rem !important;
  min-height: 50vh;
  ${(props) => props.theme.breakpoints.down(lg)} {
    width: initial;
  }
  ${(props) => props.theme.breakpoints.down(md)} {
    padding: 2rem 1.5rem !important;
  }
`;

export const ModalHeading = styled(Col)`
  // border-bottom: 1px solid ${(props) => props.theme.palette.primary.main};
  display: flex;
  
  div.icon-container {
    margin-right: 1.5rem;
    background-color: rgba(0, 185, 229, 0.25);
    min-width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 30px;
    svg {
      color: ${(props) => props.theme.palette.primary.main};
    }
  }
  p {
    color: #9aa0b0;
  }
  
`;
