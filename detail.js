"use strict";
let checkbox = document.querySelector('#red-mode-toggle');
let header = document.querySelector('header');
let navIcon = document.querySelector('.navbar-toggler-icon');
let navCollapse = document.querySelector('.navbar-collapse');
let navLink = document.querySelectorAll('.navbar-nav a'); // lösning till när man väljer flera elements.
let footer = document.querySelector('footer');
let footerIcons = document.querySelectorAll('.footer-icon');
let whiteIcons = document.querySelectorAll('.footer-icon-white');
let copyright = document.querySelector('p');
//Skapar först stilar för header när användare bockar av knappen.
function changeStyleDetail() {
    if (checkbox.checked) {
        header.style.background = '#C61700';
        navIcon.style.color = 'white';
        navCollapse.style.setProperty('background', '#C61700', 'important');
        copyright.style.setProperty('color', 'white', 'important');
        footer.style.background = '#C61700';
        for (let i = 0; i < navLink.length; i++) {
            navLink[i].style.setProperty('color', 'white', 'important');
        }
        for (let i = 0; i < footerIcons.length; i++) {
            whiteIcons[i].style.display = 'block';
            footerIcons[i].style.display = 'none';
        }
    }
    else if (!checkbox.checked) {
        header.style.background = 'white';
        navCollapse.style.background = 'white';
        copyright.style.color = 'black';
        footer.style.background = 'white';
        for (let i = 0; i < navLink.length; i++) {
            navLink[i].style.color = 'black';
        }
        for (let i = 0; i < footerIcons.length; i++) {
            whiteIcons[i].style.display = 'none';
            footerIcons[i].style.display = 'block';
        }
    }
}
// Så fort användaren klickar så sparas checkboxen status och ändrar webbläsares bakgrundsfärg
function setupCheckboxListener() {
    checkbox.addEventListener('click', function () {
        // Värde måste vara en sträng därför man ska konvertera statusen till sträng
        localStorage.setItem('checkboxStatus', JSON.stringify(checkbox.checked));
        changeStyleDetail();
    });
}
setupCheckboxListener();
// Man hämtar statusen som man har sparat och applicera dess stilar till webbläsaren.
let saveCheckboxStatus = localStorage.getItem('checkboxStatus');
if (saveCheckboxStatus) {
    checkbox.checked = JSON.parse(saveCheckboxStatus);
    changeStyleDetail();
}
//-----------------------------------------------------
//# sourceMappingURL=detail.js.map