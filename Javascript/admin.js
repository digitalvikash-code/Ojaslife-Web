// ==========================================
// ADMIN LOGIN
// ==========================================

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username =
            document.getElementById("username").value.trim();

        const password =
            document.getElementById("password").value;

        loginMessage.textContent = "Logging in...";

        try {

            const response = await fetch(
                "http://localhost:5000/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );

            const result = await response.json();

            if (result.success) {

                // Remember that the admin has logged in
                sessionStorage.setItem(
                    "ojaslifeAdmin",
                    "true"
                );

                // Open admin dashboard
                window.location.href = "index.html";

            } else {

                loginMessage.textContent =
                    result.message || "Invalid login details.";

            }

        } catch (error) {

            console.error("Login error:", error);

            loginMessage.textContent =
                "Unable to connect to the server.";

        }

    });

}

// ==========================================
// ADD PROJECT
// ==========================================

const projectForm = document.getElementById("projectForm");
const projectMessage = document.getElementById("projectMessage");

if (projectForm) {

    projectForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const projectName =
            document.getElementById("projectName").value.trim();

        const location =
            document.getElementById("projectLocation").value.trim();

        const totalPlots =
            Number(document.getElementById("totalPlots").value);

        const availablePlots =
            Number(document.getElementById("availablePlots").value);

        if (
            !projectName ||
            !location ||
            totalPlots < 0 ||
            availablePlots < 0
        ) {
            projectMessage.textContent =
                "Please enter valid project details.";
            return;
        }

        if (availablePlots > totalPlots) {
            projectMessage.textContent =
                "Available plots cannot be greater than total plots.";
            return;
        }

        projectMessage.textContent =
            "Adding project...";

        try {

            const response = await fetch(
                "http://localhost:5000/api/projects",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        projectName: projectName,
                        location: location,
                        totalPlots: totalPlots,
                        availablePlots: availablePlots
                    })
                }
            );

            const result = await response.json();

            if (result.success) {

                projectMessage.textContent =
                    "Project added successfully.";

                projectForm.reset();

            } else {

                projectMessage.textContent =
                    result.message || "Unable to add project.";

            }

        } catch (error) {

            console.error("Project error:", error);

            projectMessage.textContent =
                "Unable to connect to the server.";

        }

    });

}

// ==========================================
// ADMIN LOGOUT
// ==========================================

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        sessionStorage.removeItem("ojaslifeAdmin");

        window.location.href = "login.html";

    });

}

// ==========================================
// OJASLIFE ADMIN - ENQUIRIES
// ==========================================

const enquiriesBody = document.getElementById("enquiriesBody");
const totalEnquiries = document.getElementById("totalEnquiries");
const loadingMessage = document.getElementById("loadingMessage");
const errorMessage = document.getElementById("errorMessage");
const noEnquiries = document.getElementById("noEnquiries");
const refreshBtn = document.getElementById("refreshBtn");


async function loadEnquiries() {

    loadingMessage.style.display = "block";
    errorMessage.textContent = "";
    noEnquiries.style.display = "none";

    try {

        const response = await fetch(
            "http://localhost:5000/api/enquiries"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch enquiries.");
        }

        const result = await response.json();

        enquiriesBody.innerHTML = "";

        totalEnquiries.textContent = result.total;

        loadingMessage.style.display = "none";

        if (result.enquiries.length === 0) {
            noEnquiries.style.display = "block";
            return;
        }

        result.enquiries.forEach(function (enquiry) {

            const row = document.createElement("tr");

            const date = new Date(enquiry.createdAt);

            row.innerHTML = `
                <td>${enquiry.id}</td>
                <td>${enquiry.name}</td>
                <td>${enquiry.phone}</td>
                <td>${enquiry.location}</td>
                <td>${enquiry.project || "-"}</td>
                <td>${enquiry.plotSize || "-"}</td>
                <td>${enquiry.budget || "-"}</td>
                <td>${enquiry.timeline || "-"}</td>
                <td>${enquiry.message || "-"}</td>
                <td>${date.toLocaleString()}</td>
            `;

            enquiriesBody.appendChild(row);

        });

    } catch (error) {

        console.error("Error loading enquiries:", error);

        loadingMessage.style.display = "none";

        errorMessage.textContent =
            "Unable to load enquiries. Make sure the OjasLife backend is running.";

    }
}


// Refresh button
if (refreshBtn) {

    refreshBtn.addEventListener("click", function () {
        loadEnquiries();
    });

}


// Load enquiries when page opens
loadEnquiries();

// ==========================================
// LOAD PROJECTS
// ==========================================

const projectsBody = document.getElementById("projectsBody");
const noProjects = document.getElementById("noProjects");

