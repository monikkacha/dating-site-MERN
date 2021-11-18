import { fakeUsersActionTypes } from '../constants/actions/fakeUsers';
import { sessionActionTypes } from '../constants/actions/session';

const initialCurrentUser = {
    id: "",
    name: "",
    lastName: "",
    about: "",
    age: 18,
    height: 0,
    work: "",
    education: "",
    zodiacSign: "",
    interestedIn: [],
    familyPlans: "",
    politics: "",
    religion: "",
    gender: "male",
    tags: [],
    tvShows: [],
    movies: [],
    music: [],
    books: [],
    sportsTeams: [],
    photos: []
};

const initialState = {
    fakeUsers: [],
    currentUser: {
        ...initialCurrentUser
    },
    workerId: 0,
    loading: false,
    _isSaved: false,
    error: {
        visible: false,
        header: '',
        messages: []
    }
};

export default function users(state = initialState, action) {
    switch (action.type) {
        case sessionActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                error: {
                    visible: false,
                    header: '',
                    messages: []
                }
            };
        case fakeUsersActionTypes.CLEAR_USER:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser
                },
                loading: false
            };
        case fakeUsersActionTypes.GET_FAKE_USERS_LIST_REQUEST:
            return {
                ...state,
                loading: true
            };
        case fakeUsersActionTypes.GET_FAKE_USERS_LIST_FAILURE:
            return {
                ...state,
                error: {
                    ...state.error,
                    header: action.data.header && action.data.header !== '' ? action.data.header : '',
                    messages: action.data.errors && action.data.errors.length > 0 ? action.data.errors : [],
                    visible: true
                },
                loading: false
            };
        case fakeUsersActionTypes.GET_FAKE_USERS_LIST_SUCCESS:
            if (!action.data instanceof Array) {
                return state;
            }

            if (action.data.length === 0) {
                return state;
            }

            return {
                ...state,
                fakeUsers: action.data.fakeUsers,
                error: {
                    ...state.error,
                    visible: false
                },
                loading: false
            };

        case fakeUsersActionTypes.GET_FAKE_USER_PRESETS_REQUEST:
            return {
                ...state,
                loading: true
            };
        case fakeUsersActionTypes.GET_FAKE_USER_PRESETS_SUCCESS:
            return {
                ...state,
                presets: action.data,
                loading: false
            };

        case fakeUsersActionTypes.GET_FAKE_USER_PRESETS_FAILURE:
            return {
                ...state,
                error: {
                    ...state.error,
                    header: action.data.header && action.data.header !== '' ? action.data.header : '',
                    messages: action.data.errors && action.data.errors.length > 0 ? action.data.errors : [],
                    visible: true
                },
                loading: false
            };

        case fakeUsersActionTypes.CREATE_FAKE_USER_REQUEST:
            return {
                ...state,
                loading: true
            };

        case fakeUsersActionTypes.CREATE_FAKE_USER_SUCCESS:

            return {
                ...state,
                currentUser: {
                    ...initialCurrentUser
                },
                error: {
                    ...state.error,
                    visible: false
                },
                loading: false,
                _isSaved: true
            };
        case fakeUsersActionTypes.CREATE_FAKE_USER_FAILURE:
            return {
                ...state,
                error: {
                    ...state.error,
                    header: action.data.header && action.data.header !== '' ? action.data.header : '',
                    messages: action.data.errors && action.data.errors.length > 0 ? action.data.errors : [],
                    visible: true
                },
                loading: false
            };

        case fakeUsersActionTypes.GET_FAKE_USER_REQUEST:
            return {
                ...state,
                loading: true
            };

        case fakeUsersActionTypes.GET_FAKE_USER_SUCCESS:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    ...action.data.user
                },
                error: {
                    ...state.error,
                    visible: false
                },
                loading: false
            };
        case fakeUsersActionTypes.GET_FAKE_USER_FAILURE:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                },
                error: {
                    ...state.error,
                    header: action.data.header && action.data.header !== '' ? action.data.header : '',
                    messages: action.data.errors && action.data.errors.length > 0 ? action.data.errors : [],
                    visible: true
                },
                loading: false
            };

        case fakeUsersActionTypes.SAVE_FAKE_USER_REQUEST:
            return {
                ...state,
                loading: true
            };

        case fakeUsersActionTypes.SAVE_FAKE_USER_FAILURE:
            return {
                ...state,
                error: {
                    ...state.error,
                    header: action.data.header && action.data.header !== '' ? action.data.header : '',
                    messages: action.data.errors && action.data.errors.length > 0 ? action.data.errors : [],
                    visible: true
                },
                loading: false
            };

        case fakeUsersActionTypes.SAVE_FAKE_USER_SUCCESS:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                },
                loading: false,
                _isSaved: true
            };

        case fakeUsersActionTypes.FAKE_USER_SET_WORKER_ID:
            return {
                ...state,
                workerId: Number(action.data)
            };

        case fakeUsersActionTypes.FAKE_USER_SET_ID:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    id: action.data
                }
            };

        case fakeUsersActionTypes.CHANGE_FAKE_USER_NAME:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    fullName: action.data
                }
            };

        case fakeUsersActionTypes.CHANGE_FAKE_USER_LAST_NAME:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    last_name: action.data
                }
            };

        case fakeUsersActionTypes.CHANGE_FAKE_USER_AGE:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    age: Number(action.data)
                }
            };

        case fakeUsersActionTypes.CHANGE_FAKE_USER_HEIGHT:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    height: Number(action.data)
                }
            };

        case fakeUsersActionTypes.CHANGE_FAKE_USER_POLITICS:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    politics: action.data
                }
            };

        case fakeUsersActionTypes.CHANGE_FAKE_USER_RELIGIOUS:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    religion: action.data
                }
            };

        case fakeUsersActionTypes.CHANGE_FAKE_USER_ABOUT:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    about: action.data
                }
            };

        case fakeUsersActionTypes.CHANGE_FAKE_USER_GENDER:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    gender: action.data
                }
            };
        case fakeUsersActionTypes.CHANGE_FAKE_USER_EDUCATION:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    education: action.data
                }
            };
        case fakeUsersActionTypes.CHANGE_FAKE_USER_ETHNICITY:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    ethnicity: action.data
                }
            };
        case fakeUsersActionTypes.CHANGE_FAKE_USER_ZODIAC_SIGN:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    zodiacSign: action.data
                }
            };
        case fakeUsersActionTypes.CHANGE_FAKE_USER_WORK:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    work: action.data
                }
            };
        case fakeUsersActionTypes.CHANGE_FAKE_USER_FAMILY_PLANS:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    familyPlans: action.data
                }
            };

        case fakeUsersActionTypes.CHANGE_FAKE_USER_TAGS:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    tags: action.data
                }
            };
        case fakeUsersActionTypes.CHANGE_FAKE_USER_INTERESTED_IN:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    interestedIn: action.data
                }
            };

        case fakeUsersActionTypes.ADD_FAKE_USER_SPORT_TEAM:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    sportsTeams: [
                        ...state.currentUser.sportsTeams,
                        action.data
                    ]
                }
            };

        case fakeUsersActionTypes.REMOVE_FAKE_USER_SPORT_TEAM:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    sportsTeams: state.currentUser.sportsTeams.filter((item, i) => {
                        return item !== action.data;
                    })
                }
            };

        case fakeUsersActionTypes.ADD_FAKE_USER_MUSIC:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    music: [
                        ...state.currentUser.music,
                        action.data
                    ]
                }
            };

        case fakeUsersActionTypes.REMOVE_FAKE_USER_MUSIC:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    music: state.currentUser.music.filter((item, i) => {
                        return item !== action.data;
                    })
                }
            };

        case fakeUsersActionTypes.ADD_FAKE_USER_MOVIE:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    movies: [
                        ...state.currentUser.movies,
                        action.data
                    ]
                }
            };

        case fakeUsersActionTypes.REMOVE_FAKE_USER_MOVIE:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    movies: state.currentUser.movies.filter((item, i) => {
                        return item !== action.data;
                    })
                }
            };

        case fakeUsersActionTypes.ADD_FAKE_USER_BOOK:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    books: [
                        ...state.currentUser.books,
                        action.data
                    ]
                }
            };

        case fakeUsersActionTypes.REMOVE_FAKE_USER_BOOK:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    books: state.currentUser.books.filter((item, i) => {
                        return item !== action.data;
                    })
                }
            };

        case fakeUsersActionTypes.ADD_FAKE_USER_TV_SHOW:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    tvShows: [
                        ...state.currentUser.tvShows,
                        action.data
                    ]
                }
            };

        case fakeUsersActionTypes.REMOVE_FAKE_USER_TV_SHOW:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    tvShows: state.currentUser.tvShows.filter((item, i) => {
                        return item !== action.data;
                    })
                }
            };

        case fakeUsersActionTypes.ADD_FAKE_USER_PHOTO:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    avatar_photos: [
                        ...state.currentUser.avatar_photos,
                        action.data
                    ]
                }
            };

        case fakeUsersActionTypes.REMOVE_FAKE_USER_PHOTO:
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    avatar_photos: state.currentUser.avatar_photos.filter((item, i) => {
                        return item.id !== action.data.id;
                    })
                }
            };
        case fakeUsersActionTypes.HIDE_ERROR:
            return {
                ...state,
                error: {
                    ...state.error,
                    visible: false
                }
            };

        case fakeUsersActionTypes.FAKE_USER_RESET_SETTINGS:
            return {
                ...state,
                error: {
                    ...state.error,
                    visible: false
                },
                _isSaved: false
            };

        default:
            return state;
    }

}