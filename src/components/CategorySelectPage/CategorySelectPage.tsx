// tslint:disable: use-simple-attributes
import {
    Card,
    CardContent,
    CardMedia,
    Grid,
    Typography,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import {
    AccessibilityNew,
    AttachMoney,
    Build,
    HeadsetMic,
    LocalBar,
    LocalCafe,
    People,
    PhotoCamera,
    Storefront,
    Traffic,
    Widgets,
} from "@mui/icons-material";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { StateHooks } from "../../store/hooks";
import { Link, useLocation } from "react-router-dom";
import { volunteer as volunteerActions } from "../../store/actions";

const useStyles = makeStyles()((theme) =>
    ({
        button: {
            background: theme.palette.secondary.main,
            border: 0,
            borderRadius: 8,
            color: "white",
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            "&:hover": {
                background: theme.palette.secondary.dark,
            },
        },
        card: {
            transition: "0.3s",
            boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            height: "100%",
            color: theme.palette.primary.dark,
            justifyContent: "center",
            "&:hover": {
                boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.35)",
                transform: "translateY(-4px)",
            },
        },
        cardContent: {
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
        },
        root: { overflow: "hidden" },
        grid: {
            overflow: "hidden",
            marginTop: theme.spacing(3),
        },
        gridList: {
            width: "100%",
        },
        link: { textDecoration: "none", display: "block", height: "100%" },
        media: {
            flexShrink: 0,
            width: theme.spacing(9),
            height: theme.spacing(9),
            marginLeft: theme.spacing(2),
            marginRight: theme.spacing(2),
            [theme.breakpoints.down("sm")]: {
                width: theme.spacing(7),
                height: theme.spacing(7),
            },
        },
    })
);

interface IIconMap {
    [key: string]: any;
}

const iconMap: IIconMap = {
    beer_gardens: LocalBar,
    cafe: LocalCafe,
    marketing: PhotoCamera,
    kids: Widgets,
    volunteers: People,
    site_and_traffic: Traffic,
    entertainment: HeadsetMic,
    finance: AttachMoney,
    workshops: Build,
    vendors: Storefront,
    other: AccessibilityNew,
};

const nameToIconMapKey = (name: string) => {
    const newName = name.toLowerCase().replace(/\s/g, "_");
    return newName in iconMap ? newName : "other";
};

const CategorySelectPage: React.FC = () => {
    const { classes } = useStyles();
    const dispatch = StateHooks.useAppDispatch();
    const { pathname: url } = useLocation();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const volunteerCategories = StateHooks.useVolunteerCategoryTypes();
    const volunteerCategoryTypeMap = volunteerCategories.reduce<any>(
        (acc, categoryType) => {
            acc[categoryType.tag] = categoryType.id;
            return acc;
        },
        {}
    );
    const volunteerCategoryTypes = Object.keys(volunteerCategoryTypeMap);

    useEffect(() => {
        dispatch(volunteerActions.getVolunteerCategoryTypes(cookies.csrftoken));
    }, [dispatch]);

    const GridTiles = () => {
        return volunteerCategoryTypes.map((categoryType, idx, _arr) => (
            <Grid item xs={12} sm={6} key={idx}>
                <Link
                    to={`${url}/${volunteerCategoryTypeMap[categoryType]}`}
                    className={classes.link}
                >
                    <Card className={classes.card}>
                        <CardMedia
                            className={classes.media}
                            component={iconMap[nameToIconMapKey(categoryType)]}
                        />
                        <CardContent className={classes.cardContent}>
                            <Typography color="textPrimary" variant="h3">
                                {categoryType}
                            </Typography>
                        </CardContent>
                    </Card>
                </Link>
            </Grid>
        ));
    };

    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={3}
                direction="column"
                justifyContent="center"
                alignItems="center"
                className={classes.grid}
            >
                <Grid item>
                    <Typography variant="h2">Request to Volunteer</Typography>
                </Grid>
                <Grid item xs={12} className={classes.gridList}>
                    <Grid
                        container
                        spacing={3}
                        justifyContent="center"
                        alignItems="stretch"
                    >
                        {GridTiles()}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default CategorySelectPage;
