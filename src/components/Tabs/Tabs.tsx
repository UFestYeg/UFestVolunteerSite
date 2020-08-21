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
} from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

interface TabsProps {
    tabValues: TabProps[];
}
export interface TabProps {
    label: string;
    target: string;
}

const useStyles = makeStyles((theme) =>
    createStyles({
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
        },
    })
);

const Tabs: React.FC<TabsProps> = ({ tabValues }: TabsProps) => {
    const mobile = !useMediaQuery("(min-width:450px)");
    const location = useLocation();
    const styles = useStyles();
    console.log("location", location.pathname);
    console.log("location", tabValues);
    const initialValue = tabValues
        .map((t) => t.target)
        .indexOf(location.pathname);
    const [value, setValue] = React.useState(initialValue);
    const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

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
                        activeClassName="active"
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
