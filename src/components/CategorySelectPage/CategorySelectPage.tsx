// tslint:disable: use-simple-attributes
import {
    Card,
    CardContent,
    CardMedia,
    Grid,
    GridList,
    GridListTile,
    Typography,
    useMediaQuery,
} from "@material-ui/core";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
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
} from "@material-ui/icons";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Link, useRouteMatch } from "react-router-dom";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";

const useStyles = makeStyles((theme) =>
    createStyles({
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
            margin: 8,
            color: theme.palette.primary.dark,
            justifyContent: "center",
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
            height: "100%",
        },
        link: { textDecoration: "none" },
        media: {
            flexShrink: 0,
            width: "20%",
            height: "20%",
            marginLeft: "auto",
            marginRight: 8,
            padding: "2%",
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
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const { url } = useRouteMatch();
    const smallWidth = useMediaQuery(theme.breakpoints.down("xs"));
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
            <Link
                to={`${url}/${volunteerCategoryTypeMap[categoryType]}`}
                key={idx}
                className={classes.link}
            >
                <GridListTile cols={1}>
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
                </GridListTile>
            </Link>
        ));
    };

    return (
        <div className={classes.root}>
            <Grid
                container
                spacing={3}
                direction="column"
                justify="center"
                alignItems="center"
                className={classes.grid}
            >
                <Grid item>
                    <Typography variant="h2">Request to Volunteer</Typography>
                </Grid>
                <Grid item>
                    <GridList
                        cellHeight="auto"
                        className={classes.gridList}
                        cols={smallWidth ? 1 : 2}
                    >
                        {GridTiles()}
                    </GridList>
                </Grid>
            </Grid>
        </div>
    );
};

export default CategorySelectPage;
