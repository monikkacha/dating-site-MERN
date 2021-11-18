let stateGraph = {
    '0': 1,
    '1': -1,
    '-1': 0
};

export function computeDirection(oldColumn, newColumn, prevDirection) {
    if (oldColumn !== newColumn) {
        return 1;
    }

    if (!stateGraph.hasOwnProperty(prevDirection)) {
        return 0;
    }

    return stateGraph[prevDirection];
}

export function directionToString(direction) {
    switch (direction) {
        case 1:
            return 'ascending';
        case -1:
            return 'descending';
        default:
            return null;
    }
}

export function prepareToSave(user) {
    let newUser = {...user};
    Object.keys(newUser).forEach((value, index) => {
        if (!newUser[value]) {
            delete newUser[value];
            return;
        }


        if (newUser[value] instanceof Array) {
            if (newUser[value].length === 0) {
                delete newUser[value];
                return;
            }
            newUser[value] = { ...newUser[value] };
        }
    });

    return newUser;
}

export function prepareFromAPI(user) {
    Object.keys(user).forEach((value, index) => {
        if (user[value] instanceof Object && !user[value].hasOwnProperty('length')) {
            let arr = [];

            Object.keys(user[value]).sort().forEach(function(key) {
                arr.push(user[value][key]);
            });

            user[value] = arr;
        }
    });

    return user;
}
