// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes
import { Container } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StateHooks } from "../../store/hooks";
import { compareArrays } from "../../utils";
import EventsCategoryView from "./EventsCategoryView";
import EventsDetailView from "./EventsDetailView";

export type VolunteerCategoryType = {
    id: number;
    title: string;
    start_time: string | Date;
    end_time: string | Date;
    allDay?: boolean;
    resource?: any;
    description?: string;
    roles?: any;
    number_of_positions: number | null;
    number_of_open_positions: number | null;
    category: string;
};

interface ILocationState {
    oldCategoryView: boolean | undefined;
    oldSelectedCategories: string[] | undefined;
    oldDefaultDate: Date | undefined;
}

const EventsCalendar: React.FC = () => {
    const { state } = useLocation<ILocationState>();

    const defaultIsCategoryView =
        state && state.oldCategoryView !== undefined
            ? state.oldCategoryView
            : false;

    const [categoryView, setCategoryView] = useState<boolean>(
        defaultIsCategoryView
    );

    const defaultDefaultDate =
        state && state.oldDefaultDate !== undefined
            ? state.oldDefaultDate
            : new Date(2021, 4, 22);
    const [defaultDate, setDefaultDate] = useState<Date>(defaultDefaultDate);

    const volunteerCategories = StateHooks.useVolunteerCategoryTypes();
    const volunteerCategoryTypeTags = volunteerCategories.map(
        (categoryType) => {
            return categoryType.tag;
        }
    );

    const defaultSelectedCategories =
        state && state.oldSelectedCategories !== undefined
            ? state.oldSelectedCategories
            : volunteerCategoryTypeTags;
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        defaultSelectedCategories
    );

    const defaultSelectAll = compareArrays(
        selectedCategories,
        volunteerCategoryTypeTags
    );
    const [selectAll, setSelectAll] = useState<boolean>(defaultSelectAll);

    useEffect(() => {
        if (compareArrays(selectedCategories, volunteerCategoryTypeTags)) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedCategories, volunteerCategoryTypeTags]);

    return (
        <Container maxWidth="lg">
            {categoryView ? (
                <EventsCategoryView
                    setCategoryView={setCategoryView}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    defaultDate={defaultDate}
                    setDefaultDate={setDefaultDate}
                    selectAll={selectAll}
                    setSelectAll={setSelectAll}
                />
            ) : (
                <EventsDetailView
                    setCategoryView={setCategoryView}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    defaultDate={defaultDate}
                    setDefaultDate={setDefaultDate}
                    selectAll={selectAll}
                    setSelectAll={setSelectAll}
                />
            )}
        </Container>
    );
};

export default EventsCalendar;
