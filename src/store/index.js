import {createStore, applyMiddleware} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension/developmentOnly';
import ReduxThunk from 'redux-thunk';
import rootReducer from '../reducers';

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(
        ReduxThunk
    ))
);

export default store;
