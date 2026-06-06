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
            width: "100vw",
        },
        menuItem: {
            textAlign: "center",
            width: "100vw",
        },
        popoverPaper: {
            marginLeft: 0,
            maxWidth: "unset",
            width: "100vw",
        },
        tab: {
            paddingLeft: "1%",
            paddingRight: "1%",
            // Below the width where full-size tabs fit, let the tabs size to
            // their text (no forced min-width) with slightly tighter padding,
            // so every label stays fully visible without clipping or scroll
            // buttons while keeping the text comfortably readable.
            [theme.breakpoints.down(768)]: {
                minWidth: 0,
                paddingLeft: theme.spacing(1.25),
                paddingRight: theme.spacing(1.25),
                fontSize: "0.875rem",
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
                centered
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
