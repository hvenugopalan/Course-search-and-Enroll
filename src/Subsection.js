import React from 'react'
import './App.css'
import { Button, Accordion, Card, Container, Row, Col, Badge } from 'react-bootstrap'
import Time from './Time.js'

class Subsection extends React.Component {

	editCart(attributes, actionType) {
		this.props.editCart(attributes, actionType);
	}

	render() {
		return (
			<Accordion>
				<Card>
					<Accordion.Toggle as={Card.Header} eventKey="0">
						<Container>
							<Row>
								<Col xs={7} className="c-pointer">
									<Row>
										<Col><h6>{this.props.data.number}</h6></Col>

									</Row>
									<Row className="c-pointer">
										<Col>
											<div >
												<i className="fa fa-building"> </i> {this.props.data.location}
											</div>
										</Col>
									</Row>
								</Col>
								<Col >
									<Button variant="outline-secondary" className="f-right" onClick={() => this.props.cartMode ?
										this.editCart({ 'subSectionNumber': this.props.data.number }, 'remove')
										: this.editCart({ 'subSectionNumber': this.props.data.number }, 'add')}>
										{this.props.cartMode ? 'Remove Subsection' : 'Add Subsection'}
									</Button>
								</Col>
							</Row>

						</Container>
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="0">
						<Card.Body>
							<Time data={this.props.data.time}></Time>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>


		)
	}
}

export default Subsection;