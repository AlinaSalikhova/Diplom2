Template.reports.helpers({
    allUsers: function () {
        return Meteor.users.find({})
    }
});
Template.report1.helpers({
    allUsers: function () {
        return Meteor.users.find({})
    }
});
Template.reports.onCreated(function () {
    Meteor.subscribe('allUsers');
});
Template.reports.events(
    {
        'click .report1':function () {
            var doc = new jsPDF();
            doc.fromHTML($('#report1').html(), 15, 15, {
                'width': 170,
                //'elementHandlers':specialElementHandlers
            });
            doc.save('sample-file.pdf');

        }
    }
);