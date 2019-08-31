import axios from 'axios'
import {CHANGE_LIST} from './constants'
import clientAxios from '../../../client/request'
import serverAxios from '../../../server/request';

const changeList = (list) => ({
    type: CHANGE_LIST,
    list
});
export const getHomeList = (server) => {
    // http://47.95.113.63/ssr/api/news.json?secret=PP87ANTIPIRATE
    let request = server ? serverAxios : clientAxios;
    return (dispatch) => {
        return request.get('/api/news.json?secret=PP87ANTIPIRATE')
            .then((res) => {
                const list = res.data.data;
                dispatch(changeList(list));
            });
    }
};
