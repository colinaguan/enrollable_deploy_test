import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { shortenDays, timeToString } from '../utils/format';
import '../style/GenerateAvoidTimeLabel.css';

function GenerateAvoidTimeLabel({ days, start, end, removeConstraint }){

    const onClick = (e) => {
        e.preventDefault();
        removeConstraint(days, start, end);
    }

    return (
        <OverlayTrigger
            placement="top"
            overlay={
                <Tooltip>
                    Click to delete constraint
                </Tooltip>
            }
        >
            <Button variant="outline-purple" className="constraint-btn" onClick={onClick}>
                {shortenDays(days)} {timeToString(start)}-{timeToString(end)}
            </Button>
        </OverlayTrigger>
    )
}

export default GenerateAvoidTimeLabel;