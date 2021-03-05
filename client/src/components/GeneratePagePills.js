import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import '../style/GeneratePagePill.css';

function GeneratePagePills({ numPages, schedulesPerPage, defaultPill, updateScheduleCards }) {
    const [currentPill, setCurrentPill] = useState(parseInt(defaultPill, 10));

    const onClick = (e) => {
        e.preventDefault();
        const newPill = parseInt(e.target.id, 10);
        // update schedule cards
        const start = newPill * schedulesPerPage - schedulesPerPage;
        const end = newPill * schedulesPerPage - 1;
        updateScheduleCards(start, end);
        // change selected pill
        setCurrentPill(newPill);
    }

    // create all buttons
    var pagePills = [];
    for (var page = 1; page <= numPages; page++) {
        // current pill is filled button
        if (page === currentPill)
            pagePills.push(
                <Col md="auto" key={page}>
                    <Button id={page} variant="purple">{page}</Button>
                </Col>
            );
        // other pills are outlined buttons
        else
            pagePills.push(
                <Col md="auto" key={page}>
                    <Button id={page} variant="outline-purple" onClick={onClick}>{page}</Button>
                </Col>
            )
    }

    return (
        <Row className="page-pill-container">
            {pagePills}
        </Row>
    );
}

export default GeneratePagePills;