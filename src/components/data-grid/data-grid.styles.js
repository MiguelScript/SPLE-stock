import styled from "styled-components";
import { md } from "../../theme/breakpoints";
export const DataGridHeader = styled.header`
  background-color: #fff;

  display: flex;
  align-items: center;
  padding: 40px;
  margin-bottom: 30px;
`;

export const DataGridContainer = styled.div`
  height: 450px;
  background-color: #fff;
  overflow: auto;
`;

/* export const Cell = styled.div`
    padding: 12px 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);

    &.header-column {
    
    cursor: default;
    border: 1px solid rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(232, 240, 254);
    padding: 10px;
    position: sticky;
    top: 0;  Don't forget this, required for the stickiness 

    background-color: #fff;
    p {
      font-weight: bold !important;
    }

    ${(props) => props.theme.breakpoints.down(md)} {
      position: sticky;
      top: 0px;
    }
  }

  span.MuiBadge-root {
      span {
        position: relative;
        top: inherit;
        right: inherit;
        transform: translate(0, 0);
      }
    }
    p {
      user-select: none;
    }
    svg {
      color: ${(props) => props.theme.palette.primary.main};
    }
    span.dot {
      width: 16px;
      height: 16px;
      border-radius: 8px;
      margin-right: 0.5rem;
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
    }
` */
export const DataGrid = styled.div`
  display: grid;
  grid-template-columns:
    minmax(50px, 100px) minmax(120px, auto) minmax(150px, auto)
    minmax(150px, auto) minmax(200px, max-content);

  div {
    &.cell {
      padding: 12px 16px;
      display: flex;
      align-items: center;
      cursor: pointer;
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      span.MuiBadge-root {
      span {
        position: relative;
        top: inherit;
        right: inherit;
        transform: translate(0, 0);
      }
    }
    p {
      user-select: none;
    }
    svg {
      color: ${(props) => props.theme.palette.primary.main};
    }
    span.dot {
      width: 16px;
      height: 16px;
      border-radius: 8px;
      margin-right: 0.5rem;
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
    }
    }
    

    &.header-column {
    
      cursor: default;
      border: 1px solid rgba(0, 0, 0, 0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgb(232, 240, 254);
      padding: 10px;
      position: sticky;
      top: 0;  //Don't forget this, required for the stickiness 

      p {
        font-weight: bold !important;
      }

      ${(props) => props.theme.breakpoints.down(md)} {
        position: sticky;
        top: 0px;
      }
    }
    &.loading {
      height: 400px;
    }
  } 
`;

export const MainColumn = styled.div`
  grid-column: 1 / -1;
`;
