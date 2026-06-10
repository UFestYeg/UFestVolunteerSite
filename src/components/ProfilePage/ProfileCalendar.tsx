import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { StateHooks } from "../../store/hooks";
import { user as userActions } from "../../store/actions";
import MySchedule from "../Calendar/MySchedule";
import { Loading } from "../Loading";

const ProfileCalendar: React.FC = () => {
    const dispatch = StateHooks.useAppDispatch();
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
