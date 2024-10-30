let checkbox = document.querySelector('#red-mode-toggle')! as HTMLInputElement;
let header = document.querySelector('header')!;
let heading = document.querySelector('h1')!;
let navIcon = document.querySelector('.navbar-toggler-icon')! as HTMLElement;
let navCollapse = document.querySelector('.navbar-collapse')! as HTMLElement;
let navLink = document.querySelectorAll(
    '.navbar-nav a'
) as NodeListOf<HTMLElement>; // lösning till när man väljer flera elements.

let footer = document.querySelector('footer')!;
let footerIcons = document.querySelectorAll(
    '.footer-icon'
) as NodeListOf<HTMLElement>;
let whiteIcons = document.querySelectorAll(
    '.footer-icon-white'
) as NodeListOf<HTMLElement>;
let copyright = document.querySelector('p')!;

//Skapar först stilar för header när användare bockar av knappen.
function changeStyle() {
    if (checkbox.checked) {
        header.style.background = '#C61700';

        navIcon.style.color = 'white';
        navCollapse.style.background = '#C61700 !important';
        copyright.style.color = 'white';
        footer.style.background = '#C61700';
        for (let i = 0; i < navLink.length; i++) {
            navLink[i].style.color = 'white !important';
        }
        for (let i = 0; i < footerIcons.length; i++) {
            whiteIcons[i].style.display = 'block';
            footerIcons[i].style.display = 'none';
        }
    } else if (!checkbox.checked) {
        header.style.background = 'white';

        navCollapse.style.background = 'white !important';
        copyright.style.color = 'black';
        footer.style.background = 'white';
        for (let i = 0; i < navLink.length; i++) {
            navLink[i].style.color = 'black !important';
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
        localStorage.setItem(
            'checkboxStatus',
            JSON.stringify(checkbox.checked)
        );

        changeStyle();
    });
}
setupCheckboxListener();

// Man hämtar statusen som man har sparat och applicera dess stilar till webbläsaren.
let saveCheckboxStatus = localStorage.getItem('checkboxStatus');
if (saveCheckboxStatus) {
    checkbox.checked = JSON.parse(saveCheckboxStatus);
    changeStyle();
}

//-----------------------------------------------------
