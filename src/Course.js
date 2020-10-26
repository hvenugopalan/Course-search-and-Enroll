import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import { Button, Container, Row, Col, Badge } from 'react-bootstrap';
class Course extends React.Component {



  renderRequisites(requisites) {
    let content = [];
    if (requisites.length === 0 || !requisites)
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

  render() {
    return (
      <div>
        <Card style={{ borderRight: this.props.isSelected === 'true' ? "5px solid red" : "5px solid white" }}>
          <Card.Header>
            <Container >
              <Row>
                <Col xs={7} className="c-pointer" onClick={() => this.props.showInfo(this.props.data)}>
                  <div>
                    <b>{this.props.data.number}</b>
                  </div>
                </Col>
                <Col >
                  <Badge pill variant="secondary" className="f-right">{this.props.data.credits} Credits</Badge>
                </Col>
              </Row>
              <Row>
                <Col xs={7} className="c-pointer" onClick={() => this.props.showInfo(this.props.data)}>
                  {this.props.data.name}
                </Col>
                <Col>
                  <Button variant="outline-secondary" className="f-right" onClick={() => this.props.cartMode ?
                    this.editCart({}, 'remove')
                    : this.editCart({}, 'add')}>
                    {this.props.cartMode ? 'Remove Course' : 'Add Course'}
                  </Button>
                </Col>
              </Row>

            </Container>
          </Card.Header>
        </Card>
      </div>
    )
  }
}

export default Course;
