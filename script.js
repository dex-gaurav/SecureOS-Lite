var users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "user" },
    { username: "guest", password: "guest123", role: "guest" }
];

var auditLogs = [];
var currentUser = null;
var currentCaptcha = "";
var failedAttempts = {};
var lockUntil = {};
var maxAttempts = 3;
var lockSeconds = 30;

function loadSavedData() {
    var savedLogs = localStorage.getItem("secureos_lite_logs");
    var savedAttempts = localStorage.getItem("secureos_lite_attempts");
    var savedLocks = localStorage.getItem("secureos_lite_locks");

    if (savedLogs) {
        auditLogs = JSON.parse(savedLogs);
    }

    if (savedAttempts) {
        failedAttempts = JSON.parse(savedAttempts);
    }

    if (savedLocks) {
        lockUntil = JSON.parse(savedLocks);
    }
}

function saveSecurityState() {
    localStorage.setItem("secureos_lite_logs", JSON.stringify(auditLogs));
    localStorage.setItem("secureos_lite_attempts", JSON.stringify(failedAttempts));
    localStorage.setItem("secureos_lite_locks", JSON.stringify(lockUntil));
}

function addLog(message) {
    var time = new Date().toLocaleTimeString();
    auditLogs.unshift(time + " - " + message);
    saveSecurityState();
    updateLogs();
}

function clearLogs() {
    auditLogs = [];
    saveSecurityState();
    updateLogs();
    document.getElementById("outputBox").innerText = "secureOS> audit logs cleared";
}

function showScreen(id) {
    document.getElementById("bootScreen").classList.add("hidden");
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("desktopScreen").classList.add("hidden");
    document.getElementById(id).classList.remove("hidden");
}

function startBoot() {
    var progress = 0;
    var bootProgress = document.getElementById("bootProgress");
    var bootText = document.getElementById("bootText");

    var timer = setInterval(function () {
        progress = progress + 20;
        bootProgress.style.width = progress + "%";

        if (progress === 40) {
            bootText.innerText = "Checking access matrix...";
        }
        if (progress === 80) {
            bootText.innerText = "Starting authentication service...";
        }
        if (progress >= 100) {
            clearInterval(timer);
            generateCaptcha();
            showScreen("loginScreen");
        }
    }, 500);
}

function updateClock() {
    document.getElementById("clock").innerText = new Date().toLocaleTimeString();
}

function generateCaptcha() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var captcha = "";

    for (var i = 0; i < 5; i++) {
        var index = Math.floor(Math.random() * chars.length);
        captcha = captcha + chars[index];
    }

    currentCaptcha = captcha;
    document.getElementById("captchaText").innerText = captcha;
    document.getElementById("captchaInput").value = "";
}

function findUser(username, password) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
            return users[i];
        }
    }

    return null;
}

function login() {
    var username = document.getElementById("username").value.trim();
    var password = document.getElementById("password").value;
    var captchaInput = document.getElementById("captchaInput").value.trim().toUpperCase();
    var message = document.getElementById("loginMessage");
    var usernamePattern = /^[a-zA-Z0-9_]+$/;
    var now = Date.now();

    if (username === "" || password === "" || captchaInput === "") {
        message.innerText = "All fields are required.";
        message.className = "message error";
        addLog("login validation failed because fields were empty");
        return;
    }

    if (!usernamePattern.test(username)) {
        message.innerText = "Username can contain only letters, numbers, and underscore.";
        message.className = "message error";
        addLog("login validation failed for invalid username format");
        return;
    }

    if (lockUntil[username] && now < lockUntil[username]) {
        var secondsLeft = Math.ceil((lockUntil[username] - now) / 1000);
        message.innerText = "Account locked. Try again after " + secondsLeft + " seconds.";
        message.className = "message error";
        addLog("locked account login attempt for " + username);
        return;
    }

    if (captchaInput !== currentCaptcha) {
        message.innerText = "Captcha failed.";
        message.className = "message error";
        addLog("captcha failed for " + username);
        recordFailedAttempt(username);
        generateCaptcha();
        return;
    }

    var user = findUser(username, password);

    if (user === null) {
        message.innerText = "Login failed.";
        message.className = "message error";
        addLog("login failed for " + username);
        recordFailedAttempt(username);
        generateCaptcha();
        return;
    }

    currentUser = user;
    failedAttempts[username] = 0;
    lockUntil[username] = 0;
    saveSecurityState();
    message.innerText = "";
    document.getElementById("welcomeText").innerText = "Logged in as " + user.username + " (" + user.role + ")";
    document.getElementById("outputBox").innerText = "secureOS> login success\nsecureOS> role loaded: " + user.role;
    addLog("login success for " + user.username);
    showScreen("desktopScreen");
}

function recordFailedAttempt(username) {
    if (username === "") {
        return;
    }

    if (!failedAttempts[username]) {
        failedAttempts[username] = 0;
    }

    failedAttempts[username] = failedAttempts[username] + 1;

    if (failedAttempts[username] >= maxAttempts) {
        lockUntil[username] = Date.now() + lockSeconds * 1000;
        addLog(username + " locked after " + maxAttempts + " failed attempts");
    }

    saveSecurityState();
}

function logout() {
    if (currentUser !== null) {
        addLog("logout by " + currentUser.username);
    }
    currentUser = null;
    document.getElementById("password").value = "";
    generateCaptcha();
    showScreen("loginScreen");
}

function hasPermission(action) {
    if (currentUser.role === "admin") {
        return true;
    }

    if (currentUser.role === "user") {
        return action === "read" || action === "write";
    }

    if (currentUser.role === "guest") {
        return action === "read";
    }

    return false;
}

