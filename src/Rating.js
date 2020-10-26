import React from 'react'
import { Form } from 'react-bootstrap';

class Rating extends React.Component {

    constructor(props) {
        super(props);
        this.rating = React.createRef();

    }

    setRating() {
        this.props.setRating(this.rating.current.value);
    }

    render() {
        return (

            <Form>
                <Form.Group controlId="form">
                    <Form.Label>Rating</Form.Label>
                    <Form.Control as="select" ref={this.rating} onChange={() => this.setRating()}>
                        <option value='0'>No rating</option>
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                    </Form.Control>
                </Form.Group>
            </Form >

        );
    }
}

export default Rating;
