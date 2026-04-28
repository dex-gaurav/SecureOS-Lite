# SecureOS AuthShield Lite

SecureOS AuthShield Lite is a small educational Operating Systems security project. It simulates a simple OS login environment, access matrix, audit logs, semaphore behavior, buffer overflow protection, and trapdoor scanning.

The project is intentionally simple and manually coded for college submission and viva.

## Files

```text
index.html
style.css
script.js
security_engine.cpp
README.md
```

No framework, package, database, API, or external library is used.

## Project Objective

The objective is to demonstrate important OS security concepts in a beginner-friendly way:

1. Authentication
2. Captcha verification
3. Access matrix
4. Critical section and semaphore
5. Buffer overflow prevention
6. Trapdoor detection
7. Audit logging

## How To Run The Web Project

Open `index.html` directly in a browser.

Sample users:

```text
admin / admin123
user / user123
guest / guest123
```

After login, the desktop screen shows:

- View Files
- Request Resource Access
- Run Security Lab
- View Audit Logs

## How To Run The C++ Engine

Compile:

```bash
g++ security_engine.cpp -o security_engine
```

Run:

```bash
./security_engine
```

On Windows, run:

```bash
security_engine.exe
```

## C++ Menu Options

```text
1 Verify login
2 Check password strength
3 Access check
4 Semaphore simulation
5 Buffer overflow demo
6 Trapdoor scan
0 Exit
```

## OS Concepts Demonstrated

### Authentication

The project verifies username and password manually. No authentication library is used.

### Captcha

JavaScript generates a random five-character captcha. The user must type it correctly before login.

### Access Matrix

Permissions are manually checked:

```text
Admin : read, write, execute
User  : read, write
Guest : read
```

### Semaphore

The semaphore simulation shows one process executing in a critical section while other processes wait or block.

In the web lab, enter the number of processes, for example:

```text
4
```

The output will show each process calling `wait(S)` line by line.
It also shows every process entering the critical section, completing work, calling `signal(S)`, and finally all processes completing.

In the C++ program, choose option `4` and enter the process count.

### Buffer Overflow Prevention

The web lab and C++ program compare input length with a fixed buffer size. If input is too large, protected mode blocks it.

Use this safe input:

```text
HELLO
```

Use this overflow input:

```text
AAAAAAAAAAAAAAAA
```

### Trapdoor Detection

The trapdoor scan checks for suspicious account names such as hidden admin or backdoor users.

In the web lab:

```text
Normal user list -> SAFE
Inject hidden_admin -> ANOMALY DETECTED
```

In the C++ program, choose trapdoor scan and enter:

```text
safe
```

or:

```text
attack
```

### Audit Logs

The web project stores actions in a JavaScript array and displays them in the audit log panel.

## Viva Questions

### 1. What is the purpose of this project?

It demonstrates basic OS security concepts using simple manually written code.

### 2. What is authentication?

Authentication verifies the identity of a user using credentials such as username and password.

### 3. What is an access matrix?

An access matrix defines which role can perform which action on a resource.

### 4. What is a semaphore?

A semaphore is a synchronization variable used to control access to a critical section.

### 5. What is a critical section?

A critical section is a part of a program where shared resources are accessed and must be protected.

### 6. What is buffer overflow?

Buffer overflow happens when input is larger than the memory buffer reserved for it.

### 7. How does this project prevent buffer overflow?

It checks the input length before accepting it into the buffer.

### 8. What is a trapdoor?

A trapdoor is a hidden entry point or hidden account that can bypass normal security checks.

### 9. Is this production-level security?

No. It is an educational simulator. Real systems need secure cryptography, databases, server-side validation, and hardened authentication.

