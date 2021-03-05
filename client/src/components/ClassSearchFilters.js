import React from 'react';
import { Form, Button, Col } from "react-bootstrap";
import '../style/ClassSearchFilters.css';
import { toTitleCase } from '../utils/format';

function ClassSearchFilters({
    dep,
    ge,
    type,
    fDep,
    setFDep,
    fGE,
    setFGE,
    fType,
    setFType,
    fFav,
    setFFav,
    handleFilters
}) {

    // create option elements from props
    var depOptions = Object.keys(dep).map((key) => {
        return <option key={key} value={key}>{dep[key]}</option>;
    });
    var geOptions = ge.map((elem) => {
        return <option key={elem} value={elem}>{elem}</option>;
    });
    var typeOptions = type.map((elem) => {
        return <option key={elem} value={elem}>{toTitleCase(elem)}</option>;
    });
    
    return (
        <Form className='search-filter-form' onSubmit={handleFilters}>
            <Form.Row>
                <Form.Group as={Col} sm={3} controlId="formDepartment">
                    <Form.Label>Department</Form.Label>
                    <Form.Control className='filter-dropdown' as="select" value={fDep} onChange={(e) => setFDep(e.target.value)}>
                        <option value='any'>Any Department</option>
                        {depOptions}
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} sm={2} controlId="formGE">
                    <Form.Label>GE</Form.Label>
                    <Form.Control className='filter-dropdown' as="select" value={fGE} onChange={(e) => setFGE(e.target.value)}>
                        <option value='any'>Any GE</option>
                        {geOptions}
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} sm={3} controlId="formClassType">
                    <Form.Label>Class Type</Form.Label>
                    <Form.Control className='filter-dropdown' as="select" value={fType} onChange={(e) => setFType(e.target.value)}>
                        <option value='any'>Any Class Type</option>
                        {typeOptions}
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} sm={3} controlId="formFavorites">
                    <Form.Label>Favorites</Form.Label>
                    <Form.Control className='filter-dropdown' as="select" value={fFav} onChange={(e) => setFFav(e.target.value)}>
                        <option value='any'>All Classes</option>
                        <option value='fav'>My Favorites</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} sm={1} className='filters-button' controlId="formFavorites">
                    <Button variant="purple" type="submit">
                        Search
                    </Button>
                </Form.Group>
            </Form.Row>
        </Form>
    );
}

export default ClassSearchFilters;