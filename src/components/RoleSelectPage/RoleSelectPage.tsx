// tslint:disable: use-simple-attributes
import {
    Divider,
    FormControl,
    Grid,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Typography,
} from "@material-ui/core";
// tslint:disable-next-line: no-submodule-imports
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Link, useParams, useRouteMatch } from "react-router-dom";
import { volunteer as volunteerActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { PositionRequestPage } from "../PositionRequestPage";

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
            padding: theme.spacing(2),
            display: "flex",
            alignItems: "baseline",
            textAlign: "start",
            justifyContent: "space-between",
            width: "80vw",
            [theme.breakpoints.down("md")]: {
                flexDirection: "column",
            },
            [theme.breakpoints.up("md")]: {
                flexDirection: "row",
            },
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
        calendarContainer: {
            width: "-webkit-fill-available",
        },
    })
);

const RoleSelectPage: React.FC = () => {
    const theme = useTheme();
    const classes = useStyles(theme);
    const dispatch = useDispatch();
    const { url } = useRouteMatch();
    const { categoryTypeID } = useParams();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);
    const [view, setView] = React.useState("list");
    const volunteerCategories = StateHooks.useVolunteerCategories();
    const roles = volunteerCategories.map((category, idx, _arr) => {
        return category.roles;
    });

    const combinedRoles: any = {};
    roles.flat().forEach((role) => {
        if (role) {
            const titleLower = role.title.toLowerCase();
            if (titleLower in combinedRoles) {
                combinedRoles[titleLower].number_of_positions +=
                    role.number_of_positions;
                combinedRoles[titleLower].number_of_open_positions +=
                    role.number_of_open_positions;
            } else {
                // Deep copy of role object
                combinedRoles[titleLower] = JSON.parse(JSON.stringify(role));
            }
        }
    });

    useEffect(() => {
        dispatch(
            volunteerActions.getVolunteerCategoryOfType(
                categoryTypeID,
                cookies.csrftoken
            )
        );
    }, [cookies.csrftoken, dispatch, categoryTypeID]);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setView(event.target.value as string);
    };

    const ListItems = () => {
        const flatRoles = Object.values(combinedRoles);
        return flatRoles !== undefined && flatRoles.length > 0
            ? flatRoles.map((role: any, idx: number, _arr: any[]) => {
                  if (role) {
                      return (
                          <Link
                              to={`${url}/roles/${role.id}`}
                              key={idx}
                              className={classes.link}
                          >
                              <ListItem button className={classes.listContent}>
                                  <Grid
                                      container
                                      spacing={2}
                                      justify="space-between"
                                      alignItems="baseline"
                                  >
                                      <Grid item xs={12} md={3}>
                                          <ListItemText
                                              primary={"Title"}
                                              primaryTypographyProps={{
                                                  color: "textPrimary",
                                                  variant: "overline",
                                              }}
                                              secondary={role.title}
                                              secondaryTypographyProps={{
                                                  color: "textPrimary",
                                                  variant: "subtitle2",
                                              }}
                                          >
                                              <Typography color="textPrimary">
                                                  {role.title}
                                              </Typography>
                                          </ListItemText>
                                      </Grid>
                                      <Grid item xs={12} md={7}>
                                          <ListItemText
                                              primary={"Description"}
                                              primaryTypographyProps={{
                                                  color: "textPrimary",
                                                  variant: "overline",
                                              }}
                                              secondary={role.description}
                                              secondaryTypographyProps={{
                                                  color: "textPrimary",
                                                  variant: "subtitle2",
                                              }}
                                          />
                                      </Grid>
                                      <Grid
                                          item
                                          container
                                          xs={12}
                                          md={2}
                                          alignContent="center"
                                      >
                                          <ListItemText>
                                              <Typography
                                                  color="textPrimary"
                                                  variant="caption"
                                                  align="center"
                                              >
                                                  {`positions available: ${role.number_of_open_positions}/${role.number_of_positions}`}
                                              </Typography>
                                          </ListItemText>
                                      </Grid>
                                  </Grid>
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
                <FormControl fullWidth>
                    <InputLabel id="volunter-view-select-label">
                        View
                    </InputLabel>
                    <Select
                        labelId="volunter-view-select-label"
                        id="volunter-view-select"
                        value={view}
                        label="View"
                        onChange={handleChange}
                    >
                        <MenuItem value={"list"}>List View</MenuItem>
                        <MenuItem value={"calendar"}>Calendar View</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            {view === "calendar" ? (
                <Grid item className={classes.calendarContainer}>
                    <PositionRequestPage />
                </Grid>
            ) : (
                <Grid item>
                    <List className={classes.list}>{ListItems()}</List>
                </Grid>
            )}
        </Grid>
    );
};

export default RoleSelectPage;
