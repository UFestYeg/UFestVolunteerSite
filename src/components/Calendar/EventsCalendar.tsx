// tslint:disable: jsx-no-lambda
// tslint:disable: react-this-binding-issue
// tslint:disable: use-simple-attributes
import { Container, Zoom } from "@material-ui/core";
import React, { useState } from "react";
import { StateHooks } from "../../store/hooks";
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
    category: string;
};

const EventsCalendar: React.FC = () => {
    const [defaultDate, setDefaultDate] = useState<Date>(new Date(2021, 4, 22));

    const [categoryView, setCategoryView] = useState<boolean>(false);

    const volunteerCategories = StateHooks.useVolunteerCategoryTypes();
    const volunteerCategoryTypeTags = volunteerCategories.map(
        (categoryType) => {
            return categoryType.tag;
        }
    );

    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        volunteerCategoryTypeTags
    );

    return (
        <Container maxWidth="lg">
            {categoryView ? (
                <Zoom
                    in={categoryView}
                    style={{ transitionDelay: categoryView ? "500ms" : "0ms" }}
                >
                    <EventsCategoryView
                        setCategoryView={setCategoryView}
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        defaultDate={defaultDate}
                        setDefaultDate={setDefaultDate}
                    />
                </Zoom>
            ) : (
                <EventsDetailView
                    setCategoryView={setCategoryView}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    defaultDate={defaultDate}
                    setDefaultDate={setDefaultDate}
                />
            )}
        </Container>
    );
};

export default EventsCalendar;
