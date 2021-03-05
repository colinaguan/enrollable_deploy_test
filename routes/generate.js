var express = require('express');
const { stack } = require('./db.js');
var router = express.Router();
var database = require('./db.js');
var classData = database.classData;

var conflictPairs = [];

router.post('/', function(req, res) {
    conflictPairs = [];
    var generateRequest = req.body;
    // console.log(JSON.parse(generateRequest));
    var generateResult = generateSchedules(generateRequest);
    // console.log(generateResult);
    res.send(generateResult);
});

function generateSchedules(requestObject) {
    result = {};
    priorityScores = [];
    // console.log(requestObject.classes);
    possibleSchedules = getNoConflictSchedules(requestObject.classes);
    if (possibleSchedules.length === 0) {
        // console.log("conflictPairs",conflictPairs)
        result.successful = false;
        result.schedules = conflictPairs;
        return result;
    }

    minUnits = requestObject.minUnits
    maxUnits = requestObject.maxUnits
    avoidTimes = requestObject.avoidTimes

    // check unit constraint
    possibleSchedules = unitConstraint(possibleSchedules, minUnits, maxUnits);
    if (possibleSchedules.length === 0) {
        // console.log("no schedule satisfy unit constraints")
        result.successful = false;
        result.schedules = {};
        return result;
    }
    
    // check time constraint
    // console.log(avoidTimes)
    possibleSchedules = avoidTimesConstraint(possibleSchedules, avoidTimes);
    if (possibleSchedules.length === 0) {
        // console.log("no schedule satisfy avoid constraints")
        result.successful = false;
        result.schedules = {};
        return result;
    }
    
    // remove unfit sections
    possibleSchedules = sectionConstraint(possibleSchedules, avoidTimes);

    // priority reorder
    possibleSchedules = priorityReorder(possibleSchedules);

    result.successful = true;
    result.schedules = possibleSchedules;

    return result;
}

function getNoConflictSchedules(classesList) {
    possibleSchedules = []; 
    // go through all courses except the last course
    for (var i=0; i<classesList.length-1; i++) {
        var course = classesList[i];
        // console.log("course root: ", course);
        var newStack = [];
        newStack.push([course]);// newStack.push([course]);
        // console.log("stack: ", newStack);
        while (newStack.length) { //
            // console.log("enter");
            schedule = newStack.pop();
            // console.log("pop: ", schedule);
            successors = successor(schedule, classesList)
            // temp = schedule
            // needs to be a copy, not reference
            temp = JSON.parse(JSON.stringify(schedule));
            if(successors.length !== 0){
                for(var newClass of successors){
                
                    // reinitialize schedule here
                    schedule = JSON.parse(JSON.stringify(temp));
                    // console.log("temp",temp)
                    // console.log("newClass: ", newClass);
                    conflict = checkTimeConflict(schedule, newClass)
                    // console.log("conflict", conflict)
                    if (!conflict) {
                        // console.log("no conflict pass")
                        schedule.push(newClass);
                        // console.log("schedule: ", schedule);
                        possibleSchedules.push(schedule);
                        newStack.push(schedule);
                    }
                    // console.log("possible schdule", possibleSchedules)
                }
            }
        }	
    }

    return possibleSchedules;
}

function unitConstraint(possibleSchedules, minUnits, maxUnits){
    // for (var schedule of possibleSchedules) {
    for (var i=0; i<possibleSchedules.length; i++) {
        schedule = possibleSchedules[i]
        unitSum = 0;
        // conflict : variable indicates whether class is conflict with time constraints
        conflict = false;
        for (var classData of schedule) {
            unitSum += classData.unit;
        } 
        // check unit restriction
        // console.log("unitSum", unitSum)
        // console.log("before possibleSchedules", possibleSchedules)
        if (unitSum < minUnits || unitSum > maxUnits) {	
            // possibleSchedules.remove(schedule);
            index = possibleSchedules.indexOf(schedule);
            if (index > -1) {
                possibleSchedules.splice(index, 1);
                // consider one item has been removed
                i-=1;
            }
            // console.log("after possibleSchedules", possibleSchedules)
            continue;
        }  
    }

    return possibleSchedules
}

