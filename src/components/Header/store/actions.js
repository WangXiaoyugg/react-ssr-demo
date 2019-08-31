import {CHANGE_LOGIN} from './constants'
const changeLogin = (value) => ({
    type: CHANGE_LOGIN,
    value,
});

export const getHeaderInfo = () => {
    return (dispatch, getState, axiosInstance) => {
        return axiosInstance.get("/api/isLogin.json?secret=PP87ANTIPIRATE")
            .then((resp) => {
                dispatch(changeLogin(resp.data.data.login));
            })
    }
};
export const login = () => {
    return (dispatch, getState, axiosInstance) => {
        return axiosInstance.get('/api/login.json?secret=PP87ANTIPIRATE')
            .then(resp => {
                dispatch(changeLogin(true))
            })
    }
};
export const logout = () => {
    return (dispatch, getState, axiosInstance) => {
        return axiosInstance.get('/api/logout.json?secret=PP87ANTIPIRATE')
            .then(resp => {
                dispatch(changeLogin(false))
            })
    }
};

