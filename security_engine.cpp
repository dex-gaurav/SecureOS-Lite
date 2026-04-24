#include <iostream>
#include <string>
using namespace std;

// Simple educational hash.
// This is NOT real cryptography. It only demonstrates hashing logic.
int simpleHash(string text) {
    int hash = 0;

    for (int i = 0; i < text.length(); i++) {
        hash = hash + text[i] * (i + 1);
        hash = hash % 100000;
    }

    return hash;
}

// Checks username and password against hardcoded sample users.
void verifyLogin() {
    string username;
    string password;

    cout << "Enter username: ";
    cin >> username;

    cout << "Enter password: ";
    cin >> password;

    if (username == "admin" && password == "admin123") {
        cout << "Login successful. Role: Admin\n";
    } else if (username == "user" && password == "user123") {
        cout << "Login successful. Role: User\n";
    } else if (username == "guest" && password == "guest123") {
        cout << "Login successful. Role: Guest\n";
    } else {
        cout << "Login failed.\n";
    }

    cout << "Educational password hash: " << simpleHash(password) << "\n";
}

// Checks basic password strength using loops and if-else.
void checkPasswordStrength() {
    string password;
    int hasUpper = 0;
    int hasLower = 0;
    int hasDigit = 0;
    int hasSpecial = 0;

    cout << "Enter password to check: ";
    cin >> password;

    for (int i = 0; i < password.length(); i++) {
        char ch = password[i];

        if (ch >= 'A' && ch <= 'Z') {
            hasUpper = 1;
        } else if (ch >= 'a' && ch <= 'z') {
            hasLower = 1;
        } else if (ch >= '0' && ch <= '9') {
            hasDigit = 1;
        } else {
            hasSpecial = 1;
        }
    }

    if (password.length() >= 8 && hasUpper && hasLower && hasDigit && hasSpecial) {
        cout << "Password strength: STRONG\n";
    } else {
        cout << "Password strength: WEAK\n";
        cout << "Use 8 characters, uppercase, lowercase, digit, and special symbol.\n";
    }
}

// Demonstrates an access matrix:
// Admin = read, write, execute
// User  = read, write
// Guest = read only
void accessCheck() {
    string role;
    string action;
    int allowed = 0;

    cout << "Enter role (admin/user/guest): ";
    cin >> role;

    cout << "Enter action (read/write/execute): ";
    cin >> action;

    if (role == "admin") {
        allowed = 1;
    } else if (role == "user" && (action == "read" || action == "write")) {
        allowed = 1;
    } else if (role == "guest" && action == "read") {
        allowed = 1;
    }

    if (allowed) {
        cout << "Permission granted by access matrix.\n";
    } else {
        cout << "Permission denied by access matrix.\n";
    }
}

// Demonstrates a semaphore protecting a critical section.
void semaphoreSimulation() {
    int semaphore = 1;
    int processCount;

    cout << "Enter number of processes: ";
    cin >> processCount;

    if (processCount < 2) {
        processCount = 2;
    }

    if (processCount > 10) {
        processCount = 10;
    }

    cout << "Number of processes: " << processCount << "\n";
    cout << "Initial semaphore value: " << semaphore << "\n";

    cout << "\nArrival phase:\n";
    for (int i = 1; i <= processCount; i++) {
        cout << "P" << i << " arrives and calls wait(S)\n";

        if (i == 1 && semaphore == 1) {
            semaphore--;
            cout << "S becomes " << semaphore << ", P1 enters critical section\n";
        } else {
            cout << "S is 0, so P" << i << " joins waiting queue\n";
        }
    }

    cout << "\nExecution phase:\n";
    for (int i = 1; i <= processCount; i++) {
        cout << "P" << i << " is executing critical section\n";
        cout << "P" << i << " completes work and calls signal(S)\n";
        semaphore++;
        cout << "S becomes " << semaphore << "\n";

        if (i < processCount) {
            cout << "Scheduler wakes P" << i + 1 << " from waiting queue\n";
            cout << "P" << i + 1 << " calls wait(S)\n";
            semaphore--;
            cout << "S becomes " << semaphore << ", P" << i + 1 << " enters critical section\n\n";
        } else {
            cout << "All processes completed. Critical section is free.\n";
        }
    }
}

