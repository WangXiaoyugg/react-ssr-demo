import {CHANGE_LIST} from './constants'

const changeList = (list) => ({
    type: CHANGE_LIST,
    list
});

export const getHomeList = (server) => {
    // http://47.95.113.63/ssr/api/news.json?secret=PP87ANTIPIRATE
    return (dispatch, getState, axiosInstance) => {
        return axiosInstance.get('/api/news.json?secret=PP87ANTIPIRATE')
            .then((res) => {
                const list = res.data.data;
                dispatch(changeList(list));
            });
    }
};
