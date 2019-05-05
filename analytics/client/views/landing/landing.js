Template.landing.onRendered(function() {
    let settings = 'particlesjs-config.json';
    this.autorun(() => {
        if (particlesJS) {
            particlesJS.load('parti', settings, function() {
                console.log('callback - particles.js config loaded');
            });
            window.p=particlesJS;
        }
    });
});
Template.landing.events({
    "submit form": function (e,t) {
        e.preventDefault();
        var login = $('#login').val();
        var password = $('#password').val();
        Meteor.loginWithPassword(login, password, function (error, userId) {
            if (error){
                sAlert.error(error.reason)
            }
            else{
                console.log(Meteor.user())
                if (Meteor.user().username=='admin'){
                    Router.go('/admin')
                }
                else{
                    Router.go('/teacher/schedule');
                }
            }

        });
    }

});