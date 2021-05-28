Template.teacherSchedule.helpers({
    'currentDays':function () {

    },
    'gdn':function (moment) {
       return moment.format("dd, D MMMM");
    },
    'getHasComputers': function (hasComputers) {
        return hasComputers ? 'С компами' : 'Без компов';
    },
    'rangeTitle':function () {
        return moment().day(Template.instance().start.get()).format("D MMMM")+' - '+moment().day(Template.instance().end.get()-1).format("D MMMM")
    },
    'week':function () {
        return moment().day(Template.instance().start.get()+1).week()%2==0?'Первая неделя':'Вторая неделя';
    },
    'rooms': function () {
        return Rooms.find();
    },
    'days':function () {
        var days=[];
        for(var k=Template.instance().start.get(); k<Template.instance().end.get(); k++){
            days.push(moment().day(k));
        }
        return days;
    },
    'getPairDate':function (index) {
        return ['8:00-9:30', '9:40-11:10', '11:30-13:00', '13:20-14:50', '15:00-16:30', '16:40-18:10'][index]
    },
    'getGroups':function () {
        var groups=new Set();
        SubjectEntities.find().fetch().forEach(i=>groups.add(i.group));
        return [...groups];
    },
    'getPair':function (pairNum, date) {
        var week=moment().day(Template.instance().start.get()+1).week()%2==0?1:2;
        var p=SubjectEntities.find({/*group: Template.instance().group.get(),*/ pair:pairNum, day:date}).fetch().filter((a)=>a.weeks.indexOf(week)>-1 || a.weeks.length==0)[0];
        return '<p style="font-weight: bold">'+p.subject+'</p> хуй хуевич<br> Ауд.'+p.room+'<br>'+p.subjectType;
    },
    'pair':function () {
        return [1,2,3,4,5,6];
    },
    'hasPair':function (pair, day) {
        var week=moment().day(Template.instance().start.get()+1).week()%2==0?1:2;
        console.log(week, )
        return SubjectEntities.find({/*group: Template.instance().group.get(),*/ pair:pair, day:day}).fetch().filter((a)=>a.weeks.indexOf(week)>-1 || a.weeks.length==0).length>0
    },
    'isSubmitDisabled':function () {
        return Template.instance().formErrors.get()?'disabled':''
    },
    'getErrorText':function () {
        return Template.instance().formErrors.get()?'Аудитория занята':''
    }
});

Template.teacherSchedule.events({
    'click .remove-pair': function (e) {
        const pairNum = Number(e.target.dataset.pairnum);
        const date = Number(e.target.dataset.date);
        console.log(pairNum, date);
        //var week=moment().day(Template.instance().start.get()+1).week()%2==0?1:2;
        var p=SubjectEntities.findOne({ pair:pairNum, day:date});
        SubjectEntities.remove({_id: p._id});
    },
    'click .prevWeek':function (e,t) {
        t.start.set(t.start.get()-7);
        t.end.set(t.start.get()+6);
    },
    'click .nextWeek':function (e,t) {
        t.start.set(t.start.get()+7);
        t.end.set(t.start.get()+6);
    },
    'click .goHome':function (e,t) {
        t.start.set(-6);
        t.end.set(t.start.get()+6);
    },
    'click .addPair':function (e,t) {
        console.log(e.target);
        if([...e.target.classList].indexOf('mayClose')>-1){
            console.log('mayClose');
            return 0;
        }
        else {
            function getCoords(elem) { // кроме IE8-
                var box = elem.getBoundingClientRect();

                return {
                    top: box.top + pageYOffset,
                    left: box.left + pageXOffset
                };
            }

            var b = getCoords(e.target);
            var el=$(e.currentTarget);
            t.currentDay=el.data('day')
            t.currentPair=el.data('pair')
            $('.addPair').removeClass('mayClose');
            e.target.classList.add('mayClose');
            $('.tooltip-holder').fadeIn(300).css(({
                left: b.left + 80,
                top: b.top - $('.tooltip-holder').height() / 2 + $(e.target).height() / 2
            }));
        }
    },
    'click .addPair.mayClose':function (e) {
        e.target.classList.remove('mayClose');
        $('.tooltip-holder').fadeOut(300)
    },
    'submit #newEntity': function (e,t) {
        e.preventDefault();
        var insertion={
            subject:$('#subject').val(),
            subjectType:$('#subjectType').val(),
            weeks:[],
            day:t.currentDay,
            pair:t.currentPair,
            teacher:Meteor.user().profile,
            room:$('#room').val()
        };
        console.log($('#evenWeek').is(":checked"), $('#oddWeek').is(":checked"));
        if($('#evenWeek').is(":checked")){
            insertion.weeks.push(1);
        }
        if($('#oddWeek').is(":checked")){
            insertion.weeks.push(2);
        }
        SubjectEntities.insert(insertion);
        $('.tooltip-holder').fadeOut(300);
        $('.addPair').removeClass('mayClose');
    },
    'change #room':function (e,t) {
        function intersect(a, b) {
            return [...new Set(a)].filter(x => new Set(b).has(x));
        }
        var weeks=[];
        if($('#evenWeek').is(":checked")){
            weeks.push(1);
        }
        if($('#oddWeek').is(":checked")){
            weeks.push(2);
        }
        console.log(intersect([1,2], [1]));
        var rooms=SubjectEntities.find({pair:t.currentPair}).fetch().filter(i=>intersect(i.weeks, weeks).length>0).map(i=>i.room);
        if(rooms.indexOf($('#room').val())>-1){
            t.formErrors.set(true);
            $('#room').addClass('is-invalid');
        }
        else{
            t.formErrors.set(false);
            $('#room').removeClass('is-invalid');
        }
    },
    'change #evenWeek':function (e,t) {
        console.log(1)
        function intersect(a, b) {
            return [...new Set(a)].filter(x => new Set(b).has(x));
        }
        var weeks=[];
        if($('#evenWeek').is(":checked")){
            weeks.push(1);
        }
        if($('#oddWeek').is(":checked")){
            weeks.push(2);
        }
        console.log(intersect([1,2], [1]));
        var rooms=SubjectEntities.find({pair:t.currentPair}).fetch().filter(i=>intersect(i.weeks, weeks).length>0).map(i=>i.room);
        if(rooms.indexOf($('#room').val())>-1){
            t.formErrors.set(true);
            $('#room').addClass('is-invalid');
        }
        else{
            t.formErrors.set(false);
            $('#room').removeClass('is-invalid');
        }
    },
    'change #oddWeek':function (e,t) {
        console.log(2)
        function intersect(a, b) {
            return [...new Set(a)].filter(x => new Set(b).has(x));
        }
        var weeks=[];
        if($('#evenWeek').is(":checked")){
            weeks.push(1);
        }
        if($('#oddWeek').is(":checked")){
            weeks.push(2);
        }
        console.log(intersect([1,2], [1]));
        var rooms=SubjectEntities.find({pair:t.currentPair}).fetch().filter(i=>intersect(i.weeks, weeks).length>0).map(i=>i.room);
        if(rooms.indexOf($('#room').val())>-1){
            t.formErrors.set(true);
            $('#room').addClass('is-invalid');
        }
        else{
            t.formErrors.set(false);
            $('#room').removeClass('is-invalid');
        }
    },
    'change .group':function (e,t) {
        t.group.set($(e.currentTarget).val());
    }
})

Template.teacherSchedule.onCreated(function () {
    moment.locale('ru');
    this.start=new ReactiveVar(1);
    this.end=new ReactiveVar(this.start.get()+6);
    this.formErrors=new ReactiveVar(false);
    this.group=new ReactiveVar('');

})
