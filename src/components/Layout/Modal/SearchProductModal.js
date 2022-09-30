import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import styled from "styled-components";
import {
    StoreStateContext,
    StoreDispatchContext,
} from "../../../context/store/store";
import { useTheme, Button, SvgIcon } from "@material-ui/core";
import { Row, Col, FormControl } from "react-bootstrap";
import { CloseModal } from "../../Common/modal.style";
import LoadingEllipsis from "../../Loading/loading-ellipsis";
import LoadingSpinner from "../../Loading/LoadingSpinner";
import { ReactComponent as CloseModalIcon } from "../../../assets/icons/bx-power-off.svg";
import { ReactComponent as SearchIcon } from "../../../assets/icons/bx-search.svg";
import { useMachine } from "@xstate/react";
import { searchProductsModal } from "../../../machines/searchProductsModal/searchProductsModal";
import { ProductsGrid, DataGridContainer, ProductsTable, DataGridHeader, ProductsTableBody } from "./SearchProductModel.styles";
import { SwicthContainer } from '../../NewInvoice/NewInvoice.styles';

import {
    Container,
    ModalHeading,
} from "../../Common/reusable-modal/reusable-modal.styles";
import InputSearchProducts from "../../Common/InputSearchProducts";

import isEmpty from 'lodash/isEmpty';
//import NumberFormat from 'react-number-format';
import { CURRENCY_DEFAULT } from "../../../config/constants";

const FormInput = styled(FormControl)`
  margin-top: 0.5rem;
`;
const SubmitBtn = styled(Button)`
  span {
    text-transform: initial;
  }
  &:focus {
    outline: none;
  }
`;

const ListItem = styled.div`
    display: flex;
    min-height: 50px;
    margin-top: 0.5rem;
`;

const Hijo = ({ currency, children, products }) => {
    //console.log(children);
    //hildren.props.currency = currency;
    return React.cloneElement(
        children,
        {
            currency: currency,
            products: products
        },
        null);
}

function SearchProductModal({
    closeModal,
    ElHijo,
    ...props

}) {

    const theme = useTheme();
    const SiteDataState = React.useContext(StoreStateContext);
    const [current, send] = useMachine(searchProductsModal);
    const [currency, setcurrency] = React.useState(CURRENCY_DEFAULT);
    const [toggled, setToggled] = React.useState(false);

    /* const handleSelectChange = (value) => {
        send({ type: "SEARCH", value });
        console.log(value);
    } */

    const handleToggle = (toggle) => {
        console.log(toggle);
        setToggled(toggle)
    }

    useEffect(() => {
        //console.log(children);
        if (toggled === true) {
            setcurrency(
                {
                    prefix: "Bs.S",
                    rate: SiteDataState.dollarRate.context.dollarRate.tasa,
                }
            )
        } else {
            setcurrency(
                CURRENCY_DEFAULT
            )
        }
    }, [toggled]);

    useEffect(() => {
        //console.log(children);
        console.log(props);
    }, []);

    return (
        <>
            <Container theme={theme}>
                <CloseModal theme={theme} onClick={closeModal}>
                    <SvgIcon component={CloseModalIcon}></SvgIcon>
                </CloseModal>
                <Row className="no-gutters">
                    <ModalHeading xl={12} theme={theme}>
                        <div className="icon-container">
                            <SvgIcon component={SearchIcon}></SvgIcon>
                        </div>
                        <div>
                            <Typography variant="h5" className="font-weight-bold">
                                Buscar producto
                            </Typography>

                        </div>
                    </ModalHeading>
                    <Col xl={6} className="mt-3 px-0">
                        <InputSearchProducts
                            sendParent={send}
                            preSearch={props.preSearch}
                        />
                    </Col>
                    <Col md={6}>
                        <SwicthContainer>
                            <Typography
                                variant="subtitle2"
                            >
                                Mostrar montos en Bs.S:<Switch
                                    color="primary"
                                    checked={toggled}
                                    onChange={e => handleToggle(e.target.checked)}
                                />
                            </Typography>

                        </SwicthContainer>
                    </Col>
                    <Col xl={12} className="mt-3 px-0 justify-content-center">
                        <DataGridContainer>
                            {current.matches("dataReady") ? (
                                !isEmpty(current.context.productos) ? (


                                    /* children &&
                                    React.createElement(children, {
                                        theme: theme,
                                        currency: currency,
                                        products: current.context.productos,
                                    }) */

                                    <>
                                        {/* <Hijo
                                        currency={currency}
                                        children={children}
                                        products={current.context.productos}
                                    /> */}

                                        
                                        <ElHijo
                                            currency={currency}
                                            products={current.context.productos}
                                            theme={theme}
                                            {...props}
                                        />
                                    </>

                                ) : (
                                    <div>no hay productos por este nombre</div>
                                )

                            ) : (
                                <div className="d-flex justify-content-center align-items-center h-100">
                                    {current.matches("searchingProductos") ? (
                                        <div>
                                            <LoadingSpinner />
                                        </div>
                                    ) : (
                                        <div>
                                            <Typography variant="h5">
                                                Escribe para buscar productos
                                        </Typography>
                                        </div>
                                    )}
                                </div>

                            )
                            }
                        </DataGridContainer>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default SearchProductModal;
