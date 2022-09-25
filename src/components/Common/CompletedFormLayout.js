import styled from 'styled-components';
import React from 'react';
import { Typography } from '@material-ui/core';

const Container = styled.div`
display:flex;
justify-content:center;
align-items:center;
flex-direction:column;
img{
    width:50%;
}
p{
    margin-top:1rem;
}
`;


const CompletedFormLayout = ({message}) => {
    return (
        <Container>
            <img src="/images/completed.png">
            </img>
            <Typography variant="h6">{message}</Typography>
        </Container>
    );
}

export default CompletedFormLayout;