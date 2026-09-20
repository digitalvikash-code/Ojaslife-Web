const projectId = new URLSearchParams(window.location.search).get("id");

const projectTitle = document.querySelector(".project-detail-hero h1");
const projectLocation = document.querySelector(".detail-location");
const detailPlotSize =
    document.getElementById("detailPlotSize");

const detailPropertyType =
    document.getElementById("detailPropertyType");

const detailProjectStatus =
    document.getElementById("detailProjectStatus");

const detailLocation =
    document.getElementById("detailLocation");

const projectOverview =
    document.getElementById("projectOverview");
// ==========================================
// PLOT FILTER
// ==========================================

const plotFilters = document.querySelectorAll(".plot-filter");
const plotCards = document.querySelectorAll(".plot-card");


plotFilters.forEach(function (filterButton) {

    filterButton.addEventListener("click", function () {

        const selectedFilter =
            this.dataset.filter;


        // Active button

        plotFilters.forEach(function (button) {
            button.classList.remove("active");
        });

        this.classList.add("active");

        // ==========================================
        // LOAD PROJECT DETAILS
        // ==========================================

        async function loadProjectDetails() {

            if (!projectId) {
                return;
            }

            try {

                const response = await fetch(
                    "http://localhost:5000/api/projects"
                );

                const result = await response.json();

                if (!result.success) {
                    throw new Error("Unable to load projects.");
                }

                const project = result.projects.find(function (item) {
                    return String(item.id) === String(projectId);
                });

                if (!project) {
                    console.error("Project not found.");
                    return;
                }

                // PROJECT NAME
                if (projectTitle) {
                    projectTitle.textContent =
                        project.projectName;
                }

                // PROJECT LOCATION
                if (projectLocation) {
                    projectLocation.textContent =
                        "📍 " + project.location;
                }

                // PROJECT STATUS
                const statusElements =
                    document.querySelectorAll(".project-status");

                const isAvailable =
                    Number(project.availablePlots) > 0;

                statusElements.forEach(function (element) {

                    element.textContent =
                        isAvailable
                            ? "● Available"
                            : "● Coming Soon";

                    element.classList.remove(
                        "available",
                        "coming"
                    );

                    element.classList.add(
                        isAvailable
                            ? "available"
                            : "coming"
                    );
                });

                // QUICK INFO - PROJECT STATUS
                const quickInfoItems =
                    document.querySelectorAll(".quick-info-item");

                quickInfoItems.forEach(function (item) {

                    if (
                        item.textContent
                            .toLowerCase()
                            .includes("project status")
                    ) {

                        const value =
                            item.querySelector("strong");

                        if (value) {
                            value.textContent =
                                isAvailable
                                    ? "Available"
                                    : "Coming Soon";
                        }
                    }
                });
                // QUICK INFO

                if (detailPlotSize) {
                    detailPlotSize.textContent =
                        "600–1500 Sq.Ft.";
                }

                if (detailPropertyType) {
                    detailPropertyType.textContent =
                        "Residential";
                }

                if (detailProjectStatus) {
                    detailProjectStatus.textContent =
                        isAvailable
                            ? "Available"
                            : "Coming Soon";
                }

                if (detailLocation) {
                    detailLocation.textContent =
                        project.location;
                }

                // OVERVIEW

                if (projectOverview) {
                    projectOverview.textContent =
                        project.projectName +
                        " is a residential plot project located in " +
                        project.location +
                        ". The project has " +
                        project.totalPlots +
                        " total plots, with " +
                        project.availablePlots +
                        " plots currently available.";
                }
                // UPDATE PAGE TITLE
                document.title =
                    project.projectName + " | OjasLife";

            } catch (error) {

                console.error(
                    "Error loading project details:",
                    error
                );

            }
        }

        // Filter plots

        plotCards.forEach(function (plot) {

            const plotStatus =
                plot.dataset.status;


            if (
                selectedFilter === "all" ||
                selectedFilter === plotStatus
            ) {

                plot.style.display = "block";

            } else {

                plot.style.display = "none";

            }

        });

    });

});


// ==========================================
// PLOT ENQUIRY
// ==========================================

const plotEnquiryButtons =
    document.querySelectorAll(".plot-enquire");


plotEnquiryButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const plotNumber =
            this.dataset.plot;


        if (!plotNumber) {
            return;
        }


        alert(
            "You selected Plot " +
            plotNumber +
            ". Our enquiry form will be connected to the backend soon."
        );

    });

});


