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

window.onload = init;            // init funktionen anropas när sidan har laddats in

let data = [];                  //globala variabler av datan från json och en global variabel av den filtrerade versionen av datan
let filteredData = []

function init() {                 //funktion som anropar en annan funktion
    getCourseData()
}

async function getCourseData() {               //anropar JSON-data med hjälp av FetchAPI detta tillsammans async/wait och try/catch lägger resultatet i data variabeln
    try {
        const response = await fetch('https://webbutveckling.miun.se/files/ramschema_ht24.json');

        if (!response.ok) {
        throw new Error('Nätverksproblem - felaktigt svar från servern');
    }

    data = await response.json();
    displayCourse(data);            //anropar funktion med resultatet från JSON-datan
    } catch (error) {
        console.error('Det uppstod ett fel:', error.message);
    }
}

function displayCourse(data) {                                   //funktion som tar emot datan och loopar igenom den för att skapa element i detta fall tabellrader med datans innehåll, för varje ny rad/kurs så appendas de nya cellerna med kursnamn, kurskod och progression in i raden
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

        coursesEl.appendChild(newRow)                           //slutligen så appendas raden in i tbody
    });
}

let sortButton1 = document.getElementById(`coursecode`)                     //Skapar en variabel av tabellrubrikerena (th)
let sortButton2 = document.getElementById(`coursename`)
let sortButton3 = document.getElementById(`progression`)

sortButton1.addEventListener('click', () => sortTable(`code`))             //Skapar en eventlistener som lyssnar efter ett click på elementet, arrowfunction som anropar funktionen sortable med code, coursaname respektive progression som argument 
sortButton2.addEventListener('click', () => sortTable(`coursename`))
sortButton3.addEventListener('click', () => sortTable(`progression`))


function sortTable(column) {                                                //function för att sortera tabellen alfabetiskt, den tar emot argument på vad den ska sortera men självaste sorteringen är med hjälp av en comparefunction som tar två värden och jämför alfabetiskt med .localecompare
    data.sort((a, b) => a[column].localeCompare(b[column]));
    displayCourse(data);
}

let filterText = document.getElementById(`filtertable`)                      //skapar en variabel av sökrutan

filterText.addEventListener('keyup', filterTable)                           //eventlistener som lyssnar efter när användaren släpper en tangent anropar en function när den triggas
 
function filterTable() {                                                   //function för att filtrera tabellen
    let inputText = filterText.value.toLocaleLowerCase()                   //variabel av vad användaren har skrivit in, tolocalelowercase så stor eller liten bokstav inte spelar roll

    filteredData = data.filter(course =>                                     //filtrerar data och sparar den filtrerade versionen i den globala variabeln filtereddata
        course.code.toLocaleLowerCase().includes(inputText) ||                      //lowercase av samma anledning som tidigare, .includes för att se om texten i sökrutan finns någonstans i datan, or operator så att om kurskod,kursnamn eller progression matchar så följer den med till den filtrerade versionen av datan
        course.coursename.toLocaleLowerCase().includes(inputText) ||
        course.progression.toLocaleLowerCase().includes(inputText)
    )
    displayCourse(filteredData)                                             //uppdaterar tabellen med den filtrerade versionen
}