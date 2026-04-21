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