// ==========================================
// SITE VISIT
// ==========================================

const siteVisitBtn =
    document.getElementById("siteVisitBtn");


if (siteVisitBtn) {

    siteVisitBtn.addEventListener("click", function () {

        window.location.href =
            "contact.html?type=site-visit";

    });

}
// ==========================================
// LOAD PLOT AVAILABILITY
// ==========================================

async function loadPlotAvailability() {

    if (!projectId) {
        return;
    }

    const plotGrid =
        document.getElementById("plotAvailabilityGrid");

    if (!plotGrid) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/projects"
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error(
                "Unable to load project data."
            );
        }

        const project = result.projects.find(function (item) {
            return String(item.id) === String(projectId);
        });

        if (!project) {
            console.error("Project not found.");
            return;
        }

        const totalPlots =
            Number(project.totalPlots);

        const availablePlots =
            Number(project.availablePlots);

        plotGrid.innerHTML = "";

        for (let i = 1; i <= totalPlots; i++) {

            const isAvailable =
                i <= availablePlots;

            const card =
                document.createElement("div");

            card.className =
                "plot-card " +
                (isAvailable
                    ? "available"
                    : "sold");

            card.dataset.status =
                isAvailable
                    ? "available"
                    : "sold";

            card.innerHTML = `
                <div class="plot-number">
                    ${i}
                </div>

                <div class="plot-status">
                    ${isAvailable
                    ? "Available"
                    : "Sold"}
                </div>

                <div class="plot-info">
                    <span>
                        Status
                    </span>

                    <strong>
                        ${isAvailable
                    ? "Open"
                    : "Sold"}
                    </strong>
                </div>

                ${isAvailable
                    ? `
                            <button
                                class="plot-enquire"
                                data-plot="${i}"
                            >
                                Enquire
                            </button>
                          `
                    : `
                            <button
                                class="plot-enquire disabled"
                                disabled
                            >
                                Sold
                            </button>
                          `
                }
            `;

            plotGrid.appendChild(card);
        }

        // Reconnect enquiry buttons
        const enquiryButtons =
            plotGrid.querySelectorAll(".plot-enquire:not(.disabled)");

        enquiryButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const plotNumber =
                    this.dataset.plot;

                alert(
                    "You selected Plot " +
                    plotNumber +
                    ". Our team will contact you soon."
                );
            });
        });

    } catch (error) {

        console.error(
            "Error loading plot availability:",
            error
        );

        plotGrid.innerHTML =
            "<p>Unable to load plot availability.</p>";
    }
}
// ==========================================
// LOAD PLOT AVAILABILITY
// ==========================================

async function loadPlotAvailability() {

    if (!projectId) {
        return;
    }

    const plotGrid =
        document.getElementById("plotAvailabilityGrid");

    if (!plotGrid) {
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/projects"
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error("Unable to load projects.");
        }

        const project = result.projects.find(function (item) {
            return String(item.id) === String(projectId);
        });

        if (!project) {
            console.error("Project not found.");
            return;
        }

        const totalPlots =
            Number(project.totalPlots);

        const availablePlots =
            Number(project.availablePlots);

        plotGrid.innerHTML = "";

        for (let i = 1; i <= totalPlots; i++) {

            const isAvailable =
                i <= availablePlots;

            const card =
                document.createElement("div");

            card.className =
                "plot-card " +
                (isAvailable ? "available" : "sold");

            card.dataset.status =
                isAvailable ? "available" : "sold";

            card.innerHTML = `
                <div class="plot-number">
                    ${i}
                </div>

                <div class="plot-status">
                    ${isAvailable ? "Available" : "Sold"}
                </div>

                <div class="plot-info">
                    <span>Status</span>

                    <strong>
                        ${isAvailable ? "Open" : "Sold"}
                    </strong>
                </div>

                ${isAvailable
                    ? `
                            <button
                                class="plot-enquire"
                                data-plot="${i}"
                            >
                                Enquire
                            </button>
                          `
                    : `
                            <button
                                class="plot-enquire disabled"
                                disabled
                            >
                                Sold
                            </button>
                          `
                }
            `;

            plotGrid.appendChild(card);
        }

    } catch (error) {

        console.error(
            "Error loading plot availability:",
            error
        );

        plotGrid.innerHTML =
            "<p>Unable to load plot availability.</p>";
    }
}
loadProjectDetails();
loadPlotAvailability();
