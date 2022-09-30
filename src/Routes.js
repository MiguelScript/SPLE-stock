import React, { lazy, Suspense, useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "./components/Layout/Layout";
import Login from "./pages/Auth/Login";
import LoadingSpinner from "./components/Loading/LoadingSpinner";
import { AuthStateContext } from "./context/Auth/Auth";
import { MobileDrawerContextProvider } from "./context/MobileDrawer/MobileDrawer";
import { ReusableDrawerContextProvider } from "./context/ReusableDrawer/reusable-drawer";
import ReusableDrawer from "./components/Common/reusable-drawer";
import {PAGO_MOVIL, CUSTOMERS} from "./config/constants";
import Invoice from "./components/Invoice/Invoice";
import ViewInvoice from "./pages/Facturacion/ViewInvoice";
import NuevaFactura from "./pages/Facturacion/NuevaFactura";
import NewBuy from "./pages/Buys/NewBuy";
import ViewBuy from "./pages/Buys/ViewBuy";
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Users = lazy(() => import("./pages/StaffMembers/StaffMembers"));
const Config = lazy(() => import("./pages/Settings/Settings"));
const Products = lazy(() => import("./pages/Stock/Products/Products"));
const Facturacion = lazy(() => import("./pages/Facturacion/Facturacion"));
const PaymentMethods = lazy(() =>
  import("./pages/PaymentsMethods/PaymentMethods")
);
const BankAccounts = lazy(() => import("./pages/BankAccounts/BankAccounts"));
const PagoMovilAccounts = lazy(() => import("./pages/PagoMovilAccounts/PagoMovilAccounts"));
const Customers = lazy(() => import("./pages/Customers/Customers"));
const Buys = lazy(() => import("./pages/Buys/Buys"));


function PrivateRoute({ component: Component, hasDrawer = false, ...rest }) {
  const authState = useContext(AuthStateContext);
  return (
    <Route
      {...rest}
      render={(props) =>
        !authState.matches("LoggedOut") ? (
          hasDrawer ? (
            <ReusableDrawerContextProvider>
              <MobileDrawerContextProvider>
                <AdminLayout>
                  <Component {...props} />
                </AdminLayout>
              </MobileDrawerContextProvider>
              <ReusableDrawer />
            </ReusableDrawerContextProvider>
          ) : (
            <MobileDrawerContextProvider>
              <AdminLayout>
                <Component {...props} />
              </AdminLayout>
            </MobileDrawerContextProvider>
          )
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        )
      }
    />
  );
}
const Routes = () => {
  return (
    <Suspense
      fallback={
        <div className={`col-md-12 d-flex justify-content-center`}>
          {" "}
          <LoadingSpinner />
        </div>
      }
    >
      <Switch>
        <PrivateRoute exact path="/" component={Dashboard} />
        <PrivateRoute
          exact
          path="/settings/admin-usuarios"
          component={Users}
          hasDrawer={true}
        />
        <PrivateRoute exact path="/facturacion" component={Facturacion} hasDrawer={true}/>
        <PrivateRoute exact path="/facturacion/nuevo" component={NuevaFactura} hasDrawer={true}/>
        <PrivateRoute exact path="/facturacion/:id" component={ViewInvoice} hasDrawer={true}/>
        <PrivateRoute exact path="/inventario" component={Products} hasDrawer={true} />
        <PrivateRoute exact path="/compras" component={Buys} hasDrawer={true} />
        <PrivateRoute exact path="/compras/nuevo" component={NewBuy} hasDrawer={true}/>
        <PrivateRoute exact path="/compras/:id" component={ViewBuy} hasDrawer={true}/>
        <PrivateRoute exact path="/settings" component={Config} hasDrawer={true} />
        <PrivateRoute
          exact
          path="/settings/metodos-pago"
          component={PaymentMethods}
        />
        <PrivateRoute
          exact
          path="/settings/metodos-pago/transferencias-bancarias"
          component={BankAccounts}
          hasDrawer={true}
        />
        <PrivateRoute
          exact
          path={PAGO_MOVIL}
          component={PagoMovilAccounts}
          hasDrawer={true}
        />
        <PrivateRoute
          exact
          path={CUSTOMERS}
          component={Customers}
          hasDrawer={true}
        />
        <Route exact path="/login">
          <Login />
        </Route>
      </Switch>
    </Suspense>
  );
};

export default Routes;
