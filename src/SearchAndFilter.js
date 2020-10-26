class SearchAndFilter {
  searchAndFilter(courses, search, subject, minimumCredits, maximumCredits, interestArea) {
    let allCourses = courses;
    if (search != null && /\S/.test(search)) {
      allCourses = allCourses.filter((course) => course.keywords.indexOf(search) > -1 || course.keywords.some((keyword) => keyword.includes(search)));
    }

    if (subject != null && subject !== "All") {
      allCourses = allCourses.filter((course) => course.subject === subject);
    }

    if (minimumCredits != null && !isNaN(minimumCredits)) {
      let minCredits = parseInt(minimumCredits);
      if (!isNaN(parseInt(minimumCredits)))
        allCourses = allCourses.filter((course) => course.credits >= minCredits);
    }

    if (maximumCredits != null && !isNaN(maximumCredits)) {
      let maxCredits = parseInt(maximumCredits);
      if (!isNaN(parseInt(maximumCredits)))
        allCourses = allCourses.filter((course) => course.credits <= maxCredits);
    }

    if (interestArea != null && interestArea !== "All") {
      allCourses = allCourses.filter((course) => course.keywords.some((keyword) => keyword === interestArea));
    }

    return allCourses;
  }
}

export default SearchAndFilter;
