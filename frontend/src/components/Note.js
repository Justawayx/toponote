import React from 'react';
import './Note.css';
import Card from 'react-bootstrap/Card'

const Note = (props) => {
    console.log("note props: " + props);
    return (
        <Card style={{ width: '18rem' }}>
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>Card Text: <div dangerouslySetInnerHTML={{__html: props.body}}/> </Card.Text>
                <br/>
                <Card.Text>Tags: {props.tags}</Card.Text>
                <Card.Text>Prerequisite Knowledge: {props.prereqs}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Note;