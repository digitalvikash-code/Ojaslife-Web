// ==========================================
// OJASLIFE BACKEND SERVER
// ==========================================

const express = require("express");
const cors = require("cors");

const db = require("./Database/database");

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// ==========================================
// HOME ROUTE
// ==========================================

app.get("/", function (req, res) {

    res.json({
        success: true,
        message: "OjasLife Backend is running!"
    });

});

// ==========================================
// TEST API
// ==========================================

app.get("/api/test", function (req, res) {

    res.json({
        success: true,
        message: "API is working correctly."
    });

});

// ==========================================
// SUBMIT ENQUIRY
// ==========================================

app.post("/api/enquiries", function (req, res) {

    const {
        name,
        phone,
        location,
        project,
        plotSize,
        budget,
        timeline,
        message
    } = req.body;

    // Required field validation

    if (!name || !phone || !location) {

        return res.status(400).json({

            success: false,

            message:
                "Name, phone and location are required."

        });

    }

    // ==========================================
    // SAVE ENQUIRY TO DATABASE
    // ==========================================

    const createdAt = new Date().toISOString();

    const statement = db.prepare(`
        INSERT INTO enquiries
        (
            name,
            phone,
            location,
            project,
            plotSize,
            budget,
            timeline,
            message,
            createdAt
        )
        VALUES
        (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )
    `);

    const result = statement.run(
        name,
        phone,
        location,
        project || "",
        plotSize || "",
        budget || "",
        timeline || "",
        message || "",
        createdAt
    );

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(201).json({

        success: true,

        message:
            "Enquiry submitted successfully.",

        enquiryId: result.lastInsertRowid

    });

});

// ==========================================
// VIEW ALL ENQUIRIES
// ==========================================

// ==========================================
// ADMIN LOGIN
// ==========================================

app.post("/api/admin/login", function (req, res) {

    const { username, password } = req.body;

    // Demo admin credentials
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "ojaslife123";

    if (
        username === ADMIN_USERNAME &&
        password === ADMIN_PASSWORD
    ) {

        return res.json({
            success: true,
            message: "Login successful."
        });

    }

    res.status(401).json({
        success: false,
        message: "Invalid username or password."
    });

});

app.get("/api/enquiries", function (req, res) {

    const enquiries = db.prepare(`
        SELECT *
        FROM enquiries
        ORDER BY id DESC
    `).all();

    res.json({

        success: true,

        total: enquiries.length,

        enquiries: enquiries

    });

});

// ==========================================
// PROJECTS - GET ALL
// ==========================================

app.get("/api/projects", function (req, res) {

    const projects = db.prepare(`
        SELECT *
        FROM projects
        ORDER BY id DESC
    `).all();

    res.json({
        success: true,
        total: projects.length,
        projects: projects
    });

});
// ==========================================
// PLOT APIs
// ==========================================

// GET all plots for a project
app.get("/api/plots/:projectId", (req, res) => {

    try {

        const plots = db.prepare(`
            SELECT *
            FROM plots
            WHERE projectId = ?
            ORDER BY CAST(plotNumber AS INTEGER) ASC
        `).all(req.params.projectId);

        res.json({
            success: true,
            plots: plots
        });

    } catch (error) {

        console.error("Error fetching plots:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch plots."
        });

    }
});


// POST new plot
app.post("/api/plots", (req, res) => {

    try {

        const {
            projectId,
            plotNumber,
            size,
            facing,
            status
        } = req.body;

        if (
            !projectId ||
            !plotNumber ||
            !size
        ) {
            return res.status(400).json({
                success: false,
                message: "Project, plot number and size are required."
            });
        }

        const createdAt =
            new Date().toISOString();

        const result = db.prepare(`
            INSERT INTO plots
            (
                projectId,
                plotNumber,
                size,
                facing,
                status,
                createdAt
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            projectId,
            plotNumber,
            size,
            facing || "",
            status || "available",
            createdAt
        );

        res.json({
            success: true,
            message: "Plot added successfully.",
            plotId: result.lastInsertRowid
        });

    } catch (error) {

        console.error("Error adding plot:", error);

        res.status(500).json({
            success: false,
            message: "Unable to add plot."
        });

    }
});


// ==========================================
// PROJECTS - ADD NEW
// ==========================================

app.post("/api/projects", function (req, res) {

    const {
        projectName,
        location,
        totalPlots,
        availablePlots
    } = req.body;

    if (
        !projectName ||
        !location ||
        totalPlots === undefined ||
        availablePlots === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Project name, location and plot counts are required."
        });
    }

    if (
        Number(totalPlots) < 0 ||
        Number(availablePlots) < 0 ||
        Number(availablePlots) > Number(totalPlots)
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter valid plot numbers."
        });
    }

    const createdAt = new Date().toISOString();

    const statement = db.prepare(`
        INSERT INTO projects
        (
            projectName,
            location,
            totalPlots,
            availablePlots,
            createdAt
        )
        VALUES (?, ?, ?, ?, ?)
    `);

    const result = statement.run(
        projectName,
        location,
        Number(totalPlots),
        Number(availablePlots),
        createdAt
    );

    res.status(201).json({
        success: true,
        message: "Project added successfully.",
        projectId: result.lastInsertRowid
    });

});

// PROJECTS - UPDATE
app.put("/api/projects/:id", function (req, res) {

    const { id } = req.params;

    const {
        projectName,
        location,
        totalPlots,
        availablePlots
    } = req.body;

    if (
        !projectName ||
        !location ||
        totalPlots === undefined ||
        availablePlots === undefined
    ) {
        return res.status(400).json({
            success: false,
            message: "Project name, location and plot counts are required."
        });
    }

    if (
        Number(totalPlots) < 0 ||
        Number(availablePlots) < 0 ||
        Number(availablePlots) > Number(totalPlots)
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter valid plot numbers."
        });
    }

    const statement = db.prepare(`
        UPDATE projects
        SET
            projectName = ?,
            location = ?,
            totalPlots = ?,
            availablePlots = ?
        WHERE id = ?
    `);

    const result = statement.run(
        projectName,
        location,
        Number(totalPlots),
        Number(availablePlots),
        id
    );

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: "Project not found."
        });
    }

    res.json({
        success: true,
        message: "Project updated successfully."
    });
});


// PROJECTS - DELETE
app.delete("/api/projects/:id", function (req, res) {

    const { id } = req.params;

    const statement = db.prepare(`
        DELETE FROM projects
        WHERE id = ?
    `);

    const result = statement.run(id);

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: "Project not found."
        });
    }

    res.json({
        success: true,
        message: "Project deleted successfully."
    });
});

// ==========================================
// SERVER
// ==========================================

const PORT = 5000;

app.listen(PORT, function () {

    console.log(
        `OjasLife Backend running on http://localhost:${PORT}`
    );

});