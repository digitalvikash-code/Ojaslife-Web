const projectGrid = document.getElementById("projectGrid");
const projectCount = document.getElementById("projectCount");
const noProjects = document.getElementById("noProjects");

const projectSearch = document.getElementById("projectSearch");
const projectLocation = document.getElementById("projectLocation");
const projectStatus = document.getElementById("projectStatus");

let projects = [];

async function loadProjects() {
    try {
        const response = await fetch(
            "http://localhost:5000/api/projects"
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error("Unable to load projects.");
        }

        projects = result.projects;

        displayProjects();

    } catch (error) {
        console.error("Error loading projects:", error);

        projectGrid.innerHTML =
            "<p>Unable to load projects.</p>";
    }
}

function displayProjects() {

    const searchText =
        projectSearch.value.trim().toLowerCase();

    const selectedLocation =
        projectLocation.value;

    const selectedStatus =
        projectStatus.value;

    const filteredProjects = projects.filter(function (project) {

        const name =
            project.projectName.toLowerCase();

        const location =
            project.location.toLowerCase();

        const matchesSearch =
            name.includes(searchText) ||
            location.includes(searchText);

        const matchesLocation =
            selectedLocation === "all" ||
            location.includes(selectedLocation);

        const status =
            Number(project.availablePlots) > 0
                ? "available"
                : "coming-soon";

        const matchesStatus =
            selectedStatus === "all" ||
            status === selectedStatus;

        return (
            matchesSearch &&
            matchesLocation &&
            matchesStatus
        );
    });

    projectGrid.innerHTML = "";

    projectCount.textContent =
        filteredProjects.length + " Projects";

    if (filteredProjects.length === 0) {
        noProjects.style.display = "block";
        return;
    }

    noProjects.style.display = "none";

    filteredProjects.forEach(function (project) {

        const isAvailable =
            Number(project.availablePlots) > 0;

        const statusText =
            isAvailable
                ? "Available"
                : "Coming Soon";

        const statusClass =
            isAvailable
                ? "available"
                : "coming";

        const card =
            document.createElement("article");

        card.className = "large-project-card";

        card.innerHTML = `
            <div class="large-project-image">

                <span class="project-status ${statusClass}">
                    ${statusText}
                </span>

                <div class="project-placeholder large">
                    Project Image
                </div>

            </div>

            <div class="large-project-content">

                <span class="project-location">
                    📍 ${project.location}
                </span>

                <h3>
                    ${project.projectName}
                </h3>

                <p>
                    Residential plots available in
                    ${project.location}.
                </p>

                <div class="property-details">

                    <div>
                        <strong>
                            ${project.totalPlots}
                        </strong>
                        <span>Total Plots</span>
                    </div>

                    <div>
                        <strong>
                            ${project.availablePlots}
                        </strong>
                        <span>Available</span>
                    </div>

                    <div>
                        <strong>
                            ${isAvailable ? "Open" : "Soon"}
                        </strong>
                        <span>Status</span>
                    </div>

                </div>

                <div class="project-card-footer">

                    <span>
                        Residential Plots
                    </span>

                    <a
                        href="projects-details.html?id=${project.id}"
                        class="project-btn"
                    >
                        View Project →
                    </a>

                </div>

            </div>
        `;

        projectGrid.appendChild(card);
    });
}

if (projectSearch) {
    projectSearch.addEventListener(
        "input",
        displayProjects
    );
}

if (projectLocation) {
    projectLocation.addEventListener(
        "change",
        displayProjects
    );
}

if (projectStatus) {
    projectStatus.addEventListener(
        "change",
        displayProjects
    );
}

loadProjects();