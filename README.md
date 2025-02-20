# **rm-app**

A monorepo project with a **Spring Boot** backend and a **Next.js** frontend.

---

## **Getting Started**

### **Backend**

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### **Frontend**

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies and start the development server:
   ```bash
   npm install
   npm run dev
   ```

---

The backend will run on `http://localhost:8080` and the frontend on `http://localhost:3000`.

Run migration

mvn flyway:migrate \
-Dflyway.url="jdbc:sqlserver://localhost:1433;databaseName=rm_management;encrypt=false" \
-Dflyway.user="sa" \
-Dflyway.password="123" \
-Dflyway.baselineOnMigrate=true \
-Dflyway.outOfOrder=true
