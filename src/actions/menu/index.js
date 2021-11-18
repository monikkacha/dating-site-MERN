import { menuActionTypes } from '../../constants/actions/menu';

export function setActiveMenuPosition(activeMenu) {
    return function(dispatch) {
        dispatch({
            type: menuActionTypes.SET_ACTIVE_MENU_POSITION,
            data: {activeMenu: activeMenu}
        });
    }
}