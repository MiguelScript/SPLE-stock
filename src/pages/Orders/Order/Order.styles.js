import styled from "styled-components";
import { md } from "../../../theme/breakpoints";
import { Typography, ButtonBase } from "@material-ui/core";
import { DataGridHeader } from "../../../components/data-grid/data-grid.styles";
export const Header = styled(DataGridHeader)`
  padding: 30px;
  border-radius: 5px;
  > div {
    span {
      font-weight: 500;
      color: #7a7f8b;
    }
    h6 svg {
      color: ${(props) => props.theme.palette.primary.light};
    }

    &:first-child {
      border-left: 1px solid #c4cacc;
    }
    border-right: 1px solid #c4cacc;
  }

  ${(props) => props.theme.breakpoints.down(md)} {
    > div {
      span {
        font-weight: 400;
      }
      margin-bottom: 1rem;
      padding: 0rem 0.4rem !important;
      border-left: 1px solid #c4cacc;
      border-right: 1px solid #c4cacc;
    }
  }
`;

export const StatusIndicator = styled(Typography)`
  color: white;
  background-color: rgb(225, 234, 13);
  display: inline-block;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
  &.en-proceso {
    background-color: rgb(225, 234, 13);
  }
  &.en-verificacion {
    background-color: ${(props) => props.theme.palette.primary.light};
  }
  &.en-camino {
    background-color: ${(props) => props.theme.palette.success.main};
  }
  &.finalizada {
    background-color: #4fd397;
  }
  &.cancelada {
    background-color: ${(props) => props.theme.palette.error.main};
  }
`;

export const Box = styled.div`
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  padding: 20px;
  margin-bottom: 30px;
  border: 1px solid #c4cacc;
  min-height: 245px;
`;
export const PaymentInfo = styled(Box)`
  flex-direction: column;
  align-items: start;
  h6.payment-header-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.2rem;
    border-bottom: 1px solid #c4cacc;
    width: 100%;
    padding-bottom: 0.5rem;
  }
  h6.payment-info-title {
    font-size: 1.1rem;
  }
  div.payment-info-image {
    width: 150px;
    height: 150px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  div.payment-actions {
    flex-wrap: wrap;
    button {
      &:focus {
        outline: none;
      }

      &.validar-btn {
        background-color: ${(props) =>
          props.theme.palette.success.main} !important;
        &:hover {
          background-color: ${(props) =>
            props.theme.palette.success.dark} !important;
        }
      }

      &.cambiar-metodo {
        background-color: ${(props) =>
          props.theme.palette.success.main} !important;
        &:hover {
          background-color: ${(props) =>
            props.theme.palette.success.dark} !important;
        }
      }
      ${(props) => props.theme.breakpoints.down(md)} {
        margin-bottom: 1rem;
        margin-right: 0 !important;
      }
    }
  }
`;

export const OrderContent = styled(PaymentInfo)``;

export const ProductsGrid = styled.div`
  display: grid;
  width: 100%;
  overflow: auto;
  grid-template-columns: 1fr 5fr 2fr 1fr 1fr;
  > div {
    padding: 12px 16px;
    display: flex;
    align-items: center;

    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    h6.product-attribute {
      font-size: 1.1rem;
    }
    p.product-attribute {
      display: flex;
      align-items: center;
    }
    &.header-column {
      border: 1px solid rgba(0, 0, 0, 0.12);
      border-left: none;
      border-right: 1px solid rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      background-color: #fff;
      &:nth-child(5) {
        border-right: none !important;
      }
      p {
        font-weight: bold !important;
      }

      ${(props) => props.theme.breakpoints.down(md)} {
        position: sticky;
        top: 0px;
      }
    }
  }
`;
export const Product = styled.div`
  display: flex;
  align-items: center;
  div {
    width: 100px;
    height: 100px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
`;

export const TooltipTitle = styled.div`
  p {
    color: white;
    text-align: center;
  }
`;
export const TooltipButton = styled(ButtonBase)`
  &:focus {
    outline: none;
  }

  svg {
    font-size: 2rem;
    ${(props) =>
      props.alreadyCopied ? `color:${props.theme.palette.success.main}` : ``}
  }
`;

export const ContactInfo = styled(Box)`
  flex-direction: column;
  align-items: start;
  width: 100%;
  h6.client-name {
    width: 100%;
    font-weight: 500;
    font-size: 1.25rem;
    color: ${(props) => props.theme.palette.primary.main};
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #c4cacc;
  }
`;
export const OrderActions = styled(ContactInfo)`
  min-height: inherit;
  button {
    width: 100%;
    display: flex;
    align-items: center;
    h6 {
      color: white;
    }
    &.btn-cancelar {
      background-color: ${(props) => props.theme.palette.error.main};

      &:hover {
        background-color: ${(props) =>
          props.theme.palette.error.dark} !important;
      }
    }
    &.btn-historial-acciones {
      background-color: ${(props) => props.theme.palette.warning.main};

      &:hover {
        background-color: ${(props) =>
          props.theme.palette.warning.dark} !important;
      }
    }
    &.btn-cambiar-estado {
      background-color: ${(props) =>
        props.theme.palette.success.main} !important;
      h6 {
        color: white;
      }
      &:hover {
        background-color: ${(props) =>
          props.theme.palette.success.dark} !important;
      }
    }
  }
`;
