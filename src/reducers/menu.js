import { commonConstants } from "../constants/common";
import { menuActionTypes } from '../constants/actions/menu';

const initialState = {
    ...commonConstants.DEFAULT_MENU_POSITION
};

export default function(state = initialState, action) {
    switch(action.type) {
        case menuActionTypes.SET_ACTIVE_MENU_POSITION:
            return {
                ...state,
                activeMenu: action.data.activeMenu
            };
        default:
            return state;
    }
}