//All global variables
let studentBtn = document.getElementById("students");
let studentDeck = document.getElementById("studentDeck");
let coursesBtn = document.getElementById("Courses");
let newStudentBtn = document.getElementById("new_student");
let addStudentForm = document.getElementById("addStudentForm");
let addCourseForm = document.getElementById("addCourseForm");
let addCourseBtn = document.getElementsByClassName("addCourseBtn");
let courseSelect = document.getElementsByClassName("courseSelect")[0];
// added student success alert
let alertMsg = document.querySelector(".alertMessage");

// URL variables
let studentPostURL = "https://student-challenge-api.herokuapp.com/students";
let studentsURL =
    "https://code-the-dream-school.github.io/JSONStudentsApp.github.io/Students.json";
let coursesURL =
    "https://code-the-dream-school.github.io/JSONStudentsApp.github.io/Courses.json";

//------------------------------------------------------------
//                  Helpful Functions
//------------------------------------------------------------
//function to check if student hasCourses
function hasCourses(course) {
    const hasCourse = course;
    if (hasCourse) {
        return `
        <ul class="list-group text-center">
            <li class="list-group-item">Course 1</li>
        </ul>
        `;
    }
    return "";
}
//function to check if student hasStudents
function hasStudents(student) {
    const hasStudent = student;
    if (hasStudent) {
        return `
            <ul class="list-group text-center">
                <li class="list-group-item">Student 1</li>
            </ul>
            `;
    }
    return "";
}
// Checks if student is "active" or "inactive"
function isActive(stat) {
    if (stat === true) {
        return "Active";
    } else {
        return "Inactive";
    }
}
//Checks that fetch response status is ok
function checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}
// Handy async try/catch function to fetch and parse json
async function getJSON(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (err) {
        throw err;
    }
}
// Get all the data and store inside a Promise.all as Array
async function getAllData() {
    const studentJSON = await getJSON(studentsURL);
    const courseJSON = await getJSON(coursesURL);
    const allData = [studentJSON, courseJSON]; // objects to arrays for simpler data retrieval
    return Promise.all(allData);
}

//------------------------------------------------------------
//                  Button Clicked Events
//------------------------------------------------------------
function generateCourseSelect() {
    for (let i = 0; i < addCourseBtn.length; i++) {
        addCourseBtn[i].addEventListener("click", () => {
            console.log("Clicked card index of: " + i);
        });
    }
}
studentBtn.addEventListener("click", () => generateStudents());
coursesBtn.addEventListener("click", () => generateCourses());
addStudentForm.addEventListener("submit", addNewStudent);
// addCourseForm.addEventListener("submit", addCourse);         // Under construction

//------------------------------------------------------------
//                  Getting/Displaying The Data
//------------------------------------------------------------
// Generate student data and display with additional thenables and catch
function generateStudents() {
    getAllData()
        .then(displayStudents)
        .then(generateCourseSelect) // Under construction
        .catch((err) => {
            console.error(err);
        });
}
// Generate courses data and display
function generateCourses() {
    getAllData()
        .then(displayCourses)
        .catch((err) => {
            console.error(err);
        });
}

//display student cards HTML
function displayStudents(data) {
    const studentData = data[0];
    let courseData = data[1];
    studentDeck.innerHTML = studentData
        .map((el) => {
            let status = el.status;
            // return HTML with data inside studentDeck variable
            return `
                    <div class="col mb-4">
                        <div class="card text-center bg-light mb-3 h-100">
                            <div class="card-header">
                                ${isActive(status)}
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">${
                                    el.name + " " + el.last_name
                                }</h5>
                                ${hasCourses(el.students)}
                                <div class="mt-3">
                                    <button type="button" class="addCourseBtn btn btn-outline-primary" data-toggle="modal" data-target="#addCourse">Add Course</button>
                                    <button type="button" class="btn btn-outline-primary">Edit Info</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
        })
        .join(""); //Joins all student cards without comma separators

    //Add Course Data to Options/Select -
    courseSelect.innerHTML = ""; //empty options
    courseSelect.innerHTML += "<option selected>Choose...</option>"; // add choose option
    courseSelect.innerHTML += courseData //insert course options
        .map((el) => {
            return `
                <option value="${el.name.toLowerCase()}">${el.name}</option>
            `;
        })
        .join(""); //Joins all options without comma separators
}
function displayCourses(data) {
    const courseData = data[1];
    studentDeck.innerHTML = courseData
        .map((el) => {
            return `
                <div class="col mb-4">
                    <div class="card text-center bg-light mb-3 h-100">
                        <div class="card-header">
                            ${el.duration}
                        </div>
                        <div class="card-body">
                        <h5 class="card-title">${el.name}</h5>
                        ${hasStudents(el.students)}
                        <div class="mt-3">
                            <button type="button" class="btn btn-outline-primary">Add Student</button>
                        </div>
                        </div>
                    </div>
                </div>
                `;
        })
        .join("");
}

//------------------------------------------------------------
//                  Add New Student Function
//-----------------------------------------------------------
// Gets form body info and posts URL then Display confirmation
function addNewStudent(e) {
    e.preventDefault();
    const name = document.getElementById("firstName").value;
    const last_name = document.getElementById("lastName").value;
    fetch(studentPostURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, last_name }),
    })
        .then(checkStatus)
        .then((res) => res.json())
        .then(addStudentConfirm)
        .catch((err) => console.error(err));
}
//Display added student confirmation (console/success alert)
function addStudentConfirm(data) {
    [data].map((info) => {
        console.log(info.message);
        console.log(info.student);
        alertMsg.innerHTML = `
        <div id="successAlert" class="alert alert-success alert-dismissible fade show " role="alert">
            <span>Congrats, student <strong style="text-transform: capitalize;">${
                info.student.name + " " + info.student.last_name
            }</strong> has enrolled!</span>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        `;
    });
}

//------------------------------------------------------------
//                  Add Course to Student Function
//-----------------------------------------------------------

// function addCourse(e) {
//     e.preventDefault();
//     fetch(studentsURL)
//         .then(checkStatus)
//         .then((res) => res.json())
//         .then(addCourseConfirm)
//         .catch((err) => console.error(err));
// }
