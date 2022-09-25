import React from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import { SvgIcon, ButtonBase, useTheme, Button } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MoreIcon from "@material-ui/icons/MoreVert";
import Col from "react-bootstrap/Col";
import LogoWeb from "../../../assets/img/logoweb.png";
import NotificationsOutlinedIcon from "@material-ui/icons/NotificationsOutlined";
import { ReactComponent as BarsIcon } from "../../../assets/icons/bx-menu.svg";
import { ReactComponent as BackIcon } from "../../../assets/icons/bx-left-arrow-alt.svg";
import { ReactComponent as LogoutIcon } from "../../../assets/icons/bx-power-off.svg";
import { md } from "../../../theme/breakpoints";
import {
  MobileDrawerStateContext,
  MobileDrawerDispatchContext,
} from "../../../context/MobileDrawer/MobileDrawer";
import { StyledLink, SidebarContainer } from "../Sidebar/Sidebar.style";
import { pageRoutes } from "../Sidebar/Sidebar";
import { AuthDispatchContext, AuthStateContext } from "../../../context/Auth/Auth";
import { ReusableModalStateContext, ReusableModalDispatchContext } from "../../../context/ReusableModal/reusable-modal";
import { CustomModal } from "../../../components/Common/reusable-modal";
import SearchProductModal from "../Modal/SearchProductModal";
import SearchProductsGlobal from "../Modal/SearchProductsGlobal";

import { LogoutBtnContainer } from '../Sidebar/Sidebar.style';
//rgb(0, 185, 229)

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
    position: 'sticky',
    top: '0px',
    zIndex: 1000,
    marginLeft: '-15px',
    marginRight: '-15px'
  },
  appBar: {
    background: "#0d47a1",
    height: "70px",

    justifyContent: "center",
    padding: "0rem 2rem",
    [theme.breakpoints.down(`${md}`)]: {
      padding: "0rem",
    },
    boxShadow: "0px 0px 6px #523f697f;"
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  textUser: {
    color: 'white',
    display: 'flex',
    alignItems: 'center'
  }
}));

const StyledToolbar = styled(Toolbar)`
  button {
    &:focus {
      outline: none;
    }
  }
`;


const MenuIconContainer = styled.div`
  display: none;
  button {
    border-radius: 100%;
    padding: 0.25rem;
    svg {
      font-size: 2.5rem;
      color: #fff;
    }
  }
  ${(props) => props.theme.breakpoints.down(md)} {
    display: block;
  }
`;


const LogoContainer = styled.div`
  img {
    height: 65px;
    ${(props) => props.theme.breakpoints.down(md)} {
      height: 50px;
    }
  }
`;


const StyledIconButton = styled(IconButton)`
svg{
    color:#fff;
}
`;

const MenuDrawer = styled.div`
  box-shadow: 0px 0px 6px #523f697f;
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
  background: white;
  display: block;
  width: 80vw;
  min-height: 100vh;
  z-index: 1300;
  padding-top: 2rem;
  padding-right: 0rem;
  padding-left: 2.5rem;
  ${(props) =>
    props.isOpen
      ? `transform: translateX(0%);`
      : `transform: translateX(-110%); transition: all 0.3s ease-in;`}
  transition: all 0.3s ease-out;
`;
const MenuDrawerHeader = styled.div`
  text-align: end;
  padding-right: 1rem;
  button {
    border-radius:100%;
    padding:0.25rem;
    &:focus{
        outline:none;
    }
    svg {
        font-size: 2.25rem;
      }
  }
`;

const Backdrop = styled(MenuDrawer)`
  background: rgba(0, 0, 0, 0.25);
  display: block;
  width: 100vw;
  z-index: 1299;

  ${(props) => (props.isOpen ? `display:block; ` : `display:none;`)}
`;

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const theme = useTheme();
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const mobileDrawerDispatch = React.useContext(MobileDrawerDispatchContext);
  const mobileDrawerState = React.useContext(MobileDrawerStateContext);
  const authDispatch = React.useContext(AuthDispatchContext);
  const authState = React.useContext(AuthStateContext);
  const modalState = React.useContext(ReusableModalStateContext);
  const modalDispatch = React.useContext(ReusableModalDispatchContext);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const closeMenuDrawer = () => {
    mobileDrawerDispatch({ type: "CLOSEDRAWER" });
  }

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>{authState.context.userData.name + " " + authState.context.userData.last_name}</MenuItem>
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <Typography
        >Usuario
        </Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="sticky" className={classes.appBar}>
        <StyledToolbar>
          <MenuIconContainer
            theme={theme}
            onClick={() => {
              mobileDrawerDispatch({ type: "OPENDRAWER" });
            }}
          >
            <ButtonBase>
              <SvgIcon component={BarsIcon}></SvgIcon>
            </ButtonBase>
          </MenuIconContainer>

          <LogoContainer theme={theme}>
            {/* <img src={LogoWeb} alt="FarmaOnline" /> */}
            <Typography
              variant='h6'
              className={classes.textUser}
            >
              AdminStock
            </Typography>

          </LogoContainer>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                modalDispatch(
                  {
                    type: "OPENMODAL",
                    component: SearchProductsGlobal,
                    modalProps: {},
                    CustomModal,
                  }
                )
              }}
            >
              <SvgIcon component={SearchIcon} className="mr-3"></SvgIcon>
              Buscar Producto
            </Button>
            <Typography
              variant='h6'
              className={classes.textUser}
            >
              Hola, {authState.context.userData.name + " " + authState.context.userData.last_name}
            </Typography>
            {/* <StyledIconButton aria-label="show 17 new notifications" color="inherit" >
              <Badge badgeContent={17} color="error">
                <SvgIcon component={RingBellIcon}></SvgIcon>
              </Badge> 
            </StyledIconButton>*/}
            <StyledIconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </StyledIconButton>
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </StyledToolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
      <MenuDrawer isOpen={mobileDrawerState.context.isOpen}>
        <MenuDrawerHeader>
          <ButtonBase onClick={closeMenuDrawer}>
            <SvgIcon
              component={BackIcon}

            ></SvgIcon>
          </ButtonBase>
        </MenuDrawerHeader>
        <SidebarContainer className="mt-2 ">
          {pageRoutes.map((page, index) => (
            <li key={index}>
              <StyledLink
                to={page.path}
                key={index}
                exact={page.exact}
                activeClassName="selected"
                theme={theme}
                onClick={closeMenuDrawer}
              >
                <div>
                  <SvgIcon component={page.icon} className="mr-3"></SvgIcon>
                  <Typography>{page.name}</Typography>
                </div>
              </StyledLink>
            </li>
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
      </MenuDrawer>
      <Backdrop
        isOpen={mobileDrawerState.context.isOpen}
        onClick={closeMenuDrawer}
      ></Backdrop>
    </div>
  );
}
