// Key used for localStorage
const STORAGE_KEY = "attendanceData";

// Elements
const dateInput = document.getElementById("date-input");
const presentBtn = document.getElementById("present-btn");
const absentBtn = document.getElementById("absent-btn");
const tableBody = document.getElementById("attendance-table-body");

const totalDaysEl = document.getElementById("total-days");
const presentDaysEl = document.getElementById("present-days");
const absentDaysEl = document.getElementById("absent-days");
const attendancePercentageEl = document.getElementById("attendance-percentage");

// Data structure: { "2025-12-02": "present", "2025-12-03": "absent", ... }
let attendanceData = {};

// Load existing data on start
loadFromStorage();
renderAll();

// Ensure date defaults to today
setTodayAsDefault();

/* Event listeners */
presentBtn.addEventListener("click", () => {
    const date = dateInput.value;
    if (!date) {
        alert("Please select a date first.");
        return;
    }
    attendanceData[date] = "present";
    saveToStorage();
    renderAll();
});

absentBtn.addEventListener("click", () => {
    const date = dateInput.value;
    if (!date) {
        alert("Please select a date first.");
        return;
    }
    attendanceData[date] = "absent";
    saveToStorage();
    renderAll();
});

/* Functions */

function setTodayAsDefault() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    dateInput.value = `${yyyy}-${mm}-${dd}`;
}

function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendanceData));
}

function loadFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            attendanceData = JSON.parse(stored);
        } catch (e) {
            attendanceData = {};
        }
    }
}

function renderAll() {
    renderTable();
    renderSummary();
}

function renderTable() {
    // Clear table
    tableBody.innerHTML = "";

    // Get sorted dates
    const dates = Object.keys(attendanceData).sort().reverse();


    if (dates.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        cell.colSpan = 2;
        cell.textContent = "No attendance marked yet.";
        cell.style.color = "#9ca3af";
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    dates.forEach(dateStr => {
        const status = attendanceData[dateStr];

        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.textContent = formatDateNice(dateStr);

        const statusCell = document.createElement("td");
        const pill = document.createElement("span");
        pill.classList.add("status-pill");

        if (status === "present") {
            pill.classList.add("status-present");
            pill.textContent = "Present";
        } else {
            pill.classList.add("status-absent");
            pill.textContent = "Absent";
        }

        statusCell.appendChild(pill);

        row.appendChild(dateCell);
        row.appendChild(statusCell);
        tableBody.appendChild(row);
    });
}

function renderSummary() {
    const dates = Object.keys(attendanceData);
    const total = dates.length;
    const presentCount = dates.filter(d => attendanceData[d] === "present").length;
    const absentCount = dates.filter(d => attendanceData[d] === "absent").length;

    const percentage = total === 0 ? 0 : Math.round((presentCount / total) * 100);

    totalDaysEl.textContent = total;
    presentDaysEl.textContent = presentCount;
    absentDaysEl.textContent = absentCount;
    attendancePercentageEl.textContent = percentage + "%";
}

function formatDateNice(yyyyMmDd) {
    if (!yyyyMmDd) return "Invalid Date";

    const [year, month, day] = yyyyMmDd.split("-");
    return `${day}/${month}/${year}`;
}

console.log("FORMAT FUNC USED:", formatDateNice("2025-12-03"));





