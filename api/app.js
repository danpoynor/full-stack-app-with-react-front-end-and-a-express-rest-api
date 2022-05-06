const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

/* Variable to enable global error logging */
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

/**
 * Setup Express
 */

const app = express();
app.use(cors({
  exposedHeaders: ['Location'],
}));
app.use(express.json());
app.use(morgan('dev'));

/**
 * Express Routes
 */

app.use('/api/courses', require('./routes/courses'));
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!'
  });
});

// List some details about each defined route. Adapted from:
// https://stackoverflow.com/questions/14934452/how-to-get-all-registered-routes-in-express#answer-51368005
function listRoutes(routes, stack, parent){
  parent = parent || '';
  if (stack) {
    stack.forEach((r) => {
      if (r.route && r.route.path){
        let method = '';
        for(method in r.route.methods){
          if(r.route.methods[method]){
            routes.push({path: parent + r.route.path, method: method.toUpperCase()});
          }
        }
      } else if (r.handle && r.handle.name === 'router') {
        const routerName = r.regexp.source.replace("^\\","").replace("\\/?(?=\\/|$)","").replace(/\\/g, '');
        return listRoutes(routes, r.handle.stack, parent + routerName);
      }
    });

    // Return routes sorted by path
    // REF: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
    return routes.sort((a, b) => {
      if (a.path < b.path) {
        return -1;
      }
      if (a.path > b.path) {
        return 1;
      }
      return 0;
    })
  } else {
    return listRoutes([], app._router.stack);
  }
}

if (listRoutes().length === 0) {
  console.log('❌ No routes found');
} else {
  console.log(`✅ ${listRoutes().length} Routes found:`, listRoutes());
}

/**
 * Sequelize
 */

const { sequelize } = require('./models');

/**
 * Test db connection, and list tables, models
 *
 * NOTE: When using SQLite, sequelize.getDatabaseName() returns 'undefined'
 * even though .authenticate() is successful. sequelize.getDatabaseName() does
 * not read the config.json 'storage' value when dialect is set to 'sqlite',
 * so I kept the 'database' value in config.json, even though I don't think
 * it should be needed. Potential Sequelize issue or feature request needed.
 */
sequelize
  .authenticate()
  .then(() => {
    // NOTE: If the storage value (SQLite database name) changes in config.json, Sequelize will
    // create a new empty database with the new name if it doesn't already exist. So this will
    // always return 'Connection to '<storage value>' database established'.
    //
    // ANSI escape sequences used to colorize the output
    // \x1b[22m\x1b[32m - for bright green text
    // \x1b[0m - for resetting the color
    //
    console.log(
      `✅ Connection to '\x1b[22m\x1b[32m${sequelize.getDialect()}\x1b[0m' database '\x1b[22m\x1b[32m${sequelize.getDatabaseName()}\x1b[0m' established.`
    );

    // List user-defined tables in the database
    // This excludes any auto generated internal tables, such as 'sqlite_sequence'.
    sequelize.queryInterface.showAllTables().then((tables) => {
      if (tables.length === 0) {
        console.log('❌ No tables found');
      } else {
        console.log(`✅ ${tables.length} Tables found:`, tables, '(Uncomment lines below to copy model starters)');
        /**
         * NOTE: To get the schema for each table, uncomment the following.
         * This might be useful when manually defining models for an existing
         * database, though output would still need editing.
         */
        // tables.forEach((table) => {
        //   console.log(`======== > Table name: ${table}`);
        //   sequelize.queryInterface.describeTable(table).then((results) => {
        //     console.log(`\n${table}`, results);
        //   });
        // });
      }

    });

    // List defined models
    const models = sequelize.models;
    Object.keys(models).forEach(async (modelName) => {
      sequelize.isDefined(modelName)
        ? console.log(`✅ Model '\x1b[22m\x1b[32m${modelName}\x1b[0m' is defined. Table name is '\x1b[22m\x1b[32m${models[modelName].tableName}\x1b[0m'.`)
        : console.log(`❌ Model ${modelName} is not defined`);
    });
  })
  .catch((err) => {
    console.log('❌ Unable to connect to the database:', err);
  });

/**
 * Error Handling
 */

// Send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  });
});

// Setup a global error handler
app.use((err, req, res) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

/**
 * Start Server
 */

// Set our port
app.set('port', process.env.PORT || 5000);

// Start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`✅ Express server is listening on port \x1b[22m\x1b[32m${server.address().port}\x1b[0m`);
});
