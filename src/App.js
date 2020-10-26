import React from 'react'
import './App.css'
import { Tabs, Badge, Tab, Button, Modal } from 'react-bootstrap'
import Sidebar from './Sidebar'
import CourseArea from './CourseArea'
import CompletedCourse from './CompletedCourse'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: {},
      filteredCourses: {},
      subjects: [],
      cartCourses: [],
      completedCourses: [],
      interestAreas: [],
      ratedCourses: {},
      recommendedCourses: [],
      key: "search",
      errorMessage: ""
    };
    this.handleSelect = this.handleSelect.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  async componentDidMount() {
    await fetch('http://mysqlcs639.cs.wisc.edu:53706/api/react/classes').then(
      res => res.json()
    ).then(data => this.setState({
      allCourses: data, filteredCourses: data,
      subjects: this.getSubjects(data), interestAreas: this.getInterestAreas(data)
    }));

    await fetch('http://mysqlcs639.cs.wisc.edu:53706/api/react/students/5022025924/classes/completed').then(
      res => res.json()
    ).then(d => { this.setState({ completedCourses: d.data }); });
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for (const course of Object.values(data)) {
      if (subjects.indexOf(course.subject) === -1)
        subjects.push(course.subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({ filteredCourses: courses });
  }

  setRatedCourses(courses) {
    this.setState({ ratedCourses: courses });
    this.setRecommendedCourses(courses);
  }

  setRecommendedCourses(courses) {
    //sort rated courses in desc order
    let ratedCourses = [], recommendedCourses = [];
    for (let course in courses) {
      if (courses[course] != 0)
        ratedCourses.push([course, courses[course]])
    }
    ratedCourses.sort(function (a, b) { return a[1] - b[1] });
    ratedCourses.reverse();

    //set recommended courses based on the courses given the highest rating
    for (let i = 0; i < ratedCourses.length; i++) {
      if (ratedCourses[i][1] === ratedCourses[0][1]) {
        let course = this.state.allCourses.filter((course) => course.number === ratedCourses[i][0])[0];
        let similarCourses = JSON.parse(JSON.stringify(this.state.allCourses.filter((c) => c.keywords.some(keyword => course.keywords.includes(keyword)))));
        similarCourses = similarCourses.filter((c) => !this.state.completedCourses.some((cc) => cc === c.number));
        similarCourses = similarCourses.filter((c) => !recommendedCourses.some((rc) => rc.number === c.number));
        recommendedCourses.push.apply(recommendedCourses, similarCourses);
      }

    }
    this.setState({ recommendedCourses: recommendedCourses });


  }

  getInterestAreas(data) {
    let interestAreas = [];
    interestAreas.push("All");
    for (const course of Object.values(data)) {
      course.keywords.forEach((keyword) => {
        if (interestAreas.indexOf(keyword) === -1)
          interestAreas.push(keyword);
      });
      // if (interestAreas.indexOf(course.subject) === -1)
      //   interestAreas.push(course.subject);
    }
    return interestAreas;
  }

  satisfiesRequisite(course) {
    let isRequisiteSatisfied = false;
    if (course.requisites.length === 0 || !course.requisites)
      return true;
    for (let i = 0; i < course.requisites.length; i++) {
      if (!course.requisites[i].some((r) => this.state.completedCourses.includes(r)))
        return false;
    }
    return true;
  }

  handleSelect(tabKey) {
    this.setState({ key: tabKey });
  }

  async editCart(attributes, actionType) {

    let courses = this.state.cartCourses;

    if (actionType === "add") {
      let courseToAdd = {};

      //when course not added to cart
      if (!courses.some((course) => course.name === attributes['courseName'])) {
        courseToAdd = JSON.parse(JSON.stringify(this.state.filteredCourses.filter((course) => course.name === attributes['courseName'])[0]));

        //add only a specific section
        if (attributes['sectionNumber'] != null) {
          courseToAdd.sections = courseToAdd.sections.filter((section) => section.number === attributes['sectionNumber']);
        }

        //add only a specific subsection
        if (attributes['subSectionNumber'] != null) {
          courseToAdd.sections[0].subsections = courseToAdd.sections[0].subsections.filter((subSection) =>
            subSection.number === attributes['subSectionNumber']);
        }

        //alert user if they have taken the course already or do not meet the requisites
        if (this.state.completedCourses.some((cc) => cc === courseToAdd.number))
          this.setState({ errorMessage: 'You have already taken the course ' + courseToAdd.number + ' !', show: true });
        else if (!this.satisfiesRequisite(courseToAdd))
          this.setState({ errorMessage: 'You do not satisfy the requisites for ' + courseToAdd.number + ' !', show: true });
        courses.push(courseToAdd);
      }

      //when course added to cart but may not contain all sections or subsections
      else {
        courseToAdd = JSON.parse(JSON.stringify(courses.filter((course) => course.name === attributes['courseName'])[0]));
        let courseFromSearch = JSON.parse(JSON.stringify(this.state.filteredCourses.filter((course) => course.name === attributes['courseName'])[0]));

        //add only a specific section or subsection
        if (attributes['sectionNumber'] != null) {
          //When cart contains the section to be added
          if (courseToAdd.sections.some((section) => section.number === attributes['sectionNumber'])) {

            let sectionFromSearch = courseFromSearch.sections.filter((sectionFromSearch) => sectionFromSearch.number === attributes
            ['sectionNumber'])[0];
            let sectionFromCart = courseToAdd.sections.filter((section) => section.number === attributes['sectionNumber'])[0];

            if (attributes['subSectionNumber'] == null)

              //alert user if the section and all subsections within it already exists in cart
              if (sectionFromSearch.subsections.every((subsectionFromSearch) => sectionFromCart.subsections.some((subSection) => subSection.number === subsectionFromSearch.number)))
                this.setState({ errorMessage: 'Section already added to cart.', show: true });
              else {
                //else add remaining subsections to cart
                let subSectionsDiff = sectionFromSearch.subsections.filter((subSectionFromSearch) => !sectionFromCart.subsections.some((subSection) => subSection.number === subSectionFromSearch.number));
                sectionFromCart.subsections.push.apply(sectionFromCart.subsections, subSectionsDiff);
              }
          }
          else {
            //add the section to cart
            courseToAdd.sections.push(courseFromSearch.sections.filter((section) => section.number === attributes['sectionNumber'])[0]);
          }
        }
        //add full course to cart
        else if (attributes['courseName'] != null) {
          //alert user if full course already exists in cart
          if (courseFromSearch.sections.every((section) => courseToAdd.sections.some((sectionFromSearch) => section.number === sectionFromSearch.number)))
            this.setState({ errorMessage: 'Course already added to cart', show: true });
          else {
            //add remaining sections that have not yet been added
            let sectionsDiff = courseFromSearch.sections.filter((sectionFromSearch) => !courseToAdd.sections.some((section) => section.number === sectionFromSearch.number));
            courseToAdd.sections.push.apply(courseToAdd.sections, sectionsDiff);
          }

        }

        //add subsection
        if (attributes['subSectionNumber'] != null) {
          let section = courseToAdd.sections.filter((section) => section.number === attributes['sectionNumber'])[0];
          if (section.subsections.some((subSection) => subSection.number === attributes['subSectionNumber']))
            this.setState({ errorMessage: 'Subsection already added to cart.', show: true });
          else {
            let sectionFromSearch = courseFromSearch.sections.filter((section) => section.number === attributes['sectionNumber'])[0];
            let subsectionFromSearch = sectionFromSearch.subsections.filter((subsection) => subsection.number === attributes['subSectionNumber'])[0];
            section.subsections.push(subsectionFromSearch);
          }
        }

        courses = courses.filter((course) => course.name !== attributes['courseName']);

        //alert user if they have taken the course already or do not meet the requisites
        if (this.state.completedCourses.some((cc) => cc === courseToAdd.number))
          this.setState({ errorMessage: 'You have already taken the course ' + courseToAdd.number + ' !', show: true });
        else if (!this.satisfiesRequisite(courseToAdd))
          this.setState({ errorMessage: 'You do not satisfy the requisites for ' + courseToAdd.number + ' !', show: true });
        courses.push(courseToAdd);

      }
      await this.setState({ cartCourses: courses });
    }
    else if (actionType === "remove") {
      let courses = this.state.cartCourses;
      let courseToRemove = {};

      //if course exists
      if (courses.some((course) => course.name === attributes['courseName'])) {
        courseToRemove = courses.filter((course) => course.name === attributes['courseName'])[0];

        //remove subsection
        if (attributes['subSectionNumber'] != null) {
          let section = courseToRemove.sections.filter((section) => section.number === attributes['sectionNumber'])[0];
          section.subsections = section.subsections.filter((subSection) =>
            subSection.number !== attributes['subSectionNumber']);
          if (section.subsections == null || section.subsections?.length === 0)
            courseToRemove.sections = courseToRemove.sections.filter((sec) => section.number !== sec.number);
        }
        //or remove section
        else if (attributes['sectionNumber'] != null) {
          courseToRemove.sections = courseToRemove.sections.filter((section) => section.number !== attributes['sectionNumber']);
        }
        // or remove full course
        courses = courses.filter((course) => course.name !== attributes['courseName']);
        if ((attributes['sectionNumber'] != null || attributes['subSectionNumber'] != null) &&
          (courseToRemove.sections?.length > 0))
          courses.push(courseToRemove);

      }
      await this.setState({ cartCourses: courses });
    }
  }

  handleClose() {
    this.setState({ show: false });
  }

  render() {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Tabs defaultActiveKey="search" activeKey={this.state.key} onSelect={this.handleSelect} style={{ position: 'fixed', zIndex: 1, width: '100%', backgroundColor: 'white' }}>
          <Tab eventKey="search" title="Search" style={{ paddingTop: '5vh' }}>
            <Modal show={this.state.show} onHide={this.handleClose}>
              <Modal.Header closeButton>
                <Modal.Title className="red">Warning</Modal.Title>
              </Modal.Header>
              <Modal.Body>{this.state.errorMessage}</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Close
          </Button>

              </Modal.Footer>
            </Modal>
            <Sidebar
              setCourses={(courses) => this.setCourses(courses)}
              courses={this.state.allCourses}
              subjects={this.state.subjects}
              interestAreas={this.state.interestAreas} />
            <div style={{ marginLeft: '20vw' }}>
              <CourseArea
                data={this.state.filteredCourses}
                allData={this.state.allCourses}
                editCart={(attributes, actionType) => this.editCart(attributes, actionType)}
                cartMode={false} />
            </div>
          </Tab>

          <Tab eventKey="cart"
            title={<React.Fragment>
              Cart &nbsp;<Badge pill variant="danger" className="f-right"> {this.state.cartCourses.length}</Badge>
            </React.Fragment>}
            style={{ paddingTop: '5vh' }}>
            <div style={{ marginLeft: '4vw' }}>
              <CourseArea
                data={this.state.cartCourses}
                allData={this.state.allCourses}
                editCart={(attributes, actionType) => this.editCart(attributes, actionType)}
                cartMode={true} />
            </div>
          </Tab>

          <Tab eventKey="completed_courses" title="Completed Courses" style={{ paddingTop: '5vh' }}>
            <div style={{ marginLeft: '4vw' }}>
              <CompletedCourse data={this.state.completedCourses}
                allData={this.state.allCourses}
                setRatedCourses={(ratedCourses) => this.setRatedCourses(ratedCourses)} />
            </div>
          </Tab>

          <Tab eventKey="recommended_courses" title="Recommended Courses" style={{ paddingTop: '5vh' }}>
            <div style={{ marginLeft: '4vw' }}>
              {this.state.recommendedCourses.length > 0 && <CourseArea
                data={this.state.recommendedCourses}
                allData={this.state.allCourses}
                editCart={(attributes, actionType) => this.editCart(attributes, actionType)}
                cartMode={false} />}
              {this.state.recommendedCourses.length == 0 &&
                <div>
                  <br />
                  Please rate courses you have completed to get a list of recommendations. <Button onClick={() => this.handleSelect("completed_courses")}>Go to completed courses!</Button></div>}
            </div>
          </Tab>

        </Tabs>
      </>
    )
  }
}

export default App;
