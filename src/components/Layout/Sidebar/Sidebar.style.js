import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { md } from '../../../theme/breakpoints';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';


/* const Accordion = withStyles({
  root: {
    boxShadow: 'none',
    '&:before': {
      display: 'none',
    },
  },

})(MuiAccordion); */

export const CustomAccordion = styled(Accordion)`

  box-shadow: none;
  &::before {
      display: none; 
    }
`;

export const CustomAccordionSummary = styled(AccordionSummary)`

  padding-left:20px;
  height: 60px;
  svg {
    color: ${(props) => props.theme.palette.primary.main};
  }

  //border-left: ${props => props.isActive ? "solid 5px " : 'none'};
  &.isActive {
    border-left: solid 5px ${(props) => props.theme.palette.primary.light}
  }
 
`;

export const Wrapper = styled.div`

  background-color: #fff;
  min-width: 100%;
  min-height:calc(100vh - 70px);
  padding-top: 2rem;
  padding-right: 0rem;
  //padding-left: 2.5rem;
  display: flex;
  flex-direction: column;
  ${(props) => props.theme.breakpoints.down(md)} {
   display:none;
  }

`;
export const SidebarContainer = styled.ul`
  
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
`;



export const StyledLink = styled(NavLink)`
  height: 60px;
  margin-bottom: 1rem;
  padding-left:20px;
  display: flex;
  justify-content: start;
  align-items: center;
  &:hover {
    text-decoration: none;
  }
  div {
    display: flex;
    align-items: center;
    min-width: 150px;

    p {
      // color: #fff;
    }
  }
  svg {
    color: ${(props) => props.theme.palette.primary.main};
  }
  &.selected {
    /* &::before {
      content: '';
      height: 100%;
      width:10px;
      background-color: ${(props) => props.theme.palette.primary.light};
      
    } */ 

    padding-left:15px;
    background-color: rgba(243,244,246,.9); 
    //background-color: rgba(255,111,0,.8); 
    //background-color: #f2f5f8; 
    border-left: solid 5px ${(props) => props.theme.palette.primary.light}
    //background-color: ${(props) => props.theme.palette.primary.light};
    /* div {
      p {
        color: #fff;
      }
    }
    svg {
      color: #fff;
    } */
  }
`;

export const StyledNavLinkChild = styled(StyledLink)`

  padding-left:35px;

  &.selected {
    padding-left:30px;
  }
`;

export const LogoutBtnContainer = styled.div`
  height: 60px;
  margin-bottom: 1rem;
  border-radius: 30px 0px 0px 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    text-decoration: none;
  }
  div {
    display: flex;
    align-items: center;
    min-width: 150px;
    p {
      // color: #fff;
    }
  }
  svg {
    color: ${(props) => props.theme.palette.primary.main};
  }
  &.selected {
    background-color: ${(props) => props.theme.palette.primary.light};
    div {
      p {
        color: #fff;
      }
    }
    svg {
      color: #fff;
    }
  }
`;