import React from 'react'
import { Container, Card, Row, Col, Badge } from 'react-bootstrap'
import Course from './Course';
import Rating from './Rating'

class CompletedCourse extends React.Component {


    constructor(props) {
        super(props);
        this.state = { ratedCourses: {} };
        //this.getCourses = this.getCourses.bind(this);
    }


    setRatedCourses(courseNumber, rating) {
        let ratedCoursesCopy = JSON.parse(JSON.stringify(this.state.ratedCourses));
        ratedCoursesCopy[courseNumber] = rating;
        this.setState({ ratedCourses: ratedCoursesCopy });
        this.props.setRatedCourses(ratedCoursesCopy);
    }

    getCourses() {
        let courses = [];
        for (const course of Object.values(this.props.allData)) {
            if (this.props.data.some((completedCourseNumber) => course.number === completedCourseNumber))
                courses.push(
                    <Row>
                        <Col xs={12} md={5} lg={5}>
                            <Card>
                                <Card.Header>
                                    <Container>
                                        <Row>
                                            <Col><b>{course.number}</b></Col>
                                            <Col>
                                                <Badge pill variant="secondary" className="f-right">{course.credits} Credits</Badge>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>{course.name}</Col>
                                            <Col></Col>
                                        </Row>
                                    </Container>
                                </Card.Header>
                                <Card.Body>
                                    <Container>
                                        <Row>
                                            <Col xs={12} md={12} lg={12}>
                                                <Rating setRating={(rating) => this.setRatedCourses(course.number, rating)}></Rating>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row >

                )
        }
        return courses;
    }

    render() {

        return (
            <div className="m-2">
                <Container>
                    {this.getCourses()}

                </Container>
            </div>
        );
    }
}

export default CompletedCourse;
