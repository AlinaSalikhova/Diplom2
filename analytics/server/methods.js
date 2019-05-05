let methods= {
    'createMyOwnUser': function (login, pass, profile) {
        return Accounts.createUser({username: login, password: pass, profile: profile});
    },
    setUserAsAdmin: function (id) {
        return Roles.addUsersToRoles(id, ['admin'], 'default-group');
    },
    setUserAsTeacher: function (id) {
        return Roles.addUsersToRoles(id, ['teacher'], 'default-group');
    },
    setUserAsSecretary: function (id) {
        return Roles.addUsersToRoles(id, ['secretary'], 'default-group');
    },
    setUserAsStudent: function (id) {
        return Roles.addUsersToRoles(id, ['student'], 'default-group');
    }
}


Meteor.methods(methods);








