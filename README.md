# prisma-team-management

Take Home Assignment: Full-Stack Engineer

## Install & run

After cloning the project run

```
npm install
```

In order to run it the application expects a set of environment variables that should allow to create and initialize the database on your local machine.
Make sure you've a running postgreSQL server on your local environment and set the following variables:

```
DATABASE_URL=postgres://YOUR_USER:YOUR_PASSWORD@localhost/prisma-test
DB_NAME=prisma-test
DB_USER=YOUR_USER
DB_HOST=127.0.0.1
DB_PASSWORD=YOUR_PASSWORD
```

In my local environment I've a `.env` file with the above structure.

To run the project in dev mode

```
npm run dev
```

Running the built version assumes you already created a db (the script will only create one if not existing, but only in development mode). This is to make sure the production database is correctly set up in the right environment.

To build and run it you should

```
npm run build
npm run start
```

This will run a script defined in `db_setup.js` that will create the database `prisma-test`, create the schema and insert some mock data in the new db.

## Data model design

The first step approching the assignment has been defining the data models and consequently the schema of the relative database:

-   Team
    -   id (unique)
    -   name
    -   parent team id
    -   metadata
-   Team member
    -   id (unique)
    -   name
    -   email
    -   avatar url
    -   active (true / false)
-   Role
    -   id (unique)
    -   name

The following assumptions have been applied:

-   Each team can have any number of members >= 0
-   A team member can be part of multiple teams but
-   A team member can be part of a team only once, with only 1 single role
-   A team member can have different roles in different teams

The membership of a team member to a certain team is then defined as a tuple:

-   member id
-   team id
-   role id
    With the couple member id / team id having a UNIQUE constraint

## UI Design

To accomodate the app requirements a set of 3 differente views has been designed:

-   the home page containing the list of all teams in hierarchical view
-   the single user detail view
-   the single team detail view

### Teams tree view

From this page all teams are shown, it is possible to expand / collapse the tree nodes as needed to show / hide its members and descendant teams.

### User detail view

From this page it is possible to

-   edit the user details (name, email, active status),
-   edit the roles assigned to the user in the different teams they belong,
-   adding new teams memberships.

### Team detail view

From this page it is possible to

-   edit the team details (name),
-   edit its position in the teams hiearchy (note that only the teams who aren't descendent of the given team will be visible in the dropdown),
-   add / remove team members

## Query design

The query used to retrieved the teams tree required extra care as it needed to be a recursive query to be able to obtain a flat list of teams with relative team members and roles, counting at the same time the depth (level).

The other parametrized queries are straightforward, and most of the aggregation happens directly on the nodeJS side to have a cleaner and simpler control. I just needed to make sure not to leave open any door for SQLI.

## Testing

Testing is only outlined in this exercise. The following parts would need deeper testing:

-   UI components need unit testing (e.g. TeamMemberSelector, TeamMembershipSelector)
-   Remix route components need to be unit and e2e tested via

```
import { createRemixStub } from "@remix-run/testing";
```

-   actions needs testing

## Production deployment and serving

Production deployment can be done in many different ways and using different available commercial services.
In general, I believe that the best architecture is to run Remix in a managed container on a long-lived server, using the backend-for-frontend pattern within the app, and occasionally calling serverless functions for workloads that demand it. Setting up a docker container for the app is what I'd move forward doing.

App server and database should stay as close to each other as possible as this could easily be the single most important performance factor. For instance, hosting your app on Vercel and having each loader and action call an API server hosted somewhere else is going to make performance a lot worse.
Good options can then be Vercel, Fastly or Netlify, dependening on costs and specific requirements.

## Final notes

The application is merely an exercise, and many things can be improved. From logging and monitoring, to error handling. Many corner cases could be improved and the UI/styling is just a basic setup to showcase what has been achievable in 5-6 hours of work.

The idea has been to use as little libraries and external code as possible, in a real scenario many more "standard" components and libraries could be employed.
