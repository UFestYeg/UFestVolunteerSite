import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { user as userActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { MySchedule } from "../Calendar";

const ProfileCalendar: React.FC = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userActions.getUserProfile());
    }, [dispatch]);

    const userProfile = StateHooks.useUserProfile();
    return <MySchedule requests={userProfile.requests} />;
};

export default ProfileCalendar;
