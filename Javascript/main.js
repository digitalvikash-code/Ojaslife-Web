// ===============================
// MOBILE MENU
// ===============================

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

if (menuBtn && navbar) {

    menuBtn.addEventListener("click", function () {
        navbar.classList.toggle("show");
    });

}


// ===============================
// CLOSE MOBILE MENU AFTER CLICK
// ===============================

const navLinks = document.querySelectorAll(".navbar a");

navLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        if (navbar) {
            navbar.classList.remove("show");
        }

    });

});


// ===============================
// LEAD FORM
// ===============================

const leadForm = document.getElementById("leadForm");

if (leadForm) {

    leadForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();

        if (!name || !phone) {
            alert("Please enter your name and phone number.");
            return;
        }

        alert(
            "Thank you, " +
            name +
            "! Your enquiry has been received."
        );

        leadForm.reset();

    });

}


// ===============================
// CURRENT YEAR
// ===============================

const currentYear = new Date().getFullYear();

const yearElements = document.querySelectorAll(".current-year");

yearElements.forEach(function (element) {
    element.textContent = currentYear;
});