# awesomeBurger
This is a simple toy Full-stack JavaScript application using Node, Express, HandleBars, jQuery, Bootstrap, with MySQL for data persistence.

For the drag and drop functionality (you can drag a burger you want to devour from the "available burgers" column to the "devoured bugers" column) with https://johnny.github.io/jquery-sortable/.

A usable demo of the application is deployed at https://peaceful-temple-31844.herokuapp.com/

This is a basic Node/Express application demoed to function as a Burger ordering application. The application uses Node/Express for the backend, MySql for data persistence persistence, and the front end is generated with Handlbars, with interactivy provided by Jquery/Bootstrap features.

If you would like to run on your own server, you can clone the project.
## To Run:
First, you need git, node, npm, and mysql installed. Assuming your ready for that:

```
git clone https://github.com/semlak/burger/
cd burger
npm install
```

Before running ```npm start```, you need to setup your MySql credentials and create the initial database. The credentials go in an .env file (not provided by the repository, due to the data being private).
The format for the .env file is as follows:
```
# your .env file
DBHOST='localhost'
DBPORT=3306
DBUSER='YourUserNameInQuotes'
DBPASSWD='YourPasswordInQuotes'
```

# Creating the database.
These mysql commands assume your user account has a password. The -p argument will propmpt you for a password. Leave off if you have no password.
To create the database, run `mysql -p < db/schema.sql`  
If you would like to seed the database with some initial data (not required), run `mysql -p < db/seeds.sql`
