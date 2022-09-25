import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import {SvgIcon,useTheme} from '@material-ui/core';
const useStyles = makeStyles({
    root: {
        minWidth: 275,
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
    icon: {
        fontSize: '3rem',
    }
});

const StyledCardContent = styled(CardContent)`
display:flex;
flex-direction:column;
align-items:center;
justify-content:center;
background-color:white;
svg{
    font-size:3rem;
    color:${props=>props.theme.palette.primary.light};
}
p{
    color:${props=>props.theme.palette.primary.light};
}

&:hover{
    background-color:${props=>props.theme.palette.primary.light};
    transition: all 0.5s ease-out;
    svg{
        font-size:3rem;
        color:white;
    }
    p{
        color:white;
    }
}

`;

export default function SettingsCard({icon,title}) {
    const classes = useStyles();
    const theme=useTheme();
    return (
        <Card className={classes.root} variant="outlined">
            <StyledCardContent theme={theme}>
            <SvgIcon component={icon}></SvgIcon>
            <Typography>
                        {title}
                    </Typography>

            </StyledCardContent>
        </Card>
    );
}