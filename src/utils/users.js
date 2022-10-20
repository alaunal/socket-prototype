const users = [];

export const userConnect = (id, username, project) => {
    let user;

    const checkUser = users.filter((user) => parseInt(user.id) === parseInt(id) && user.project === project);

    const checkProject = getProjectUsers(project);

    if (checkUser.length < 1) {
        user = {
            id,
            username,
            project,
            isActive: checkProject.length < 1 ? true : false,
            time: `${new Date(Date.now()).getHours()}:${new Date(Date.now()).getMinutes()}:${new Date(Date.now()).getSeconds()}`,
        };

        users.push(user);

    } else {
        user = checkUser[0];
    }

    return user;
};

export const getCurrentUser = (id) => {
    return users.find(user => user.id === id);
};

export const userLeave = (id) => {
    
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

export const reMapUsers = (project) => {
    const usersTemp = [];

    let dataProject = getProjectUsers(project);

    dataProject.map((item, idx) => {
        let temp;
        if(idx === 0) {
            temp = {...item, isActive: true}
        } else {
            temp = {...item, isActive: false}
        }

        usersTemp.push(temp);
    });

    users.splice(0, users.length, ...usersTemp);
};

export const getProjectUsers = (project) => {
    return users.filter(user => user.project === project);
};

export const getUserActive = (project) => {
    const user = getProjectUsers(project);

    return user[0];
};

