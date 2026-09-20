// ==========================================
// CONTACT FORM
// ==========================================

const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");


if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const location = document.getElementById("location").value.trim();

        const project = document.getElementById("project").value;
        const plotSize = document.getElementById("plotSize").value;
        const budget = document.getElementById("budget").value;
        const timeline = document.getElementById("timeline").value;
        const message = document.getElementById("message").value.trim();


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name || !phone || !location) {

            formMessage.textContent =
                "Please fill all required fields.";

            return;
        }


        const phonePattern = /^[6-9][0-9]{9}$/;

        if (!phonePattern.test(phone)) {

            formMessage.textContent =
                "Please enter a valid 10-digit Indian mobile number.";

            return;
        }


        // ==========================================
        // ENQUIRY DATA
        // ==========================================

        const enquiryData = {

            name: name,
            phone: phone,
            location: location,
            project: project,
            plotSize: plotSize,
            budget: budget,
            timeline: timeline,
            message: message

        };


        formMessage.textContent =
            "Submitting your enquiry...";


        // ==========================================
        // SEND TO BACKEND
        // ==========================================

        try {

            const response = await fetch(
                "http://localhost:5000/api/enquiries",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(enquiryData)
                }
            );


            const result = await response.json();


            // ==========================================
            // SUCCESS
            // ==========================================

            if (result.success) {

                formMessage.textContent =
                    "Thank you! Your enquiry has been submitted successfully.";

                contactForm.reset();

            } else {

                formMessage.textContent =
                    result.message ||
                    "Something went wrong.";

            }

        }


        // ==========================================
        // ERROR
        // ==========================================

        catch (error) {

            console.error("Error:", error);

            formMessage.textContent =
                "Unable to connect to the server. Please try again.";

        }

    });

}


// ==========================================
// SITE VISIT
// ==========================================

const urlParams =
    new URLSearchParams(window.location.search);

const enquiryType =
    urlParams.get("type");


if (enquiryType === "site-visit") {

    const messageBox =
        document.getElementById("message");


    if (messageBox) {

        messageBox.value =
            "I would like to schedule a site visit.";

    }

}