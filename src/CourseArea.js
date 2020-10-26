import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './App.css';
import Course from './Course';
import CourseInfo from './CourseInfo';

class CourseArea extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedCourse: {},
      heightSet: {}
    };

  }


  editCart(attribute, attributeName, actionType) {
    this.props.editCart(attribute, attributeName, actionType);
  }

  showInfo(course) {
    this.setState({ selectedCourse: course });
  }

  getCourses() {
    let courses = [];

    for (const course of Object.values(this.props.data)) {
      courses.push(
        <Course
          key={course.name}
          data={course}
          editCart={(attribute, attributeName, actionType) => this.editCart(attribute, attributeName, actionType)}
          showInfo={(course) => { this.showInfo(course) }}
          cartMode={this.props.cartMode}
          isSelected={course.name !== this.state.selectedCourse?.name ? 'false' : 'true'} />
      )
    }

    return courses;
  }

  // componentDidMount() {
  //   if (this.isEmpty(this.state.selectedCourse))
  //     this.setState({ selectedCourse: this.props.data[0] });
  // }

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

    return true;
  }

  render() {
    return (
      <Container className="m-2">
        <Row>
          <Col className="v-scroll" xs={12} md={5} lg={5}>
            <div style={{ margin: '5px' }}>
              {this.getCourses()}
            </div>
          </Col>
          <Col className="v-scroll" xs={12} md={7} lg={7}>
            <CourseInfo
              key={!this.isEmpty(this.state.selectedCourse) ? this.state.selectedCourse.name : 'emptyCourse'}
              data={!this.isEmpty(this.props.data) ? (this.props.data.length === 1 ? this.props.data[0] : this.state.selectedCourse) : this.props.data}
              editCart={(attribute, attributeName, actionType) => this.editCart(attribute, attributeName, actionType)}
              cartMode={this.props.cartMode}
              cartCourses={this.props.cartCourses} />
          </Col>
        </Row>

      </Container>

    )
  }
}

export default CourseArea;
