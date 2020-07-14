let studentBtn = document.getElementById("students");
let studentDeck = document.getElementById("studentDeck");
let coursesBtn = document.getElementById("Courses");
let newStudentBtn = document.getElementById("new_student");

let studentsURL =
    "https://code-the-dream-school.github.io/JSONStudentsApp.github.io/Students.json";
let coursesURL =
    "https://code-the-dream-school.github.io/JSONStudentsApp.github.io/Courses.json";

//------------------------------------------------------------
//                  Helpful Functions
//------------------------------------------------------------
function isActive(stat) {
    if (stat === true) {
        return "Active";
    } else {
        return "Inactive";
    }
}
async function getJSON(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (err) {
        throw err;
    }
}

async function getAllData() {
    const studentJSON = await getJSON(studentsURL);
    const courseJSON = await getJSON(coursesURL);

    const studentInfo = [studentJSON].map(async (studentData) => {
        return { studentData };
    });
    const courseInfo = [courseJSON].map(async (courseData) => {
        return { courseData };
    });
    const allData = [...studentInfo, ...courseInfo];
    return Promise.all(allData);
}

function generateStudents() {
    getAllData()
        .then(structureHTML)
        .catch((err) => {
            console.error(err);
        });
}

//------------------------------------------------------------
//                  Getting/Displaying The Data
//------------------------------------------------------------

function structureHTML(data) {
    data.map((info) => {
        studentDeck.innerHTML = info.studentData
            .map((el) => {
                let status = el.status;
                return `
                <div class="col mb-4">
                    <div class="card text-center bg-light mb-3 h-100">
                        <div class="card-header">
                            ${isActive(status)}
                        </div>
                        <div class="card-body">
                        <h4 class="card-title">${el.name}</h4>
                        <ul class="list-group text-center">
                            <li class="list-group-item">Course 1</li>
                            <li class="list-group-item">Course2</li>
                        </ul>
                        <div class="mt-3">
                            <button type="button" class="btn btn-secondary">Add Course</button>
                            <button type="button" class="btn btn-secondary">Edit Info</button>
                        </div>
                        </div>
                    </div>
                </div>
                `;
            })
            .join("");
    });
}
//------------------------------------------------------------
//                  Button Clicked Events
//------------------------------------------------------------
studentBtn.addEventListener("click", () => generateStudents());
coursesBtn.addEventListener("click", () => generateCourses());
// studentBtn.addEventListener("click", () => {
//     getAllData(studentsURL)
//         .then(generateHTML)
//         .catch((err) => {
//             console.error(err);
//         });
// });
