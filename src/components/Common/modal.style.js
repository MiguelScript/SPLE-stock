import styled from "styled-components";
import { ButtonBase } from "@material-ui/core";
import { lg } from "../../theme/breakpoints";
export const CloseModal = styled(ButtonBase)`
  position: absolute !important;
  right: 10px;
  z-index: 90;
  width: 30px;
  height: 30px;
  top: 10px;
  background-color: ${(props) => props.theme.palette.primary.main} !important;
  border-radius: 15px !important;
  svg {
    position: relative;
    color: #fff;
  }
  &:focus {
    outline: none;
  }
  ${(props) => props.theme.breakpoints.down(lg)} {
    top: 5px;
  }
`;
