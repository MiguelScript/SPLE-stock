import React, { useCallback, useContext } from 'react';
import Drawer from '@material-ui/core/Drawer';
import DrawerContext from '../../context/Drawer/DrawerContext';


/** Drawer Components */
/* import ProductForm from '../ProductForm/ProductForm';
import ProductUpdateForm from '../ProductForm/ProductUpdateForm';
import CategoryForm from '../CategoryForm/CategoryForm'; */
import { makeStyles } from '@material-ui/core/styles';
import StaffMemberForm from '../../pages/StaffMemberForm/StaffMemberForm';
import StaffMemberFormUpdate from '../../pages/StaffMemberForm/StaffMemberFormUpdate';
import ProductForm from '../ProductForm/ProductForm';
import BankForm from '../BankForm/BankForm';
import BankFormUpdate from '../BankForm/BankFormUpdate';



/** Components Name Constants */
const DRAWER_COMPONENTS = {
  PRODUCT_FORM: ProductForm,
  /*
  PRODUCT_UPDATE_FORM: ProductUpdateForm,
 */
  STAFF_MEMBER_FORM: StaffMemberForm,
  STAFF_MEMBER_FORM_UPDATE: StaffMemberFormUpdate,

  BANK_FORM: BankForm,
  BANK_FORM_UPDATE: BankFormUpdate,
  /* SIDEBAR: Sidebar, */
};

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  paper: {
    backgroundColor: '#f2f3f8',
  },
});

export default function DrawerItems() {
  const classes = useStyles();
  const [drawerState, drawerDispatch] = useContext(DrawerContext);

  const closeDrawer = useCallback(() => drawerDispatch({ type: 'CLOSE_DRAWER' }), [
    drawerDispatch,
  ]);

  if (!drawerState.drawerComponent) {
    console.log(drawerState);
    return null;
  } else {
    console.log(drawerState);
  }
  const SpecificContent = DRAWER_COMPONENTS[drawerState.drawerComponent];

  return (

    <div>
      <React.Fragment key='right'>
        <Drawer anchor='right' open={drawerState.isOpen} onClose={closeDrawer} classes={{ paper: classes.paper }} >
          <SpecificContent/>
        </Drawer>
      </React.Fragment>
    </div>
  );
}