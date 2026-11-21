# Password Strength Analyzer

A client-side web app that checks how strong a password is and generates a secure random one. Everything runs in the browser. No password is sent or stored.

## Problem
Weak and reused passwords are one of the most common causes of account breaches. This tool helps users see why a password is weak and how long it could take to crack.

## Features
- Live strength meter (Weak / Fair / Good / Strong)
- 7 rule checks: length, upper/lowercase, numbers, symbols, common-password list, repeated characters
- Entropy calculation (length x log2 of character pool)
- Estimated brute-force crack time (assumes 10 billion guesses/second)
- Secure password generator using `crypto.getRandomValues`
- Show / hide password toggle
- Responsive, works on mobile

## Tech Stack
HTML, CSS, JavaScript (no libraries)

## How to Run
Open `index.html` in any browser.

## Author
Hema, Final-year B.E. Cyber Security Engineering, Surya Group of Institutions

## Future Improvements
- Check against a large breached-password list (Have I Been Pwned k-anonymity API)
- Passphrase generator
