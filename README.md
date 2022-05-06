# Full Stack App with React Frontend and Express REST API Backend

This demo allows users to administer a school database containing information about courses. Users are able to create a new account or sign in with an existing account, retrieve a list of existing courses and view details for a course. Once authenticated, they are able to create, update, or delete courses.

---

## Start the Backend Express REST API application

```csh
cd api
npm install
npm run seed
npm start
```

Then visit <http://localhost:5000/> in your browser and your see the message "Welcome to the REST API project!".

## Start the Frontend React client UI application

```csh
cd client
npm install
npm start
```

Then visit <http://localhost:3000/> in your browser and your see the UI for the Courses web application.
