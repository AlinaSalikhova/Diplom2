
Template.admin.events({
    'click .btn.btn-default': function (e) {
        console.log(e);
        e.preventDefault();
        var profile={
            name: $('#name').val(),
            surname: $('#surname').val(),
            lastname: $('#lastname').val(),
            chafedra: $('#chafedra').val(),
            phone: $('#department').val()
        };
        Meteor.call('createMyOwnUser', $('#login').val(), $('#password').val(), profile, function (err, userid) {
            if(err){
                sAlert.error(err.reason);
            }
            else{
                Meteor.call('setUserAsTeacher', userid);
                e.target.reset()
            }
        })
    },
    'change .upload-excel-file':function (e) {
        e.preventDefault();


        var h = function(e) {

            var to_json = function to_json(workbook) {
                var result = {};
                workbook.SheetNames.forEach(function(sheetName) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
                    if(roa.length) result[sheetName] = roa;
                });
                return result;
            };

            var workbook = XLSX.read(e.target.result, {type:"binary", WTF: true});
            var worksheet = workbook.Sheets[workbook.SheetNames[0]];
            console.log(worksheet);
            //console.log(XLSX.utils.make_json(workbook.Sheets[workbook.SheetNames[0]],{header:3}));
            var jsonsheet=XLSX.utils.sheet_to_json(worksheet);
            var mergedCols=worksheet['!merges'];
            function isRowsMerged(a,b, col){
                for(var k=0; k<mergedCols.length; k++){
                    var merge=mergedCols[k];
                    if(merge.e.r==Math.max(a,b) && merge.s.r==Math.min(a,b) && Math.abs(merge.s.c-col)<2 && Math.abs(merge.e.c-col)<2){return true}
                }
                return false
            }
            var addedCount=0;
            var parsed=to_json(workbook);
            var groups=[];
            console.log(parsed[workbook.SheetNames[0]][3]);
            for(var k=2; k<parsed[workbook.SheetNames[0]][2].length; k+=2){
                groups.push({
                    title:parsed[workbook.SheetNames[0]][2][k],
                    col:k,
                    pairs:[]
                })
            }
            var times=[0,0,1,1,2,2,3,3,4,4,5,5,6,6];
            var days=['пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
            console.log(groups);
            groups.forEach((group,k)=>{
                for(var i=3; i<parsed[workbook.SheetNames[0]].length-1; i++){
                    var d=i-3;
                    var t=times[d%12];
                    var day=Math.floor(d/12);
                    if(i%2==1) {
                        if (parsed[workbook.SheetNames[0]][i][group.col]) {
                            groups[k].pairs.push({time: t, pair: parsed[workbook.SheetNames[0]][i][group.col], week: [1], day:day})
                        }
                    }
                    if(i%2==0){
                        if (parsed[workbook.SheetNames[0]][i][group.col]) {
                            groups[k].pairs.push({time: t, pair: parsed[workbook.SheetNames[0]][i][group.col], week: [2], day:day})
                        }
                        else{
                            if(isRowsMerged(i-1, i, group.col) && parsed[workbook.SheetNames[0]][i-1][group.col]){
                                groups[k].pairs[groups[k].pairs.length-1].week.push(2);
                            }
                        }
                    }
                }

            });
            console.log(groups);
            groups.forEach(group=>{
                group.pairs.forEach(pair=>{
                    pair.pair=pair.pair.replace(/[\n\r]/g, ' ').replace(/\s/g,' ');;
                    var pairTypeOpenBracket=pair.pair.lastIndexOf('(');
                    var pairTypeCloseBracket=pair.pair.indexOf(')', pairTypeOpenBracket);
                    var pairType=pair.pair.substring(pairTypeOpenBracket+1, pairTypeCloseBracket);
                    var reversed=pair.pair.split('').reverse().join('');
                    var firstSpace=reversed.indexOf(' ');
                    var secondSpace=reversed.indexOf(' ', firstSpace+1);
                    var thirdSpace=reversed.indexOf(' ', secondSpace+1);
                    var fourthSpace=reversed.indexOf(' ', thirdSpace+1);
                    var room='';
                    var teacher='';
                    if(reversed.substring(0, firstSpace).split('').reverse().join('')=='ФТПН'){
                        room='ФТПН';
                        teacher=reversed.substring(firstSpace+1, thirdSpace).split('').reverse().join('');
                    }
                    else{
                        room=reversed.substring(0, secondSpace).split('').reverse().join('');
                        teacher=reversed.substring(secondSpace+1, fourthSpace).split('').reverse().join('');
                    }
                   // console.log(reversed, firstSpace, secondSpace);

                    var pairTitle=pair.pair.substring(0, pairTypeOpenBracket-1);
                    var insertion={
                        subject:pairTitle,
                        subjectType:pairType,
                        weeks:pair.week,
                        day:pair.day,
                        pair:pair.time,
                        teacher:{
                            surname:teacher,
                            name:'',
                            lastname:''
                        },
                        room:room,
                        group: group.title
                    }
                    SubjectEntities.insert(insertion);


                })
            });
            sAlert.success('Расписание успещно загружено')
        };
        for(var k=0; k<e.target.files.length; k++){
            var reader = new FileReader();
            reader.onload=h;
            reader.readAsBinaryString(e.target.files[k]);
        }

    }
});

Template.admin.helpers({
    allUsers: function () {
        return Meteor.users.find({})
    }
});
Template.admin.onCreated(function () {
    Meteor.subscribe('allUsers');
})
