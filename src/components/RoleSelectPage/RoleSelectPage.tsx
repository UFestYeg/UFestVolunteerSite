// tslint:disable: use-simple-attributes
import {
    Divider,
    Grid,
    List,
    ListItem,
    ListItemText,
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
import clsx from "clsx";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams, useRouteMatch } from "react-router-dom";
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
        list: {
            transition: "0.3s",
            boxShadow: "0px 14px 80px rgba(34, 35, 58, 0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            margin: 8,
            color: theme.palette.primary.dark,
            justifyContent: "center",
            width: "80vw",
        },
        listContent: {
            padding: theme.spacing(1),
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            width: "80vw",
        },
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

const RoleSelectPage: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const { url } = useRouteMatch();
    const { categoryTypeID } = useParams();
    const volunteerCategories = StateHooks.useVolunteerCategoriesOfType();
    const roles = volunteerCategories.map((category, idx, _arr) => {
        return category.roles;
    });
    const combinedRoles: any = {};
    roles.flat().forEach((role) => {
        if (role) {
            if (role.title in combinedRoles) {
                combinedRoles[role.title].number_of_positions +=
                    role.number_of_positions;
            } else {
                combinedRoles[role.title] = role;
            }
        }
    });
    console.log("categoryTypeID");
    console.log(categoryTypeID);
    useEffect(() => {
        dispatch(volunteerActions.getVolunteerCategoryOfType(categoryTypeID));
    }, [dispatch, categoryTypeID]);

    const ListItems = () => {
        console.log(roles);
        console.log(volunteerCategories);
        const flatRoles = Object.values(combinedRoles);
        return flatRoles !== undefined && flatRoles.length > 0
            ? flatRoles.map((role: any, idx: number, _arr: any[]) => {
                  console.log(role);
                  console.log("above");
                  if (role) {
                      return (
                          <Link
                              to={`${url}/roles/${role.id}`}
                              key={idx}
                              className={classes.link}
                          >
                              <ListItem button className={classes.listContent}>
                                  <ListItemText>
                                      <Typography color="textPrimary">
                                          {role.title}
                                      </Typography>
                                  </ListItemText>
                                  <ListItemText>
                                      <Typography color="textPrimary">
                                          positions available:{" "}
                                          {role.number_of_positions}
                                      </Typography>
                                  </ListItemText>
                              </ListItem>
                              <Divider />
                          </Link>
                      );
                  }
              })
            : null;
    };

    return (
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
                <List className={classes.list}>{ListItems()}</List>
            </Grid>
        </Grid>
    );
};

export default RoleSelectPage;
