Template.rooms.events({
    'click .btn.btn-default': function(e) {
        const entity = {
            number: $('#number').val(),
            capacity: $('#capacity').val(),
            hasComputers: $('#hasComputers').prop('checked'),
            building: $('#building').val()
        }
        Rooms.insert(entity);
        sAlert.success('Аудитория создана')
        $('#addroomform').reset();
    }
})
