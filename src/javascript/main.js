"use strict"

//skapar variablar av knapp elementen i html
let openButton = document.getElementById("open-menu")
let closeButton = document.getElementById("close-menu")


//skapar en eventlistener som lyssnar efter när användare klickar på dessa element
openButton.addEventListener('click', toggleMenu)
closeButton.addEventListener('click', toggleMenu)
//function som kollar ifall mobilmenyn visas eller inte när man trycker på respektive knapp, om den inte visas så visas den och vice versa. Den ändrar knappens css ifall display är none till block annars ändras den till none
function toggleMenu(){
    let mobileMenuEl = document.getElementById("mobilemenu")
    let style = window.getComputedStyle(mobileMenuEl)

    if(style.display === "none") {
        mobileMenuEl.style.display = "block";
    } else{
        mobileMenuEl.style.display = "none"
    }
}

window.onload = init;

let data = [];

function init() {
    getCourseData()
}

async function getCourseData() {
    try {
        const response = await fetch('https://webbutveckling.miun.se/files/ramschema_ht24.json');

        if (!response.ok) {
        throw new Error('Nätverksproblem - felaktigt svar från servern');
    }

    data = await response.json();
    displayCourse(data);
    } catch (error) {
        console.error('Det uppstod ett fel:', error.message);
    }
}

function displayCourse(data) {
    const coursesEl = document.getElementById(`appendEl`)
    coursesEl.innerHTML = ``
    data.forEach(course => {
        let newRow = document.createElement(`tr`)
        
        let newCourseCode = document.createElement(`td`)
        newCourseCode.textContent = course.code
        newRow.appendChild(newCourseCode)

        let newCourseName = document.createElement(`td`)
        newCourseName.textContent = course.coursename
        newRow.appendChild(newCourseName)

        let newCourseProgression = document.createElement(`td`)
        newCourseProgression.textContent = course.progression
        newRow.appendChild(newCourseProgression)

        coursesEl.appendChild(newRow)
    });
}

let sortButton1 = document.getElementById(`coursecode`)
let sortButton2 = document.getElementById(`coursename`)
let sortButton3 = document.getElementById(`progression`)

sortButton1.addEventListener('click', () => sortTable(`code`))
sortButton2.addEventListener('click', () => sortTable(`coursename`))
sortButton3.addEventListener('click', () => sortTable(`progression`))


function sortTable(column) {
    data.sort((a, b) => a[column].localeCompare(b[column]));
    displayCourse(data);
}