function viewFiles() {
    if (hasPermission("read")) {
        document.getElementById("outputBox").innerText =
            "secureOS> file access granted\n" +
            "Documents/\n" +
            "Projects/\n" +
            "security_notes.txt";
        addLog("file read granted for " + currentUser.username);
    } else {
        document.getElementById("outputBox").innerText = "secureOS> permission denied";
        addLog("permission denied for file read");
    }
}

function requestAccess() {
    var action = document.getElementById("resourceSelect").value;

    if (hasPermission(action)) {
        document.getElementById("outputBox").innerText =
            "secureOS> access matrix check\n" +
            "role: " + currentUser.role + "\n" +
            "request: " + action + "\n" +
            "result: permission granted";
        addLog(action + " permission granted for " + currentUser.username);
    } else {
        document.getElementById("outputBox").innerText =
            "secureOS> access matrix check\n" +
            "role: " + currentUser.role + "\n" +
            "request: " + action + "\n" +
            "result: permission denied";
        addLog("permission denied for " + currentUser.username + " action " + action);
    }
}

function showSection(id) {
    document.getElementById("labSection").classList.add("hidden");
    document.getElementById("logSection").classList.add("hidden");
    document.getElementById(id).classList.remove("hidden");

    if (id === "logSection") {
        updateLogs();
    }
}

function runSemaphoreLab() {
    var count = parseInt(document.getElementById("processCount").value);
    var output = "secureOS> semaphore simulation\n";
    var semaphore = 1;

    if (isNaN(count) || count < 2) {
        count = 2;
        document.getElementById("processCount").value = count;
    }

    if (count > 8) {
        count = 8;
        document.getElementById("processCount").value = count;
    }

    output = output + "Number of processes: " + count + "\n";
    output = output + "Initial semaphore value = " + semaphore + "\n\n";

    output = output + "Arrival phase:\n";
    for (var i = 1; i <= count; i++) {
        output = output + "P" + i + " arrives and calls wait(S)\n";
        if (i === 1 && semaphore === 1) {
            semaphore = semaphore - 1;
            output = output + "S becomes " + semaphore + ", P1 enters critical section\n";
        } else {
            output = output + "S is 0, so P" + i + " joins waiting queue\n";
        }
    }

    output = output + "\nExecution phase:\n";
    for (var j = 1; j <= count; j++) {
        output = output + "P" + j + " is executing critical section\n";
        output = output + "P" + j + " completes work and calls signal(S)\n";
        semaphore = semaphore + 1;
        output = output + "S becomes " + semaphore + "\n";

        if (j < count) {
            output = output + "Scheduler wakes P" + (j + 1) + " from waiting queue\n";
            output = output + "P" + (j + 1) + " calls wait(S)\n";
            if (semaphore === 0) {
                output = output + "P" + (j + 1) + " is blocked\n";
            } else {
                semaphore = semaphore - 1;
                output = output + "S becomes " + semaphore + ", P" + (j + 1) + " enters critical section\n";
            }
        } else {
            output = output + "All processes completed. Critical section is free.\n";
        }

        output = output + "\n";
    }

    document.getElementById("outputBox").innerText = output;
    addLog("semaphore lab run with " + count + " processes");
}

function runBufferLab() {
    var sampleInput = document.getElementById("bufferInput").value.trim();
    var bufferSize = 10;

    if (sampleInput === "") {
        document.getElementById("outputBox").innerText = "secureOS> buffer lab error\nInput cannot be empty.";
        addLog("buffer lab validation failed because input was empty");
        return;
    }

    if (sampleInput.length > bufferSize) {
        document.getElementById("outputBox").innerText =
            "secureOS> buffer overflow demo\n" +
            "Buffer size: " + bufferSize + "\n" +
            "Input length: " + sampleInput.length + "\n" +
            "Protected mode: input blocked by bounds check.";
        addLog("buffer overflow attempt detected");
    } else {
        document.getElementById("outputBox").innerText =
            "secureOS> buffer overflow demo\n" +
            "Buffer size: " + bufferSize + "\n" +
            "Input length: " + sampleInput.length + "\n" +
            "Result: input safely fits inside buffer.";
        addLog("safe buffer input tested");
    }
}

function runTrapdoorScan() {
    var mode = document.getElementById("trapdoorMode").value;
    var suspiciousUsers = ["admin", "user", "guest"];
    var anomaly = false;

    if (mode === "attack") {
        suspiciousUsers.push("hidden_admin");
    }

    for (var i = 0; i < suspiciousUsers.length; i++) {
        if (suspiciousUsers[i] === "hidden_admin" || suspiciousUsers[i] === "rootkit") {
            anomaly = true;
        }
    }

    if (anomaly) {
        document.getElementById("outputBox").innerText =
            "secureOS> trapdoor scan\n" +
            "Users scanned: " + suspiciousUsers.join(", ") + "\n" +
            "ANOMALY DETECTED: hidden administrator account found";
        addLog("trapdoor anomaly detected");
    } else {
        document.getElementById("outputBox").innerText =
            "secureOS> trapdoor scan\n" +
            "Users scanned: " + suspiciousUsers.join(", ") + "\n" +
            "SAFE";
        addLog("trapdoor scan run");
    }
}

function updateLogs() {
    var logList = document.getElementById("logList");

    if (!logList) {
        return;
    }

    logList.innerHTML = "";

    for (var i = 0; i < auditLogs.length; i++) {
        var div = document.createElement("div");
        div.className = "log-item";
        div.innerText = auditLogs[i];
        logList.appendChild(div);
    }
}

loadSavedData();
setInterval(updateClock, 1000);
updateClock();
startBoot();
