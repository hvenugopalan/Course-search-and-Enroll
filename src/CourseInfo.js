import React from 'react'
import { Card } from 'react-bootstrap'
import './App.css'
import Section from './Section.js'
import { Container, Row, Col, Badge } from 'react-bootstrap'


class CourseInfo extends React.Component {
    renderRequisites(requisites) {
        let content = [];
        if (!requisites || requisites?.length === 0)
            return 'None';
        for (let i = 0; i < requisites.length; i++) {
            content.push('(');
            for (let j = 0; j < requisites[i].length; j++) {
                content.push(requisites[i][j]);
                if (j < requisites[i].length - 1)
                    content.push(' OR ');
            }
            content.push(')');
            if (i < requisites.length - 1)
                content.push(' AND ');
        }
        return content;
    }


    editCart(attributes, actionType) {
        attributes['courseName'] = this.props.data.name;
        this.props.editCart(attributes, actionType);
    }

    isEmpty(obj) {
        let hasOwnProperty = Object.prototype.hasOwnProperty;
        // null and undefined are "empty"
        if (obj == null) return true;

        // Assume if it has a length property with a non-zero value
        // that that property is correct.
        if (obj.length > 0) return false;
        if (obj.length === 0) return true;

        // If it isn't an object at this point
        // it is empty, but it can't be anything *but* empty
        // Is it empty?  Depends on your application.
        if (typeof obj !== "object") return true;

        // Otherwise, does it have any properties of its own?
        // Note that this doesn't handle
        // toString and valueOf enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
    }

    render() {
        if (!this.isEmpty(this.props.data.name))
            return (
                <Card border="danger" >
                    <Card.Header >
                        <Container >
                            <Row>
                                <Col>
                                    <div>
                                        <b>{this.props.data.number}</b>
                                    </div>
                                </Col>
                                <Col >
                                    <Badge pill variant="secondary" className="f-right">{this.props.data.credits} Credits</Badge>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    {this.props.data.name}
                                </Col>
                                <Col>

                                </Col>
                            </Row>

                        </Container>
                    </Card.Header>
                    <Card.Body>
                        <h6>Subject: {this.props.data.subject}</h6>
                        <p className="description">{this.props.data.description}</p>
                        <h6>Requisites:
                            <span className="description">{this.renderRequisites(this.props.data.requisites)}</span>
                        </h6>
                        <h6><u>Keywords:</u> <span className="description">{this.props.data?.keywords?.join(',')}</span></h6>
                        <br></br>
                        <br></br>
                        <h5>Sections</h5>
                        {this.props.data?.sections?.map((section) => (
                            <Section
                                key={section.number}
                                data={section}
                                cartMode={this.props.cartMode}
                                editCart={(attributes, actionType) => this.editCart(attributes, actionType)}>
                            </Section>
                        ))}
                    </Card.Body>

                </Card >
            );
        else
            return (<p> Select a course to display information.</p >);
    }
}

export default CourseInfo;