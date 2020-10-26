import React from 'react';
import './App.css';
import SearchAndFilter from './SearchAndFilter';
import { Card, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.searchAndFilter = new SearchAndFilter();
    this.subject = React.createRef();
    this.minimumCredits = React.createRef();
    this.maximumCredits = React.createRef();
    this.search = React.createRef();
    this.interestArea = React.createRef();
    this.state = { showCreditRangeError: false };
  }

  setCourses() {
    if (this.maximumCredits.current.value < this.minimumCredits.current.value)
      this.setState({ showCreditRangeError: true });
    else
      this.setState({ showCreditRangeError: false });
    this.props.setCourses(this.searchAndFilter.searchAndFilter(this.props.courses, this.search.current.value, this.subject.current.value, this.minimumCredits.current.value, this.maximumCredits.current.value, this.interestArea.current.value));
  }

  handleCreditsKeyDown(e) {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab'].indexOf(e.key) === -1)
      e.preventDefault();
  }

  getSubjectOptions() {
    let subjectOptions = [];

    for (const subject of this.props.subjects) {
      subjectOptions.push(<option key={subject}>{subject}</option>);
    }

    return subjectOptions;
  }

  getInterestAreaOptions() {
    let interestAreaOptions = [];
    for (let area of this.props.interestAreas) {
      interestAreaOptions.push(<option key={area}>{area}</option>);
    }
    return interestAreaOptions;
  }



  render() {
    const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        Search for courses with specific keywords
      </Tooltip>
    )

    return (
      <>
        <Card style={{ width: 'calc(20vw - 5px)', marginLeft: '5px', height: 'calc(100vh - 10px)', position: 'fixed' }}>
          <Card.Body>
            <Card.Title>Search and Filter</Card.Title>
            <Form>
              <Form.Group controlId="formKeywords" onChange={() => this.setCourses()} style={{ width: '100%' }}>
                <Form.Label>
                  Search
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                  >
                    <i className="fa fa-info-circle"></i>
                  </OverlayTrigger>
                </Form.Label>
                <Form.Control type="text" placeholder="Search" autoComplete="off" ref={this.search} />
              </Form.Group>

              <Form.Group controlId="formSubject">
                <Form.Label>Subject</Form.Label>
                <Form.Control as="select" ref={this.subject} onChange={() => this.setCourses()}>
                  {this.getSubjectOptions()}
                </Form.Control>
              </Form.Group>

              <Form.Group controlId="formInterestAreas">
                <Form.Label>Interest Area</Form.Label>
                <Form.Control as="select" ref={this.interestArea} onChange={() => this.setCourses()}>
                  {this.getInterestAreaOptions()}
                </Form.Control>
              </Form.Group>

              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Form.Group controlId="minimumCredits" onChange={() => this.setCourses()} onKeyDown={(e) => this.handleCreditsKeyDown(e)}>
                  <Form.Label>Credits</Form.Label>
                  <Form.Control type="text" placeholder="minimum" autoComplete="off" ref={this.minimumCredits} />
                </Form.Group>
                <div style={{ marginLeft: '5px', marginRight: '5px', marginTop: '38px' }}>to</div>
                <Form.Group controlId="maximumCredits" style={{ marginTop: '32px' }} onChange={() => this.setCourses()} onKeyDown={(e) => this.handleCreditsKeyDown(e)}>
                  <Form.Control type="text" placeholder="maximum" autoComplete="off" ref={this.maximumCredits} />
                </Form.Group>
              </div>
              {this.state.showCreditRangeError && <div className="red" >Please enter a valid range of credits.</div>}
            </Form>
          </Card.Body>
        </Card>
      </>
    )
  }
}

export default Sidebar;
