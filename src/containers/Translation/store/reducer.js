import {CHANGE_LIST} from "./constants";

const defaultState = {
    translationList: [],
};

export default (state = defaultState, actions) => {
    switch (actions.type) {
        case CHANGE_LIST:
            return {
                ...state,
                translationList: actions.list
            };
        default:
            return state;
    }
}
