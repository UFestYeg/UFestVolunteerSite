import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { user as userActions } from "../../store/actions";
import { StateHooks } from "../../store/hooks";
import { MySchedule } from "../Calendar";
import { Loading } from "../Loading";

const ProfileCalendar: React.FC = () => {
    const dispatch = useDispatch();
    const [cookies, _setCookie] = useCookies(["csrftoken"]);

    useEffect(() => {
        dispatch(userActions.getUserProfile(cookies.csrftoken));
    }, [dispatch]);

    const [userProfile, loading, _error] = StateHooks.useUserInfo();
    return (
        <>
            {loading ? (
                <Loading />
            ) : (
                <MySchedule requests={userProfile.requests} />
            )}
        </>
    );
};

export default ProfileCalendar;
