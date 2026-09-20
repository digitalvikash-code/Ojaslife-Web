// ==========================================
// OJASLIFE DATABASE
// ==========================================

const Database = require("better-sqlite3");
const path = require("path");

// Database file location
const dbPath = path.join(__dirname, "ojaslife.db");

// Create / open database
const db = new Database(dbPath);


// ==========================================
// ENQUIRIES TABLE
// ==========================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS enquiries (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        name TEXT NOT NULL,

        phone TEXT NOT NULL,

        location TEXT NOT NULL,

        project TEXT,

        plotSize TEXT,

        budget TEXT,

        timeline TEXT,

        message TEXT,

        createdAt TEXT NOT NULL

    )
`).run();


// ==========================================
// PROJECTS TABLE
// ==========================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS projects (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        projectName TEXT NOT NULL,

        location TEXT NOT NULL,

        totalPlots INTEGER NOT NULL DEFAULT 0,

        availablePlots INTEGER NOT NULL DEFAULT 0,

        createdAt TEXT NOT NULL

    )
`).run();


// ==========================================
// PLOTS TABLE
// ==========================================

db.prepare(`
    CREATE TABLE IF NOT EXISTS plots (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        projectId INTEGER NOT NULL,

        plotNumber TEXT NOT NULL,

        size TEXT NOT NULL,

        facing TEXT,

        status TEXT NOT NULL DEFAULT 'available',

        createdAt TEXT NOT NULL

    )
`).run();


// ==========================================
// EXPORT DATABASE
// ==========================================

module.exports = db;

console.log("OjasLife database connected successfully.");