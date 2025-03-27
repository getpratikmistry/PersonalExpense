# DailyExpense

## 📌 Project Overview

DailyExpense is a **Single Page Application (SPA)** built with **Angular** to manage daily expenses. The application is hosted on a shared server and interacts with multiple APIs for expense tracking, user authentication, and other functionalities.

## 🚀 Features

- User authentication with `authGuard` protection
- Dashboard for tracking expenses
- Ability to add, update, and delete expenses
- Angular Routing for seamless navigation
- API accessibility check before making multiple requests
- PrimeNG components such as **ConfirmPopup**, **ConfirmDialog**, and **AutoComplete**
- Proper caching and font management

---

## 🛠️ Setup & Installation

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/yourusername/dailyexpense-ui.git
cd dailyexpense-ui
```

### **2️⃣ Install Dependencies**

```sh
npm install
```

### **3️⃣ Environment Setup**

Modify `src/environments/environment.ts` and `src/environments/environment.prod.ts` as per your backend API URLs.

### **4️⃣ Build the Project**

#### 🔹 Development Build

```sh
ng build --configuration=development
```

- Output: `dist/dev/`

#### 🔹 Production Build

```sh
ng build --configuration=production
```

- Output: `dist/prod/`

### **5️⃣ Run the Application**

```sh
ng serve
```

- Default URL: `http://localhost:4200`

---

## 🌍 Hosting & Deployment

For shared hosting, ensure:

- `.htaccess` is configured correctly to route requests to `index.html`
- `outputPath` in `angular.json` is set for `dist/dev/` or `dist/prod/`
- API base URLs are correctly defined in environment files

### **🔹 .htaccess Configuration (Apache)**

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /dailyexpenseui/
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [QSA,L]
</IfModule>
```
## Tech Stack

This project is built using the following technologies:

### Frontend:
- **Angular**: A platform and framework for building client-side applications with HTML, CSS, and JavaScript/TypeScript.
  - **Angular CLI**: Command-line interface for Angular for building, testing, and deploying applications.
  - **RxJS**: A library for reactive programming using Observables, for handling asynchronous events.
  - **Angular Material**: A UI component library for Angular, following Material Design principles.
  - **NgRx**: Reactive state management library for Angular, based on Redux principles.

### Styling:
- **CSS**: Standard styling language used for layout and design.
- **SCSS**: SASS (Syntactically Awesome Stylesheets) for writing more maintainable and scalable CSS.

### Testing:
- **Jasmine**: Behavior-driven testing framework for testing Angular components and services.
- **Karma**: Test runner for Angular applications, used to run the tests in various browsers.
- **Protractor**: End-to-end testing framework for Angular apps.

### Development Tools:
- **Node.js**: JavaScript runtime environment used for running build tools and package management.
- **npm**: Node package manager for installing and managing dependencies.
- **TypeScript**: A superset of JavaScript, adding static typing to the language.
- **Webpack**: Module bundler for JavaScript and assets.
- **ESLint**: Linting tool for maintaining consistent code quality and style.

### Deployment:
- **Firebase Hosting**: Web hosting platform used for deploying the application (or replace with your preferred hosting platform).
- **Docker**: Containerization platform (optional, if used for local or cloud deployment).

### Version Control:
- **Git**: Distributed version control system for managing source code history.
- **GitHub**: Platform for hosting the repository, collaboration, and version control.

### Miscellaneous:
- **Prettier**: Code formatter for consistent code style across the application.

## 📜 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pratik Mistry**

---

## 📞 Support

If you encounter any issues, feel free to open an issue in the repository.

Happy coding! 🚀

