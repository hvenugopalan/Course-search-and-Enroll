import React from 'react'
import { Container, Row, Col, Badge } from 'react-bootstrap';

class Time extends React.Component {

    renderTimes(times) {
        let content = [];

        if (times["monday"])
            content.push(<Col key="m"><Badge pill variant="success">M</Badge> {times["monday"]}</Col>);
        else
            content.push(<Col key="m"><Badge pill variant="secondary">M</Badge></Col>)

        if (times["tuesday"])
            content.push(<Col key="t"><Badge pill variant="success">T</Badge> {times["tuesday"]}</Col>);
        else
            content.push(<Col key="t"><Badge pill variant="secondary">T</Badge></Col>);

        if (times["wednesday"])
            content.push(<Col key="w"><Badge pill variant="success">W</Badge> {times["wednesday"]}</Col>);
        else
            content.push(<Col key="w"><Badge pill variant="secondary">W</Badge></Col>);

        if (times["thursday"])
            content.push(<Col key="r"><Badge pill variant="success">R</Badge> {times["thursday"]}</Col>);
        else
            content.push(<Col key="r"><Badge pill variant="secondary">R</Badge></Col>);

        if (times["friday"])
            content.push(<Col key="f"><Badge pill variant="success">F</Badge> {times["friday"]}</Col>);
        else
            content.push(<Col key="f"><Badge pill variant="secondary">F</Badge></Col>);

        return content;
    }

    render() {

        return (
            <Container>
                <Row>
                    {this.renderTimes(this.props.data)}
                </Row>
            </Container>
        );
    }
}

export default Time;
