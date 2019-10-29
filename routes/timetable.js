const router = require("express").Router();
const timetableModel = require("../schemas/timetable");


async function getTimetable(group){
    var tt = await timetableModel.findOne({group:group}).exec();
    return tt;
}

router.post("/getTimetable", function(req,res) {
    var group = req.body.group; 
    getTimetable(group).then((timetable_doc)=>{
        if (timetable_doc) {
            res.json({status:200,mon:timetable_doc.mon,tue:timetable_doc.tue,wed:timetable_doc.wed,thu:timetable_doc.thu,fri:timetable_doc.fri})
        }
        else {
            res.json({status:400,msg:"Нет расписания для выбранной группы"});
        }
    });
});

module.exports = router;