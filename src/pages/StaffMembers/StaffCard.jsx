import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Button from "@material-ui/core/Button";
import CardActions from "@material-ui/core/CardActions";
//card options
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { ReusableDrawerDispatchContext } from "../../context/ReusableDrawer/reusable-drawer";
import StaffMemberFormUpdate from "../../components/StaffMemberForm/StaffMemberFormUpdate";
const UserImageContainer = styled.div`
  padding: 0.5rem 0;
  height: 7rem;
  text-align: center;
`;
const UserImage = styled.img`
  position: relative;
  height: 100%;
  width: 7rem;
  border-radius: 50%;
  padding: 0.25rem;
  border: 1px solid #dee2e6;
`;

const useStyles = makeStyles((theme) => ({
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  center: {
    textAlign: "center",
  },
  email: {
    textAlign: "center",
    wordBreak: "break-all"
  },
  flex: {
    display: "flex",
    justifyContent: "center",
  },
  flexCardContent: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  btnCard: {
    position: "absolute",
    right: "10px",
  },
  btnEliminar: {
    color: theme.palette.error.main,
    /* "&:hover": {
      color: "white",
      backgroundColor: theme.palette.error.light,
    }, */
  },
}));

export default function UserCard({ currentParent, sendParent, user }) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  // eslint-disable-next-line

  const reusableDrawerDispatch = React.useContext(
    ReusableDrawerDispatchContext
  );

  const handleMoreMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    reusableDrawerDispatch({
      type: "OPENDRAWER",
      drawerProps: {
        user,
        layout: {
          title: "Editar usuario"
        },
        goToDatatable: () => {
          sendParent({ type: "GOTODATATABLE" });
        }

      },
      component: StaffMemberFormUpdate,
    });
  };

  return (
    <Card className={`${classes.card}`}>
      <CardContent>
        <IconButton
          aria-label="settings"
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={handleMoreMenuClick}
          className={classes.btnCard}
        >
          <MoreVertIcon />
        </IconButton>
        <UserImageContainer>
          <UserImage
            src={`${process.env.REACT_APP_BACKEND_URL_IMG}/usuarios/${user.imagen}`}
            alt="Imagen"
          />
        </UserImageContainer>
        <Typography variant="h6" className={classes.center}>
          {`${user.name} ${user.last_name}`}
        </Typography>
        <div className={classes.flexCardContent}>
          <Typography className={classes.center} color="textSecondary">
            {user.rol} |
          </Typography>
          <Typography
            variant="subtitle2"
            className={classes.email}
            color="textSecondary">
            {user.email}
          </Typography>
        </div>
      </CardContent>
      <CardActions className={"justify-content-center"}>
        <Button size="small" color="primary" onClick={handleEdit}>
          Editar
        </Button>
        <Button
          size="small"
          /* className={`${classes.btnEliminar}`} */
          onClick={() => {
            {
              if (currentParent.context.searchByActive) {
                sendParent({
                  type: "DELETEUSER",
                  data: user,
                });
              } else {
                sendParent({
                  type: "ENABLEUSER",
                  data: user,
                });
              }
            }
          }}
        >
          {currentParent.context.searchByActive ? " Deshabilitar" : "Habilitar"}
        </Button>
      </CardActions>
    </Card>
  );
}
