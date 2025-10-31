# PathLock Full-Stack Coding Assignment

This repository contains the completed solutions for the PathLock coding assignments, including a basic Task Manager and an advanced, full-stack Project Manager application.

---

##  Mini Project Manager (Assignment 2)

This is a comprehensive, full-stack project management application built with .NET 8 and React (TypeScript). It includes user authentication, project/task management, and a dynamic task scheduler.

###  **Live Links**

* **Live Frontend (Vercel):** [https://path-lock-coding-assignment.vercel.app](https://path-lock-coding-assignment.vercel.app)
* **Live Backend API (Render):** [https://pathlock-codingassignment.onrender.com/swagger](https://pathlock-codingassignment.onrender.com/swagger)

---

##  Features

### Core Functionality
* **JWT Authentication:** Full user registration and login system.
* **Protected Routes:** Users can only access project data they own.
* **Project Management:** Create, read, and delete projects.
* **Task Management:** Create, read, update (completion), and delete tasks within projects.
* **Database:** All data is persisted in a relational SQLite database.

### Advanced Enhancements
* **Dynamic Task Scheduler:** A "Smart Scheduler" API that uses a topological sort algorithm to calculate the optimal task order based on dependencies.
* **Polished UI:** The frontend is built with `react-bootstrap` and features modal forms for a clean user experience.
* **Loading & Error Feedback:** All actions provide user feedback with loading spinners and clear error alerts.
* **Mobile-Friendly:** The application is fully responsive for use on mobile devices.
* **Full Deployment:** The backend is deployed on Render and the frontend on Vercel.

---

##  Tech Stack

| Backend | Frontend | Deployment |
| :--- | :--- | :--- |
| C# .NET 8 | React 18 | Render (Backend) |
| ASP.NET Core Web API | TypeScript | Vercel (Frontend) |
| Entity Framework Core 8 | React Bootstrap | Docker |
| SQLite | Axios | Git & GitHub |
| JWT (JSON Web Tokens) | React Router | |

---

##  How to Run Locally

To run the main project (`ProjectManager.Api` and `client-pm`) on your local machine:

### **Prerequisites**
* [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
* [Node.js (LTS)](https://nodejs.org/en)

### **1. Backend Setup (ProjectManager.Api)**

```bash
# 1. Navigate to the backend folder
cd ProjectManager.Api

# 2. Restore .NET packages
dotnet restore

# 3. Run database migrations to create the .db file
dotnet ef database update

# 4. Run the application
dotnet run
```
The API will be running at http://localhost:XXXX (check your terminal for the port).

### **2. Frontend Setup (ProjectManager.Api)**
```bash
# 1. In a new terminal, navigate to the frontend folder
cd client-pm

# 2. Install npm packages
npm install

# 3. Start the React development server
npm start
```
The React app will open at http://localhost:3001.

Note: You may need to adjust the API_URL in client-pm/src/services/api.ts to match the port your backend is running on.

##  Basic Task Manager (Assignment 1)

The repository also contains the solution for the first assignment. The code is located in:

Backend: /TaskManager.Api

Frontend: /client


