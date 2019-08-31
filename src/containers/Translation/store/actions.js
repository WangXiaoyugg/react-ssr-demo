import {CHANGE_LIST} from './constants'

const changeList = (list) => ({
    type: CHANGE_LIST,
    list,
});

export const getTranslationList = () => {
    return (dispatch, getState, axiosInstance) => {
        return axiosInstance.get('/api/translations.json')
            .then(resp => {
                if(resp.data.success) {
                    const list = resp.data.data;
                    dispatch(changeList(list))
                } else {
                    const list = resp.data.data;
                    dispatch(changeList(list))
                }
            })
    }
};
