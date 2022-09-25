import styled, { css } from "styled-components";
import { md, sm } from "../utilities/constantes";
import TextField from "@material-ui/core/TextField";
import { titleFont, mainFont, secondary, primary } from "../Common";
import Button from '@material-ui/core/Button';

export const CardWrapper = styled.div`
  height: 100vh;
  ${mainFont}
  > div.card {
    border-radius: 20px;
    width: 100%;
    height: 640px;
    -webkit-box-shadow: 1px 5px 8px 2px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 1px 5px 8px 2px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 8px 8px 1px rgba(0, 0, 0, 0.1);
  }
`;
export const CardRow = styled.div`
  height: 100%;
  > div.card-body {
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 20px 0px 0px 20px;
    overflow: hidden;
    img{
      width:100%;
      height:100%;
      object-fit:cover;
      object-position:center;
    }
  }
`;
export const CardCol = styled(CardRow)`
  &:first-child {
    background-color: salmon;
    @media (max-width: ${sm}) {
      display: none;
    }
  }
`;
export const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 70px;
`;

export const Img = styled.img`
  height: 100%;
`;

export const CardImgR = styled.img`
  width: 70%;
  height: 100%;
`;

export const PassForgotWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

export const AuthInput = styled(TextField)`
  label {
    &.Mui-focused {
    }
  }
  div.MuiInputBase-root {
    &:hover {
      :before {
      }
    }
    &:after {
    }
  }
`;

export const AuthFormCol = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* flex-direction: column; */
  &.auth-form {
    /* flex-direction: inherit; */
    height:30px;
    align-items: flex-end;
    i {
      font-size: 1.3rem;
      margin-right: 1rem;
      color: #a4a4a4;
    }
    > div.MuiTextField-root {
      width: 100%;
    }
    span.auth-form-input-error {
      font-size: 0.8rem;
      color: red;
    }
  }
  &.auth-forgot {
    display: flex;
    justify-content: flex-end;
    font-size: 0.8rem;
    a {
      color: ${secondary};
      text-decoration: none;
    }
  }
`;

export const Icon = styled.i`
  font-size: 1.5em;
  @media (max-width: ${md}) {
    font-size: 1rem;
  }
  @media (max-width: ${sm}) {
    font-size: 0.8rem;
  }
`;

export const IconWrapper = styled.span`
  background-color: #fff;
`;
export const StyledButton = styled(Button)`
 color:white !important;
 margin-top: 15px;
 &:focus{
   outline:none !important;
 }
  
`;

