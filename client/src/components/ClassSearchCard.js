import React, { useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { StarFill, Star } from "react-bootstrap-icons";
import ClassSearchModal from './ClassSearchModal';
import { shortenDays, timeToString } from '../utils/format';
// import { useAuth } from '../contexts/AuthContext';
import '../style/ClassSearchCard.css';

function ClassSearchCard({ classData, isFav, favList, setFavList }) {

    const [favorite, setFav] = useState(isFav);
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

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
                    <Col sm={10}>
                        <Card.Title>
                            <b>{classTitle}</b> {classData['name']}
                        </Card.Title>
                        <Card.Text>
                            {classDayTime !== '' && classDayTime}
                            {classDayTime === '' && <i>No listed day or time</i>}
                        </Card.Text>
                        <Card.Link onClick={handleShow} className='more-class-info'>
                            More class information...
                        </Card.Link>
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
            <ClassSearchModal classData={classData} show={show} setShow={setShow}/>
        </Card>
    );
}

export default ClassSearchCard;