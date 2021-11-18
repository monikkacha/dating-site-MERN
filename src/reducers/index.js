import { combineReducers } from 'redux';

import session from './session';
import menu from './menu';
import users from './users';
import fakeUsers from './fakeUsers';
import workers from './workers';
import chat from './chat';

const reducers = combineReducers({
    session,
    menu,
    users,
    fakeUsers,
    workers,
    chat
});

export default reducers;