async function loadProjects() {

    if (!projectsBody) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/projects"
        );

        const result = await response.json();

        projectsBody.innerHTML = "";

        if (!result.success || result.projects.length === 0) {
            noProjects.style.display = "block";
            return;
        }

        noProjects.style.display = "none";

        result.projects.forEach(function (project) {

            const row = document.createElement("tr");

            row.innerHTML = `
    <td>${project.id}</td>
    <td>${project.projectName}</td>
    <td>${project.location}</td>
    <td>${project.totalPlots}</td>
    <td>${project.availablePlots}</td>
    <td>${new Date(project.createdAt).toLocaleString()}</td>
    <td>
        <button
            class="btn btn-primary edit-project-btn"
            data-id="${project.id}"
        >
            Edit
        </button>

        <button
            class="btn btn-secondary delete-project-btn"
            data-id="${project.id}"
        >
            Delete
        </button>
    </td>
`;
            projectsBody.appendChild(row);

        });

    } catch (error) {

        console.error("Error loading projects:", error);

    }

}

loadProjects();

// EDIT PROJECT
document.addEventListener("click", async function (event) {

    if (!event.target.classList.contains("edit-project-btn")) {
        return;
    }

    const projectId = event.target.dataset.id;

    const projectName = prompt("Enter new project name:");
    if (projectName === null) return;

    const location = prompt("Enter new location:");
    if (location === null) return;

    const totalPlots = prompt("Enter total plots:");
    if (totalPlots === null) return;

    const availablePlots = prompt("Enter available plots:");
    if (availablePlots === null) return;

    try {

        const response = await fetch(
            `http://localhost:5000/api/projects/${projectId}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    projectName: projectName.trim(),
                    location: location.trim(),
                    totalPlots: Number(totalPlots),
                    availablePlots: Number(availablePlots)
                })
            }
        );

        const result = await response.json();

        alert(result.message);

        if (result.success) {
            loadProjects();
        }

    } catch (error) {

        console.error("Edit project error:", error);
        alert("Unable to update project.");

    }

});


// DELETE PROJECT
document.addEventListener("click", async function (event) {

    if (!event.target.classList.contains("delete-project-btn")) {
        return;
    }

    const projectId = event.target.dataset.id;

    const confirmDelete = confirm(
        "Are you sure you want to delete this project?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/projects/${projectId}`,
            {
                method: "DELETE"
            }
        );

        const result = await response.json();

        alert(result.message);

        if (result.success) {
            loadProjects();
        }

    } catch (error) {

        console.error("Delete project error:", error);
        alert("Unable to delete project.");

    }

});

// ==========================================
// ADD PLOT
// ==========================================

const plotForm = document.getElementById("plotForm");
const plotMessage = document.getElementById("plotMessage");

const plotProject = document.getElementById("plotProject");


// LOAD PROJECTS INTO PLOT DROPDOWN

async function loadPlotProjects() {

    if (!plotProject) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/projects"
        );

        const result = await response.json();

        if (!result.success) {
            return;
        }

        plotProject.innerHTML =
            '<option value="">Select Project</option>';

        result.projects.forEach(function (project) {

            const option =
                document.createElement("option");

            option.value = project.id;

            option.textContent =
                project.projectName +
                " - " +
                project.location;

            plotProject.appendChild(option);

        });

    } catch (error) {

        console.error(
            "Error loading plot projects:",
            error
        );

    }
}


// SUBMIT PLOT

if (plotForm) {

    plotForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            const projectId =
                document.getElementById(
                    "plotProject"
                ).value;

            const plotNumber =
                document.getElementById(
                    "plotNumber"
                ).value.trim();

            const size =
                document.getElementById(
                    "plotSize"
                ).value.trim();

            const facing =
                document.getElementById(
                    "plotFacing"
                ).value;

            const status =
                document.getElementById(
                    "plotStatus"
                ).value;


            if (
                !projectId ||
                !plotNumber ||
                !size
            ) {

                plotMessage.textContent =
                    "Please fill all required fields.";

                return;
            }


            plotMessage.textContent =
                "Adding plot...";


            try {

                const response = await fetch(
                    "http://localhost:5000/api/plots",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            projectId:
                                Number(projectId),

                            plotNumber:
                                plotNumber,

                            size:
                                size,

                            facing:
                                facing,

                            status:
                                status

                        })
                    }
                );


                const result =
                    await response.json();


                if (result.success) {

                    plotMessage.textContent =
                        "Plot added successfully.";

                    plotForm.reset();

                    loadPlotProjects();

                } else {

                    plotMessage.textContent =
                        result.message ||
                        "Unable to add plot.";

                }


            } catch (error) {

                console.error(
                    "Plot error:",
                    error
                );

                plotMessage.textContent =
                    "Unable to connect to the server.";

            }

        }
    );

}


// LOAD PROJECT DROPDOWN

loadPlotProjects();