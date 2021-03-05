var express = require('express');
var router = express.Router();
var database = require('./db.js');
var classData = database.classData;

router.get('/', function(req, res) {
    var getCourses = [];
    var course;
    
    // if there are parameters entered
    if (Object.keys(req.query).length !== 0) {
        var queryParameter = req.query;
        // if reads type=xx
        if (queryParameter.type && queryParameter.type !== 'any'){
            for (var i in classData){
                for (var j in classData[i]){
                    if (classData[i][j].type === queryParameter.type.toUpperCase()){
                        // if reads type=xx&ge=xx
                        if (queryParameter.ge && queryParameter.ge !== 'any') {
                            for (var k in classData[i][j].ge){
                                if (classData[i][j].ge[k] === queryParameter.ge.toUpperCase()){
                                    getCourses.push(classData[i][j]);
                                    break;
                                }
                            }
                        } else {
                            getCourses.push(classData[i][j]);
                        }
                    }
                }
            }
        // else if only reads ge=xx
        } else if (queryParameter.ge && queryParameter.ge !== 'any'){
            for (var i in classData){
                for (var j in classData[i]){
                    for (k in classData[i][j].ge){
                        if (classData[i][j].ge[k] === queryParameter.ge.toUpperCase()){
                            getCourses.push(classData[i][j]);
                            break;
                        }
                    }
                }
            }
        // else if only reads course=xx
        } else if (queryParameter.course && queryParameter.course !== 'any'){
            for (var i in classData){
                for (var j in classData[i]){
                    if(classData[i][j].num === parseInt(queryParameter.course)){
                        course = classData[i][j];
                        break;
                    }
                }
            }
        // if all parameters are 'any' or no input
        } else {
            for (var i in classData){
                for (var j in classData[i]){
                    getCourses.push(classData[i][j]);
                }
            }
        }    
    // if no parameter entered return entire course list
    } else {
        for (var i in classData){
            for (var j in classData[i]){
                getCourses.push(classData[i][j]);
            }
        }
    }

    if (course) {
        res.send(course)
    } else if (getCourses.length === 0){
        res.status(404).send("No courses found");
    } else {
        res.send(getCourses);
    }
});

router.get('/term', function(req,res) {
    res.send(2210);
})

router.get('/ge', function(req,res) {
    res.send({
        "CC": "Cross-Cultural Analysis",
        "ER": "Ethnicity and race",
        "IM": "Interpreting Arts and Media",
        "MF": "Mathematical and Formal Reasoning",
        "SI": "Scientific Inquiry",
        "SR": "Statistical Reasoning",
        "TA": "Textual Analysis",
        "PE-E": "Environmental Awareness",
        "PE-H": "Human Behavior",
        "PE-T": "Technology and Society",
        "PR-E": "Collaborative Endeavor",
        "PR-C": "Creative Process",
        "PR-S": "Service Learning",
        "C2": "Composition",
        "C1": "Composition",
        "DC": "Disciplinary Communication"
    });
})

router.get('/ge=:geid', function(req,res) {
    var getCourses = [];
    for (var i in classData){
        for (var j in classData[i]){
            for (k in classData[i][j].ge){
                if (classData[i][j].ge[k] === req.params.geid.toUpperCase()){
                    getCourses.push(classData[i][j]);
                    break;
                }
            }
        }
    }
    if (getCourses.length === 0){
        res.status(404).send("No courses found");
    } else {
        res.send(getCourses);
    }
})

router.get('/type', function(req,res) {
    res.send(['lecture', 'laboratory', 'seminar', 'studio', 'field studies']);
})

router.get('/type=:typeid', function(req,res) {
    var getCourses = [];
    for (var i in classData){
        for (var j in classData[i]){
            if (classData[i][j].type === req.params.typeid.toUpperCase()){
                getCourses.push(classData[i][j]);
            }
        }
    }
    if (getCourses.length === 0){
        res.status(404).send("No courses found");
    } else {
        res.send(getCourses);
    }
})

router.get('/type=:typeid/ge=:geid', function(req,res) {
    var getCourses = [];
    for (var i in classData){
        for (var j in classData[i]){
            if (classData[i][j].type === req.params.typeid.toUpperCase()){
                for (var k in classData[i][j].ge){
                    if (classData[i][j].ge[k] === req.params.geid.toUpperCase()){
                        getCourses.push(classData[i][j]);
                        break;
                    }
                }
            }
        }
    }
    if (getCourses.length === 0){
        res.status(404).send("No courses found");
    } else {
        res.send(getCourses);
    }
})

router.get('/course=:courseId', function(req,res) {
    var course;
    for (var i in classData){
        for (var j in classData[i]){
            if(classData[i][j].num === parseInt(req.params.courseId)){
                course = classData[i][j];
                break;
            }
        }
    }
    if (!course){
        res.status(404).send("Course not found");
    } else {
        res.send(course);
    }
});


module.exports = router;
