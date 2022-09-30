import styled from "styled-components";
import { md } from "../../theme/breakpoints";
import { Row, Col, FormControl } from "react-bootstrap";
import { Typography, ButtonBase } from "@material-ui/core";
import { DataGridHeader } from "../../components/data-grid/data-grid.styles";
import Paper from '@material-ui/core/Paper';



export const NewInvoiceHeader = styled(Paper)`
    padding: 20px;
`;

export const SelectNewInvoiceHeader = styled.div`
  display: flex;

  .select-new-invoice-header{
    flex: 1;
  }
  
`;

export const DataGridContainer = styled.div`
  min-height: 440px;
  background-color: #fff;
  overflow: auto;
`;

export const ProductsGrid = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  overflow: auto;
  grid-template-columns: 4fr 1fr 1fr 2fr 1fr;
  > div {
    padding: 12px 16px;
    display: flex;
    align-items: center;

    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    h6.product-attribute {
      font-size: 1.1rem;
    }
    &.numeric{
      justify-content: end;
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


export const MainColumn = styled.div`
  grid-column: 1 / one;
`;


export const InvoiceFooterContainer = styled(Paper)`
//height: 55px;
padding: 10px;

`;

export const SwicthContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;



