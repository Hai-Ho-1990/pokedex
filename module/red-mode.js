// Ändra & spara header & footer bakgrundsfärg när användare bockar av checkbox
let checkbox = document.querySelector('#red-mode-toggle');
let header = document.querySelector('header');
let heading = document.querySelector('h1');
let navIcon = document.querySelector('.navbar-toggler-icon');
let navCollapse = document.querySelector('.navbar-collapse');
let navLink = document.querySelectorAll('.navbar-nav a');
// as NodeListOf<HTMLElement> används för att hantera flera element
let footer = document.querySelector('footer');
let footerIcons = document.querySelectorAll('.footer-icon');
let whiteIcons = document.querySelectorAll('.footer-icon-white');
let copyright = document.querySelector('p');
// Skapar stilar för header och footer när användaren bockar av knappen
function changeStyle() {
    if (checkbox.checked) {
        // Stilar för när checkboxen är aktiverad
        header.style.background = '#A92D22';
        heading.style.color = 'white';
        navIcon.style.color = 'white';
        navCollapse.style.setProperty('background', '#A92D22', 'important');
        copyright.style.color = 'white';
        footer.style.background = '#A92D22';
        // Ändra färg på navigationslänkarna
        for (let i = 0; i < navLink.length; i++) {
            navLink[i].style.setProperty('color', 'white', 'important');
        }
        // Visa vita ikoner i footern och göm de andra
        for (let i = 0; i < footerIcons.length; i++) {
            whiteIcons[i].style.display = 'block';
            footerIcons[i].style.display = 'none';
        }
    }
    else {
        // Stilar för när checkboxen är avaktiverad
        header.style.background = 'white';
        heading.style.color = 'black';
        navCollapse.style.setProperty('background', '', 'important');
        copyright.style.color = 'black';
        footer.style.background = 'white';
        // Ändra färg på navigationslänkarna
        for (let i = 0; i < navLink.length; i++) {
            navLink[i].style.setProperty('color', 'black', 'important');
        }
        // Visa de ursprungliga ikonerna i footern och göm de vita
        for (let i = 0; i < footerIcons.length; i++) {
            whiteIcons[i].style.display = 'none';
            footerIcons[i].style.display = 'block';
        }
    }
}
// Sätter upp en event-lyssnare för checkboxen och sparar dess status i localStorage
function setupCheckboxListener() {
    checkbox.addEventListener('click', function () {
        // Sparar checkboxens status som en sträng i localStorage
        localStorage.setItem('checkboxStatus', JSON.stringify(checkbox.checked));
        changeStyle();
    });
}
setupCheckboxListener();
// Hämtar sparad status för checkboxen och applicerar stilar
let saveCheckboxStatus = localStorage.getItem('checkboxStatus');
if (saveCheckboxStatus) {
    checkbox.checked = JSON.parse(saveCheckboxStatus);
    changeStyle();
}
// Exporterar funktionerna
export { changeStyle, setupCheckboxListener };
//# sourceMappingURL=red-mode.js.map