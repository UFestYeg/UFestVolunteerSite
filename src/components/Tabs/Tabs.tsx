// tslint:disable: react-this-binding-issue
// tslint:disable: jsx-no-lambda
import {
    Button,
    Menu,
    MenuItem,
    Tab,
    Tabs as TabsContainer,
    Typography,
    useMediaQuery,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface TabsProps {
    tabValues: TabProps[];
}
export interface TabProps {
    label: string;
    target: string;
}

const useStyles = makeStyles()((theme) =>
    ({
        menu: {
            backgroundColor: theme.palette.secondary.light,
            textAlign: "center",
            width: "100%",
        },
        menuItem: {
            textAlign: "center",
            width: "100%",
        },
        popoverPaper: {
            marginLeft: 0,
            maxWidth: "unset",
            width: "100vw",
        },
        tab: {
            // The Tabs use the fullWidth variant so the three tabs share the
            // container evenly and fill it with no dead space at the ends.
            paddingLeft: "1%",
            paddingRight: "1%",
            // On narrower screens tighten the horizontal padding so the labels
            // keep room within each equal share without clipping (text size is
            // left untouched so the labels stay readable).
            [theme.breakpoints.down(768)]: {
                paddingLeft: theme.spacing(1.25),
                paddingRight: theme.spacing(1.25),
            },
        },
    })
);

const Tabs: React.FC<TabsProps> = ({ tabValues }: TabsProps) => {
    const mobile = !useMediaQuery("(min-width:450px)");
    const location = useLocation();
    const { classes: styles } = useStyles();

    const initialValue = tabValues
        .map((t) => t.target)
        .indexOf(location.pathname);

    const [value, setValue] = useState(initialValue);
    const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleClickListItem = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        index: number
    ) => {
        setValue(index);
        setAnchorEl(null);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    if (!mobile) {
        return (
            <TabsContainer
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
                sx={{ width: "100%" }}
            >
                {tabValues.map((tab, index) => (
                    <Tab
                        key={index}
                        label={tab.label}
                        component={NavLink}
                        to={tab.target}
                        className={styles.tab}
                    />
                ))}
            </TabsContainer>
        );
    } else {
        return (
            <div className={styles.menu}>
                <Button onClick={handleClickListItem}>
                    {value < 0 ? "select a sensor" : tabValues[value].label}
                </Button>
                <Menu
                    id="lock-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                        horizontal: "center",
                        vertical: "top",
                    }}
                    transformOrigin={{
                        horizontal: "center",
                        vertical: "top",
                    }}
                    PopoverClasses={{ paper: styles.popoverPaper }}
                    marginThreshold={0}
                >
                    {tabValues.map((tabValue, index) => (
                        <MenuItem
                            key={index}
                            selected={index === value}
                            onClick={(event: React.MouseEvent<HTMLElement>) =>
                                handleMenuItemClick(event, index)
                            }
                            component={NavLink}
                            to={tabValue.target}
                        >
                            <Typography variant="overline">
                                {tabValue.label}
                            </Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </div>
        );
    }
};

export default Tabs;
