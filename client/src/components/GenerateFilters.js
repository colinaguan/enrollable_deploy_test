import React, { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import '../style/GenerateFilters.css'
import Alert from "react-bootstrap/Alert";

function GenerateFilters({
        minUnits,
        setMinUnits,
        maxUnits,
        setMaxUnits,
        addConstraint,
        filterError
    }) {

    const [date, pickDate] = useState('Monday');
    const [firstTime, pickFirstTime] = useState('');
    const [secondTime, pickSecondTime] = useState('');

    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(filterError);
    }, [filterError]);

    const onSubmit = (e) => {
        e.preventDefault();
        addConstraint(date, firstTime, secondTime);
    }

    return (
        <Form className='generate-filter-form' onSubmit={onSubmit}>
            <Form.Row>
                <Form.Group as={Col} sm={6} controlId="formMinUnit">
                    <Form.Label>Minimum Units</Form.Label>
                    <Form.Control className='filter-minUnit-dropdown' type="text" value={minUnits} onChange={(e)=>setMinUnits(e.target.value)}>
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} sm={6} controlId="formMaxUnit">
                    <Form.Label>Maximum Units</Form.Label>
                    <Form.Control className='filter-maxUnit-dropdown' type="text" value={maxUnits} onChange={(e)=>setMaxUnits(e.target.value)}>
                    </Form.Control>
                </Form.Group>
            </Form.Row>
            <Form.Row>
                <Form.Group as={Col} sm={5} controlId="formDatePick">
                    <Form.Label>Avoid Times on Day</Form.Label>
                    <Form.Control className='filter-date-picker' as="select" value={date} onChange={(e)=>pickDate(e.target.value)}>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} sm={3} controlId="firstTime">
                    <Form.Label>From</Form.Label>
                    <Form.Control className='first-time-picker' type="time" value={firstTime} onChange={(e)=>pickFirstTime(e.target.value)}/>
                </Form.Group>
                <Form.Group as={Col} sm={3} controlId="secondTime">
                    <Form.Label>To</Form.Label>
                    <Form.Control className='second-time-picker' type="time" value={secondTime} onChange={(e)=>pickSecondTime(e.target.value)}/>
                </Form.Group>
                <Form.Group as={Col} sm={1} className="filters-button" controlId="formFavorites">
                    <Button variant="purple" className="add-button" type="submit">
                        Add
                    </Button>
                </Form.Group>
            </Form.Row>
            <Alert show={show} variant="danger">
                <Alert.Heading>Please type in number again</Alert.Heading>
                <p>
                    Invalid Min and Max Units: minimum units should be less than or equal to the maximum units
                </p>
            </Alert>
        </Form>
    );
}


export default GenerateFilters;