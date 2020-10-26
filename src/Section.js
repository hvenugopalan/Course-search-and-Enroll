import React from 'react'
import './App.css'
import Subsection from './Subsection.js'
import { Button, Accordion, Card, Container, Row, Col } from 'react-bootstrap'
import Time from './Time.js'

class Section extends React.Component {

	editCart(attributes, actionType) {
		attributes['sectionNumber'] = this.props.data.number;
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
									<Row><Col><h6>{this.props.data.number}</h6></Col></Row>
									<Row>
										<Col>
											<div>
												<i className="fa fa-user"> </i> {this.props.data.instructor}
											</div>

											<div >
												<i className="fa fa-building"> </i> {this.props.data.location}
											</div>
										</Col>
									</Row>
								</Col>
								<Col >
									<Button variant="outline-secondary" className="f-right" onClick={() => this.props.cartMode ?
										this.editCart({}, 'remove')
										: this.editCart({}, 'add')}>
										{this.props.cartMode ? 'Remove Section' : 'Add Section'}
									</Button>
								</Col>
							</Row>

						</Container>
					</Accordion.Toggle>
					<Accordion.Collapse eventKey="0">
						<Card.Body>
							<div>
								<Time data={this.props.data.time}></Time>
								<br></br>
								<br></br>
								{this.props.data.subsections.length > 0 ? <h6>Subsections</h6> : ''}
								{this.props.data.subsections.length > 0 ? this.props.data.subsections.map((subsection) => (
									<Subsection
										key={subsection.number}
										data={subsection}
										cartMode={this.props.cartMode}
										editCart={(attributes, actionType) => this.editCart(attributes, actionType)}>
									</Subsection>
								)) : ''}
							</div>
						</Card.Body>
					</Accordion.Collapse>
				</Card>
			</Accordion>

		)
	}
}

export default Section;