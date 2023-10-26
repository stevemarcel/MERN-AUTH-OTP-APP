# MERN-AUTH-OTP-APP

This project is a comprehensive implementation of user authentication utilizing the MERN (MongoDB, Express, React, Node.js) stack along with various complementary technologies. It is designed to securely manage user registration, email verification, password reset using OTP (One-Time Password), and token-based authentication using JWT (JSON Web Tokens). The use of JWT stored in HTTP-only cookies fortifies the application against common security vulnerabilities like XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery) attacks. This not only simplifies the management of authentication tokens but also ensures automated handling by web browsers, thereby mitigating the risks associated with client-side JavaScript access.

## 🔐 Features

- User Registration: Users can securely register with the application.
- Email Verification: A verification link is sent to the registered email address to confirm user registration, enhancing security.
- Password Reset: One-Time Password (OTP) is utilized for securely resetting user passwords.
- JWT-Based Authentication: JSON Web Tokens (JWT) are employed for secure user authentication.
- HTTP-only Cookies: JWT is stored in HTTP-only cookies for enhanced security against XSS and CSRF attacks.
- Admin-Level User Authorization: Specific functionalities and page access are restricted to admin-level users.

## ⚙️ Installation

To run the project locally, follow these steps:

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Configure the necessary environment variables for email services and database connections.
5. Run the development server using `npm run dev`.

## 🧠 Technologies Used

- <a href="https://reactjs.org/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/react-colored.svg" width="20" height="20" alt="React" /></a> <a href="https://vitejs.dev/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/vite-colored.svg" width="20" height="20" alt="Vite" /></a> [React](https://reactjs.org/): Frontend tooling for fast and efficient web development. (via Vite)
- <a href="https://redux.js.org/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/redux-colored.svg" width="20" height="20" alt="Redux" /></a> [React Redux Toolkit](https://redux.js.org/): Redux state management library for predictable state containers.
- <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/tailwindcss-colored.svg" width="20" height="20" alt="TailwindCSS" /></a> [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for rapid UI development.
- <a href="https://nodemailer.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/stevemarcel/SVG/main/img/json-web-tokens-jwt.svg" width="20" height="20" alt="JWT" /></a> [JWT](https://jwt.io/): Secure method for transmitting information between parties as a JSON object.
- <a href="https://nodemailer.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/stevemarcel/SVG/main/img/NodeMailer.svg" width="20" height="20" alt="NodeMailer" /></a> [Nodemailer](https://nodemailer.com/about/): Module for sending emails from Node.js applications.
- [Bcrypt](https://www.npmjs.com/package/bcrypt): Password-hashing function for securely storing passwords.
- <a href="https://expressjs.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/express-colored-dark.svg" width="20" height="20" alt="Express" /></a> [Express](https://expressjs.com/): Backend framework for handling HTTP requests and routes.
- <a href="https://www.mongodb.com/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/mongodb-colored.svg" width="20" height="20" alt="MongoDB" /></a> [MongoDB](https://www.mongodb.com/): NoSQL database for data storage.
- <a href="https://nodejs.org/en/" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/nodejs-colored.svg" width="20" height="20" alt="NodeJS" /></a> [NodeJS](https://nodejs.org/en/): JavaScript runtime for server-side development.
- <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/javascript-colored.svg" width="20" height="20" alt="JavaScript" /></a> [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript): High-level programming language for web development.
- <a href="https://developer.mozilla.org/en-US/docs/Glossary/HTML5" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/html5-colored.svg" width="20" height="20" alt="HTML5" /></a> [HTML5](https://developer.mozilla.org/en-US/docs/Glossary/HTML5): Standard markup language for creating web pages and web applications.
- <a href="https://www.w3.org/TR/CSS/#css" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/danielcranney/readme-generator/main/public/icons/skills/css3-colored.svg" width="20" height="20" alt="CSS3" /></a> [CSS3](https://www.w3.org/TR/CSS/#css): Style sheet language for describing the presentation of a document written in HTML.

## 👨🏾‍💻 Usage

1. Register with the application using a valid email address.
2. Check your email for a verification link to confirm your registration.
3. Utilize the OTP functionality for securely resetting your password.
4. Enjoy seamless and secure user authentication with the implemented JWT-based system.

## 🛡️ Security Considerations

- The use of email verification and OTP enhances the security of the authentication process.
- The implementation of HTTP-only cookies protects against Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF) attacks.
- JWT implementation ensures secure transmission of data between the client and server, reducing the risk of data tampering and unauthorized access.

## 🫱🏾‍🫲🏻 Contributors

- [Stephen Onyejuluwa](https://github.com/stevemarcel)

## 📜 License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

### 🖥️ 📲 Check out the live preview

<!-- [<kbd> <br> MERN AUTH OTP APP <br> </kbd>][Link]

[Link]: https://spring-bud-octopus-shoe.cyclic.app/ 'MERN AUTH OTP APP' -->
