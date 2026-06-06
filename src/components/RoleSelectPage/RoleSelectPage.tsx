// tslint:disable: use-simple-attributes
import {
    Box,
    Card,
    CardActionArea,
    Chip,
    Grid,
    LinearProgress,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ViewListIcon from "@mui/icons-material/ViewList";
// tslint:disable-next-line: no-submodule-imports
import { makeStyles } from "tss-react/mui";
import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { StateHooks } from "../../store/hooks";
import { Link, useLocation, useParams } from "react-router-dom";
import { volunteer as volunteerActions } from "../../store/actions";
import { PositionRequestPage } from "../PositionRequestPage";

const useStyles = makeStyles()((theme) =>
    ({
        grid: {
            overflow: "hidden",
            marginTop: theme.spacing(3),
            marginBottom: theme.spacing(5),
            paddingLeft: theme.spacing(3),
            paddingRight: theme.spacing(3),
        },
        heading: {
            textAlign: "center",
        },
        viewControl: {
            display: "flex",
            justifyContent: "center",
            marginTop: theme.spacing(2),
        },
        cardsContainer: {
            width: "min(100%, 1100px)",
            margin: "0 auto",
        },
        card: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            borderRadius: theme.spacing(2),
            border: `1px solid ${theme.palette.divider}`,
            boxShadow:
                "0 1px 2px rgba(16, 24, 40, 0.06), 0 1px 3px rgba(16, 24, 40, 0.10)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
                transform: "translateY(-4px)",
                boxShadow:
                    "0 12px 28px rgba(16, 24, 40, 0.12), 0 4px 8px rgba(16, 24, 40, 0.08)",
            },
        },
        cardActionArea: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            justifyContent: "flex-start",
            padding: theme.spacing(2.5),
        },
        cardTitle: {
            fontWeight: 700,
            color: theme.palette.primary.dark,
            marginBottom: theme.spacing(1),
        },
        cardDescription: {
            color: theme.palette.text.secondary,
            flexGrow: 1,
            marginBottom: theme.spacing(2),
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
        },
        cardFooter: {
            marginTop: "auto",
        },
        progress: {
            height: 6,
            borderRadius: 999,
            marginTop: theme.spacing(1),
            backgroundColor: theme.palette.action.hover,
        },
        availChip: {
            fontWeight: 600,
            fontSize: "0.72rem",
            letterSpacing: "0.02em",
            borderRadius: 999,
        },
        availOpen: {
            backgroundColor: "#e6f4ea",
            color: "#1e7e34",
        },
        availFull: {
            backgroundColor: theme.palette.action.hover,
            color: theme.palette.text.secondary,
        },
        link: { textDecoration: "none", display: "block", height: "100%" },
        calendarContainer: {
            width: "-webkit-fill-available",
        },
    })
);

const RoleSelectPage: React.FC = () => {
    const { classes } = useStyles();
    const dispatch = StateHooks.useAppDispatch();
    const { pathname: url } = useLocation();
    const { categoryTypeID: categoryTypeIDStr } = useParams<{
        categoryTypeID?: string;
    }>();
    const categoryTypeID = categoryTypeIDStr
        ? parseInt(categoryTypeIDStr, 10)
        : NaN;
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
        if (!isNaN(categoryTypeID)) {
            dispatch(
                volunteerActions.getVolunteerCategoryOfType(
                    categoryTypeID,
                    cookies.csrftoken
                )
            );
        }
    }, [cookies.csrftoken, dispatch, categoryTypeID]);

    const handleChange = (
        _event: React.MouseEvent<HTMLElement>,
        newView: string | null
    ) => {
        // Ignore deselecting the active button so a view is always selected.
        if (newView !== null) {
            setView(newView);
        }
    };

    const RoleCards = () => {
        const flatRoles = Object.values(combinedRoles);
        return flatRoles !== undefined && flatRoles.length > 0
            ? flatRoles.map((role: any, idx: number, _arr: any[]) => {
                  if (!role) {
                      return null;
                  }
                  const open = role.number_of_open_positions;
                  const total = role.number_of_positions;
                  const filled = Math.max(total - open, 0);
                  const fillPercent =
                      total > 0 ? (filled / total) * 100 : 100;
                  return (
                      <Grid item xs={12} sm={6} md={4} key={idx}>
                          <Link
                              to={`${url}/roles/${role.id}`}
                              className={classes.link}
                          >
                              <Card className={classes.card} elevation={0}>
                                  <CardActionArea
                                      className={classes.cardActionArea}
                                      component="div"
                                  >
                                      <Typography
                                          variant="h6"
                                          className={classes.cardTitle}
                                      >
                                          {role.title}
                                      </Typography>
                                      <Typography
                                          variant="body2"
                                          className={classes.cardDescription}
                                      >
                                          {role.description}
                                      </Typography>
                                      <Box className={classes.cardFooter}>
                                          <Box
                                              display="flex"
                                              justifyContent="space-between"
                                              alignItems="center"
                                          >
                                              <Chip
                                                  size="small"
                                                  label={
                                                      open > 0
                                                          ? `${open} of ${total} open`
                                                          : "Full"
                                                  }
                                                  className={`${
                                                      classes.availChip
                                                  } ${
                                                      open > 0
                                                          ? classes.availOpen
                                                          : classes.availFull
                                                  }`}
                                              />
                                          </Box>
                                          <LinearProgress
                                              variant="determinate"
                                              value={fillPercent}
                                              className={classes.progress}
                                              color={
                                                  open > 0
                                                      ? "primary"
                                                      : "inherit"
                                              }
                                          />
                                      </Box>
                                  </CardActionArea>
                              </Card>
                          </Link>
                      </Grid>
                  );
              })
            : null;
    };

    return (
        <Grid
            container
            spacing={3}
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={classes.grid}
        >
            <Grid item>
                <Typography variant="h2" className={classes.heading}>
                    Request to Volunteer
                </Typography>
                <Box className={classes.viewControl}>
                    <ToggleButtonGroup
                        value={view}
                        exclusive
                        onChange={handleChange}
                        aria-label="view"
                        color="primary"
                        size="small"
                    >
                        <ToggleButton value="list" aria-label="list view">
                            <ViewListIcon sx={{ mr: 1 }} />
                            List
                        </ToggleButton>
                        <ToggleButton
                            value="calendar"
                            aria-label="calendar view"
                        >
                            <CalendarMonthIcon sx={{ mr: 1 }} />
                            Calendar
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>
            </Grid>
            {view === "calendar" ? (
                <Grid item className={classes.calendarContainer}>
                    <PositionRequestPage />
                </Grid>
            ) : (
                <Grid item className={classes.cardsContainer}>
                    <Grid
                        container
                        spacing={3}
                        justifyContent="flex-start"
                        alignItems="stretch"
                    >
                        {RoleCards()}
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

export default RoleSelectPage;
