Router.route('/student/schedule', function () {
    this.layout('AppLayout');
    this.render('student')
});
Router.route('/student/subscr',function () {
    this.layout('AppLayout');
    this.render('studentSubscr')
});
Router.route('/student/my',function () {
    this.layout('AppLayout');
    this.render('studentMy')
});
Router.route('/student/news',function () {
    this.layout('AppLayout');
    this.render('studentNews')
});
Router.route('/admin/rooms', function() {
    this.layout('AppLayout');
    this.render('rooms');
})
Router.route('/teacher/schedule', function () {
    if(!Meteor.userId()){
        this.redirect('/landing')
    }
    this.layout('AppLayout');
    this.render('teacherSchedule');
});
Router.route('/landing', function () {
    if(Meteor.userId()){
        if (Meteor.user().username=='admin'){
            this.redirect('/admin/add')
        }
        else{
            this.redirect('/teacher/schedule')
        }
    }
    this.layout('landinglayout');
    this.render('landing');
});
Router.route('/admin/add', function () {
    if(!Meteor.userId()){
        this.redirect('/landing')
    }
    this.layout('AppLayout');
    this.render('admin');
});

Router.route('/', function () {
    this.redirect('/landing');
});
Router.route('/teacher/my',function () {
    this.layout('AppLayout');
    this.render('teacherMy')
});
Router.route('/admin/reports',function () {
    this.layout('AppLayout');
    this.render('reports')
});

