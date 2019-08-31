import {CHANGE_LOGIN} from './constants'
const changeLogin = (value) => ({
    type: CHANGE_LOGIN,
    value,
});

export const getHeaderInfo = () => {
    return (dispatch, getState, axiosInstance) => {
        return axiosInstance.get("/api/isLogin.json?secret=PP87ANTIPIRATE")
            .then((resp) => {
                console.log("getHeaderInfo:", resp);
                dispatch(changeLogin(resp.data.data.login));
            })
    }
};

