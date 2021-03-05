import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { StarFill, Star } from "react-bootstrap-icons";
import { shortenDays, timeToString } from '../utils/format';
// import { useAuth } from '../contexts/AuthContext';
import GenerateSectionsModal from './GenerateSectionsModal';
import '../style/GenerateClassCard.css';

function GenerateClassCard({ classNum, favList, setFavList, handleSelectedClasses }) {

    const [classData, setClassData] = useState({});
    const [sectionPicks, setSecChoices] = useState([]);
    const [classObject, setClassObject] = useState({});
    const [isSelected, setIsSelected] = useState(false);

    const [priority, setPriority] = useState(1);
    const [favorite, setFav] = useState(true);
    const [show, setShow] = useState(false);
    
    const handleShow = () => setShow(true);

    useEffect(() => {
        // get data from API
        fetch('course/course=' + classNum)
        .then(res => res.json())
        .then(data => {
            setClassData(data);
            // make classObject
            console.log(data)
            var classObj = {};
            classObj.num = data['num'];
            classObj.title = data['dep'].toUpperCase() + ' ' + data['code'];
            classObj.unit = data['credits'];
            classObj.days = data['day'];
            classObj.start = data['start'];
            classObj.end = data['end'];
            var days = shortenDays(classObj.days);
            var start = timeToString(classObj.start);
            var end = timeToString(classObj.end);
            classObj.dayTime = (days && start && end) ?
            days + ' ' + start + ' - ' + end :
            '';
            classObj.priority = priority;
            var sections = data['sections'].map(section => {
                var sectionObj = {};
                sectionObj.num = parseInt(section['num'], 10);
                sectionObj.title = section['secName'];
                sectionObj.days = section['day'];
                sectionObj.start = section['start'];
                sectionObj.end = section['end'];
                var sDays = shortenDays(sectionObj.days);
                var sStart = timeToString(sectionObj.start);
                var sEnd = timeToString(sectionObj.end);
                sectionObj.dayTime = (sDays && sStart && sEnd) ?
                    sDays + ' ' + sStart + ' - ' + sEnd :
                    '';
                return sectionObj;
            });
            classObj.sections = sections;
            setClassObject(classObj);
            var sectionNums = data['sections'].map(section => {
                return parseInt(section['num'], 10);
            });
            setSecChoices(sectionNums);
        })
        .catch(() => {
            console.error("classNum API call not responding")
            return;
        });
    }, [classNum, priority]);

    // updates selected classes
    const handleSelect = () => {
        if (isSelected) {
            setIsSelected(false);
            handleSelectedClasses('rm', classObject);
        }
        else {
            setIsSelected(true);
            handleSelectedClasses('add', classObject);
        }
    }

    // updates class object when priority is updated
    const handlePriority = (e) => {
        var numPriority = parseInt(e.target.value, 10);
        setPriority(numPriority);
        var classObj = classObject;
        classObj.priority = numPriority;
        setClassObject(classObj);
        if (isSelected) {
            handleSelectedClasses('mod', classObj);
        }
    }

    // updates sections in class object
    const handleSections = (sections) => {
        setSecChoices(sections);
        // filter sections in class object
        var classObj = classObject;
        var cSections = classObj.sections;
        cSections = cSections.filter(section => sections.indexOf(section['num']) !== -1);
        classObj.sections = cSections;
        setClassObject(classObj);
        // update selected classes
        if (isSelected) {
            handleSelectedClasses('mod', classObj);
        }
    }

    // TODO: fix firestore
    // const { addToFavorList, removeFromFavorList } = useAuth();
    const handleFav = () => {
        var newFavList = []
        if (favorite) {
            // make new favorites list
            newFavList = favList;
            const index = newFavList.indexOf(classData['num']);
            if (index > -1) {
                newFavList.splice(index, 1);
            }
            // set values for hooks and firestore
            setFav(false);
            // removeFromFavorList(classData['num']);
            setFavList(newFavList);
        }
        else {
            // make new favorites list
            newFavList = favList;
            newFavList.push(classData['num']);
            // set values for hooks and firestore
            setFav(true);
            // addToFavorList(classData['num']);
            setFavList(newFavList);
        }
    };

    // check if data has been updated
    if (classData['num']) {
        // class title (ex: CSE 101-01)
        var classTitle = classData['dep'].toUpperCase() + ' ' + classData['code'];
        if (classData['classSection'] !== '01') classTitle += '-' + classData['classSection'];
        // class day time info
        var classDay = shortenDays(classData['day']);
        var classStart = timeToString(classData['start']);
        var classEnd = timeToString(classData['end']);
        var classDayTime = (classDay && classStart && classEnd) ?
            classDay + ' ' + classStart + ' - ' + classEnd :
            '';
    }

    return (
        <Card className="class-card">
            <Card.Body className='class-card-body'>
                <Row>
                    <Col sm={1}>
                        <label className='checkbox-container'>
                            <input type="checkbox"/>
                            <span className="checkmark" onClick={handleSelect}></span>
                        </label>
                    </Col>
                    <Col sm={7}>
                        <Card.Title>
                            <b>{classTitle}</b> {classData['name']}
                        </Card.Title>
                        <Card.Text>
                            {classDayTime !== '' && classDayTime}
                            {classDayTime === '' && <i>No listed day or time</i>}
                        </Card.Text>
                        <Card.Link onClick={handleShow} className='more-class-info'>
                            Choose sections...
                        </Card.Link>
                    </Col>
                    <Col sm={2} className='priority-container'>
                        {/* note: findDOMNode warning is in the react-bootstrap library */}
                        <OverlayTrigger
                            placement='top'
                            overlay={
                                <Tooltip>
                                    Priority: 1 (highest) - 5 (lowest)
                                </Tooltip>
                            }
                        >
                            <Form.Control className='priority-dropdown' as="select" value={priority} onChange={handlePriority}>
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </Form.Control>
                        </OverlayTrigger>
                    </Col>
                    <Col sm={2} className='star-container'>
                        {favorite &&
                        <StarFill className='star' width={'40'} height={'40'} onClick={handleFav}/>
                        }
                        {!favorite &&
                        <Star className='star' width={'40'} height={'40'} onClick={handleFav}/>
                        }
                    </Col>
                </Row>
            </Card.Body>
            <GenerateSectionsModal classData={classData} show={show} setShow={setShow} sectionPicks={sectionPicks} handleSections={handleSections}/>
        </Card>
    );
}

export default GenerateClassCard;