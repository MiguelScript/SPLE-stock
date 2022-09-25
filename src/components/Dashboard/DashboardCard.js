import React from 'react';
import { Typography, SvgIcon, useTheme } from "@material-ui/core";
import Skeleton from "react-loading-skeleton";
import { Card, CardHeader, CardContent } from './Dashboard.styles';


const DashboardCard = ({ title, content, icon,  noContentMessage, statsCurrent }) => {

    const theme = useTheme();

    return (
        <Card>
            <CardHeader theme={theme}>
                <div className="card-title">
                    <Typography className="title" variant="h6">
                        {title}
                    </Typography>
                    <Typography variant="subtitle2">
                        (Junio)
                    </Typography>
                </div>
                <div className="card-icon card-icon-1">
                    <SvgIcon component={icon}></SvgIcon>
                </div>
            </CardHeader>
            <CardContent>
                {!statsCurrent.matches("fetchingStats") ? (
                    <Typography
                        className="font-weight-bold"
                        variant={(content) ? ("h4") : ("subtitle2")}
                    >
                        {(content) ? (content) : (noContentMessage)}
                    </Typography>
                ) : (
                    <Skeleton height={35} width={100} count={1}></Skeleton>
                )}
            </CardContent>
        </Card>
    );
}

export default DashboardCard;