// function to check avoidTime constraint
function avoidTimesConstraint(possibleSchedules, avoidTimes){
    for (var i=0; i<possibleSchedules.length; i++) {
        schedule = possibleSchedules[i];

        for (var classData of schedule) {
            // console.log("classData iteration to detect conflict with avoid times")
            // check conflict with avoid time list
            // if conflict remove schedule from possibleSchedules
            if (conflictAvoidTime(avoidTimes, classData)) {
                // console.log("removed schedule")
                index = possibleSchedules.indexOf(schedule);
                if (index > -1) {
                    // console.log(possibleSchedules[index])
                    possibleSchedules.splice(index, 1);
                    i-=1;
                }    
                break;
            }
        } 
    }

    return possibleSchedules
}

function sectionConstraint(possibleSchedules, avoidTimes){
    newPossibleSchedules = [];
    for (var i=0; i<possibleSchedules.length; i++) {
        schedule = possibleSchedules[i];

        for (var classData of schedule) {
            classCopy = classData;
            if (classData.sections) {
                for (var section of classData.sections) {
                    // remove from class.sections array if conflict with schedule
                    // or avoid time list
                    if (checkTimeConflict(schedule, section) || conflictAvoidTime(avoidTimes, section)) {
                        classCopy.sections.splice(classData.sections.indexOf(section), 1);
                    }
                }
            }
            // console.log(classCopy);
            // store the new class information
            schedule[schedule.indexOf(classData)] = classCopy;
        } 
        newPossibleSchedules.push(schedule)
    }

    return newPossibleSchedules
}

function priorityReorder(possibleSchedules) {
    priorityScores = [];
    reorderedList = [];
    // get priorityScores for each schedule
    for (var i=0; i<possibleSchedules.length; i++) {
        schedule = possibleSchedules[i];
        score = 0;
        for (var classData of schedule) {
            score += classData.priority;
        }
        priorityScores.push(score);
    }
    // console.log("priority score:", priorityScores);

    // priority reorder based on priority score
    // the schedule with minimum score means higher priority
    // will be reordered and displayed in the front of the list
    priorityScoresCopy = [...priorityScores];
    while (priorityScoresCopy && priorityScoresCopy.length) {
        min = Infinity;
        for (var score of priorityScoresCopy) {
            if (score < min) {
                min = score;
            }
        }
        priorityScoresCopy.splice(priorityScoresCopy.indexOf(min), 1);
        reorderedList.push(possibleSchedules[priorityScores.indexOf(min)]);
    }

    return reorderedList
}

function successor(schedule, classesList) {
    index = schedule.length-1;
    lastCourse = schedule[index];

    // console.log("last course: ", lastCourse);
	successors = [];
	for (var i=classesList.indexOf(lastCourse)+1; i<classesList.length; i++) {
        if (i >= classesList.length) {
            return successors; 
        }

        successors.push(classesList[i]);
    }
    // console.log("successors");
    // console.log(successors);

	return successors;
}

function checkTimeConflict(schedule, newClass) {
    for (var i = 0; i < schedule.length; i++) {
        classData = schedule[i];
        classDate = classData.days;
        courseDate = newClass.days;
        intersectDate = intersect(classDate, courseDate);
        // console.log("intersect", intersectDate);
        if (intersectDate.length !== 0) {
            // check overlap
            // console.log("classData.start", classData.start)
            // console.log("newClass.end", newClass.end)
            // console.log("-")
            // console.log("classData.end", classData.end)
            // console.log("newClass.start", newClass.start)
            // console.log("classData.start<=newClass.end",classData.start<=newClass.end)
            // console.log("classData.end>=newClass.start", classData.end>=newClass.start)
            if (classData.start<=newClass.end && classData.end>=newClass.start){
                // console.log("detected conflcit")
                // if the conflict pair was not recorded, append to the list
                conflictPair = [newClass, classData];
                if (conflictPairs.indexOf([newClass, classData]) === -1) {
                    conflictPairs.push(conflictPair);
                }

                return true;
            }
        }
    }

    return false;
}

function conflictAvoidTime(avoidTimes, newClass) {
    classDates = newClass.days;
    for (var avoidTime of avoidTimes) {
        avoidTimeDates = avoidTime.days;
        intersectDates = intersect(avoidTimeDates, classDates);
        if (intersectDates.length === 0) {
            continue;
        }
        // check overlap
        // console.log("intersect length !=0")
        if (avoidTime.start<=newClass.end && avoidTime.end>=newClass.start){
            return true;
        }
    }

    return false;
}

function intersect(arrA, arrB) {
    // console.log("arrA", arrA)
    // console.log("arrB", arrB)
    let intersection = arrA.filter(x => arrB.includes(x));
    
    return intersection
}

module.exports = router;