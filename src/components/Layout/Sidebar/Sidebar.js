import React from "react";
import { withStyles, Typography, SvgIcon, useTheme } from "@material-ui/core";
import {
  DASHBOARD,
  SETTINGS,
  FACTURACION,
  STOCK,
  CUSTOMERS,
  PRODUCTS,
  PRODUCTS_OUT_OF_STOCK,
  COMPRAS
} from "../../../config/constants";
import {
  useRouteMatch
} from "react-router-dom";
import { ReactComponent as DashboardIcon } from "../../../assets/icons/bx-category.svg";
import { ReactComponent as LogoutIcon } from "../../../assets/icons/bx-power-off.svg";
import { ReactComponent as PackageIcon } from "../../../assets/icons/bx-package.svg";
import { ReactComponent as ClientIcon } from "../../../assets/icons/bx-user-circle.svg";
import { ReactComponent as ProductsIcon } from "../../../assets/icons/bx-store.svg";
import { ReactComponent as SettingsIcon } from "../../../assets/icons/bx-wrench.svg";
import { AuthDispatchContext } from "../../../context/Auth/Auth";
import {
  Wrapper,
  SidebarContainer,
  StyledNavLinkChild,
  StyledLink,
  LogoutBtnContainer,
  CustomAccordion,
  CustomAccordionSummary

} from './Sidebar.style';
import { isEmpty } from "lodash";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import MuiAccordion from '@material-ui/core/Accordion';
//import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import SidebarAccordion from './SidebarAccordion'


export const pageRoutes = [
  {
    name: "Dashboard",
    path: DASHBOARD,
    exact: true,
    icon: DashboardIcon,
  },
  {
    name: "Ventas",
    path: FACTURACION,
    exact: true,
    icon: PackageIcon,
  },
  {
    name: "Compras",
    path: COMPRAS,
    exact: true,
    icon: PackageIcon,
  },
  {
    name: "Clientes",
    path: CUSTOMERS,
    exact: true,
    icon: ClientIcon,
  },
  {
    name: "Inventario",
    path: STOCK,
    exact: true,
    icon: ProductsIcon,
  },
  {
    name: "Ajustes",
    path: SETTINGS,
    exact: false,
    icon: SettingsIcon,
  },
];

export default function Sidebar() {
  //let { path, url } = useRouteMatch();
  const authDispatch = React.useContext(AuthDispatchContext);
  const theme = useTheme();
  return (
    <Wrapper theme={theme}>
      <SidebarContainer>
        {pageRoutes.map((page, index) => (
          page.childs == null ? (
            <li key={index}>
              <StyledLink
                to={page.path}

                exact={page.exact}
                activeClassName="selected"
                theme={theme}
              >
                <div>
                  <SvgIcon component={page.icon} className="mr-3"></SvgIcon>
                  <Typography>{page.name}</Typography>
                </div>
              </StyledLink>
            </li>
          ) :
            (
              <SidebarAccordion
                key={index}
                page={page}
                theme={theme}
              />
            )

        ))}
      </SidebarContainer>
      <LogoutBtnContainer
        theme={theme}
        onClick={() => {
          authDispatch({ type: "LOGOUT" });
        }}
      >
        <div>
          <SvgIcon component={LogoutIcon} className="mr-3"></SvgIcon>{" "}
          <Typography>Salir</Typography>
        </div>
      </LogoutBtnContainer>
    </Wrapper>
  );
}
