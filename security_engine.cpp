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

