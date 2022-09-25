import styled from "styled-components";
import { md } from "../../../theme/breakpoints";


export const DataGridHeader = styled.thead`
  background-color: rgb(232, 240, 254);
  margin-bottom: 30px;

  th {
    padding: 10px;
    position: sticky;
  top: 0; /* Don't forget this, required for the stickiness */
  }
`;

export const DataGridContainer = styled.div`
  /* display: flex;
  justify-content: center; */
  height: 300px;
  overflow: auto;
  background-color: #fff;
`;
//export const DataGridContainer = ;


export const ProductsTable = styled.table`
  //height: 100%;
  //overflow: auto;
  border-collapse: collapse;
  min-width: 100%;

  thead th {
    background-color: rgb(232, 240, 254);
  }

  thead,
  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }
`;



export const ProductsTableBody = styled.tbody`
  //height: 100%;
  //overflow: auto;
  //min-width: 100%;

  td {
    padding: 10px;
  }

  tr {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);

  }
  tr:nth-child(even) {
  background-color: rgba(255, 255, 255, 0.25);
  } 

  tr:nth-child(odd) {
  background-color: rgba(255, 255, 255, 0.5);
  }
 
`;




export const ProductsGrid = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  overflow: auto;
  grid-template-columns: 1fr 4fr 1fr 2fr 1fr;
  
  > div {
    padding: 12px 16px;
    display: contents;
    align-items: center;
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