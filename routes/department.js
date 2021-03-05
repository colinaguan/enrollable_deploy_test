var express = require('express');
var router = express.Router();
var database = require('./db.js');
var classData = database.classData;

/* GET api page. */
router.get("/", function (req, res) {
  var getCourses = [];
  var dep;

  // if there are parameters
  if (Object.keys(req.query).length !== 0) {
    var queryParameter = req.query;
    // case dep=XX
    if (queryParameter.dep && queryParameter.dep !== 'any') {
      for (var i in classData) {
        if (i === queryParameter.dep.toUpperCase()) {
          // case dep=XX&type=XX
          if (queryParameter.type && queryParameter.type !== 'any') {
            for (var j in classData[i]) {
              if (classData[i][j].type === queryParameter.type.toUpperCase()) {
                // case dep=XX&type=XX&ge=XX
                if (queryParameter.ge && queryParameter.ge !== 'any') {
                  for (var k in classData[i][j].ge) {
                    if (classData[i][j].ge[k] === queryParameter.ge.toUpperCase()) {
                      getCourses.push(classData[i][j]);
                      break;
                    }
                  }
                } else {
                  getCourses.push(classData[i][j]);
                }
              }
            }
          // case dep=XX&ge=XX
          } else if (queryParameter.ge && queryParameter.ge !== 'any') {
            for (var j in classData[i]) {
              for (k in classData[i][j].ge) {
                if (classData[i][j].ge[k] === queryParameter.ge.toUpperCase()) {
                  getCourses.push(classData[i][j]);
                  break;
                }
              }
            }
          } else {
            getCourses = classData[i];
          }
        }
      }
    // case type=XX
    } else if (queryParameter.type && queryParameter.type !== 'any') {
      for (var i in classData){
        for (var j in classData[i]){
            if (classData[i][j].type === queryParameter.type.toUpperCase()){
                // case type=xx&ge=xx
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
    //case ge=XX
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
    // if all parameters are 'any' or no parameter
    } else {
      for (var i in classData){
        for (var j in classData[i]){
            getCourses.push(classData[i][j]);
        }
      }
    }
  // if no parameter entered return all departments
  } else {
    dep = Object.keys(classData);
  }
  
  if (dep) {
    res.send(dep);
  } else if (getCourses.length === 0) {
    res.status(404).send("No courses found");
  } else {
    res.send(getCourses);
  }
});

router.get('/details', function (req, res) {
  res.send({
    "ANTH": "Anthropology",
    "APLX": "Applied Linguistics",
    "AM": "Applied Mathematics",
    "ARBC": "Arabic",
    "ART": "Art",
    "ARTG": "Art & Design: Games and Playable Media",
    "ASTR": "Astronomy and Astrophysics",
    "BIOC": "Biochemistry and Molecular Bio",
    "BIOL": "Biology: Molecular & Cell Dev",
    "BIOE": "Biology: Ecology & Evolutionary",
    "BME": "Biomolecular Engineering",
    "CRSN": "Carson College",
    "CHEM": "Chemistry and Biochemistry",
    "CHIN": "Chinese",
    "CSP": "Coastal Science and Policy",
    "CLNI": "College Nine",
    "CLTE": "College Ten",
    "CMMU": "Community Studies",
    "CMPM": "Computational Media",
    "CSE": "Computer Science & Engineering",
    "COWL": "Cowell College",
    "CRES": "Critical Race & Ethnic Studies",
    "CRWN": "Crown College",
    "DANM": "Digital Arts and New Media",
    "EART": "Earth Science",
    "ECON": "Economics",
    "EDUC": "Education",
    "ECE": "Electrical and Computer Engineering",
    "ESCI": "Environmental Science",
    "ENVS": "Environmental Studies",
    "FMST": "Feminist Studies",
    "FILM": "Film and Digital Media",
    "FREN": "French",
    "GAME": "Games and Playable Media",
    "GERM": "German",
    "GREE": "Greek",
    "HERB": "Hebrew",
    "HIS": "History",
    "HAVC": "History of Art and Visual Culture",
    "HISC": "History of Consciousness",
    "ITAL": "Italan",
    "JAPN": "Japanese",
    "JWST": "Jewish Studies",
    "KRSG": "Kresge College",
    "LAAD": "Language",
    "LATN": "Latin",
    "LALS": "Latin American and Latino Studies",
    "LGST": "Legal Studies",
    "LING": "Linguistics",
    "LIT": "Literature",
    "MATH": "Mathematics",
    "MERR": "Merril College",
    "METX": "Microbiol & Environ Toxicology",
    "MUSC": "Music",
    "NLP": "Natural Language Processing",
    "OAKS": "Oakes College",
    "OCEA": "Ocean Sciences",
    "PERS": "Persian",
    "PHIL": "Philosophy",
    "PBS": "Physical & Biological Sciences",
    "PHYS": "Physics",
    "POLI": "Politics",
    "PRTR": "Porter College",
    "PORT": "Portuguese",
    "PSYC": "Psychology",
    "PUNJ": "Punjabi",
    "SCIC": "Science Communication",
    "SOCD": "Social Documentation",
    "SOCY": "Sociology",
    "SPAN": "Spanish",
    "SPHS": "Spanish for Heritage Speakers",
    "STAT": "Statistics",
    "STEV": "Stevensen College",
    "THEA": "Theater Arts",
    "UCDC": "UCDC",
    "WRIT": "Writing",
    "YIDD": "Yiddish",
  });
});

router.get('/dep=:depid', function (req, res) {
  var getCourses;
  for (var i in classData) {
    if (i === req.params.depid.toUpperCase()) {
      getCourses = classData[i];
    }
  }
  if (!getCourses) {
    res.status(404).send("department not found");
  } else {
    res.send(getCourses);
  }
});

router.get('/dep=:depId/type=:typeId', function (req, res) {
  var getCourses = [];
  for (var i in classData) {
    if (i === req.params.depId.toUpperCase()) {
      for (var j in classData[i]) {
        if (classData[i][j].type === req.params.typeId.toUpperCase()) {
          getCourses.push(classData[i][j]);
        }
      }
    }
  }
  if (!getCourses) {
    res.status(404).send("No classes found");
  } else {
    res.send(getCourses);
  }
});

router.get('/dep=:depId/ge=:geId', function (req, res) {
  var getCourses = [];
  for (var i in classData) {
    if (i === req.params.depId.toUpperCase()) {
      for (var j in classData[i]) {
        for (var k in classData[i][j].ge) {
          if (classData[i][j].ge[k] === req.params.geId.toUpperCase()) {
            getCourses.push(classData[i][j]);
          }
        }
      }
    }
  }
  if (getCourses.length === 0) {
    res.status(404).send("No clases found");
  } else {
    res.send(getCourses);
  }
});

module.exports = router;
