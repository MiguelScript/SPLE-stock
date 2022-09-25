import React, { useState, useEffect } from 'react';
import { find, isEmpty } from "lodash";
import { withStyles, Typography, SvgIcon, useTheme } from "@material-ui/core";
import {
    useRouteMatch
} from "react-router-dom";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
//import MuiAccordion from '@material-ui/core/Accordion';
//import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import {
    Wrapper,
    SidebarContainer,
    StyledNavLinkChild,
    StyledLink,
    LogoutBtnContainer,
    CustomAccordion,
    CustomAccordionSummary

} from './Sidebar.style';

export default function SidebarAccordion ({ theme, page })  {

    const [isExpanded, setIsExpanded] = useState(false);
    const [isActive, setIsActive] = useState(false);
    let { path, url } = useRouteMatch();


    const handleClick = () => {
        setIsExpanded(!isExpanded)
    }
    const checkIsActive = (subRoutes) => {

        const isCurrentPath = subRoutes.find(subRoute => subRoute.path == path)
        console.log(subRoutes);
        console.log(isCurrentPath);
        if (isCurrentPath) {
            setIsActive(true)
            setIsExpanded(true)
        } else {
            setIsActive(false)

        }

    }



    useEffect(() => {
        checkIsActive(page.childs)

        /* if (isExpanded == false) {

        } */


    }, [])

    return (
        <CustomAccordion
            expanded={isExpanded}
            theme={theme}
            /* onClick={() => {
                console.log("alv");
            }} */
            onChange={handleClick}
        >
            <CustomAccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
                theme={theme}
                className={isActive ? "isActive" : ""}
            >
                <SvgIcon component={page.icon} className="mr-3"></SvgIcon>
                <Typography className="">{page.name}</Typography>
            </CustomAccordionSummary>
            {/*  <AccordionDetails> */}
            {page.childs.map((subRoute, index) => (
                <li key={index}>
                    <StyledNavLinkChild
                        to={subRoute.path}

                        exact={subRoute.exact}
                        activeClassName="selected"
                        theme={theme}
                    //isActive={checkIsActive(subRoute.path)}
                    >
                        <div>
                            <SvgIcon component={subRoute.icon} className="mr-3"></SvgIcon>
                            <Typography>{subRoute.name}</Typography>
                        </div>
                    </StyledNavLinkChild>
                </li>

            ))}
            {/* </AccordionDetails> */}
        </CustomAccordion>
    );
}

