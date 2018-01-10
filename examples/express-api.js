
const cmdCtrl = require('../index.js'); //source internally
const ApiResource = require('./ApiResource.js');
const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

var commandProcessor = cmdCtrl.init(__dirname + '/commands');
var repository = cmdCtrl.getInMemRepository();

/**
 * TEST via command line:
 *
 * curl -vvv -X PUT  http://localhost:3000/api/User/1/createUser  -d '{"id": "1", "name":"bob","password":"foobar"}' -H "Content-Type: application/json"
 */


/**
 * CQRS Command channel REST API handler 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
var apiCommandHandler = function(request, response, next) {
  const command = createCommand(request);
  const result = commandProcessor.process(command);
  //console.log('[apiCommandHandler()] commandProcessor result=' + JSON.stringify(result));
  if (result.entity != undefined && result.entity.id != undefined) {
    const resource = new ApiResource(result.entity); 
    //console.log('[apiCommandHandler()] ApiResource.url()=' + JSON.stringify(resource.url()));
    response.header('Content-Location', resource.url().href);
    response.header('Content-Type', 'application/json');
    response.sendStatus(201);
  } else if (result.ok === false) {
    response.sendStatus(500); //server error
  } else {
    response.sendStatus(204); // deleted = no content
  }
  next();
};



/**
 * CQRS Query channel REST API handler
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 */
var apiQueryHandler = function(request, response, next) {
  let id = request.params.id;
  let entityName = request.params.entity;
  if (id) {
    const entity = repository.getById(id, entityName);
    //console.log('[apiQueryHandler()] getEntityByID: ' + JSON.stringify(entity));
    response.send(entity);
  } else {
    const entities = repository.getAll(entityName);
    //console.log('[apiQueryHandler()] getAllEntities: ' + JSON.stringify(entities));
    response.send(entities);
  }
  next();
};


/**
 * Configure http server
 */

app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(PORT);
app.route('/api/:entity').post(apiCommandHandler).get(apiQueryHandler);
app.route('/api/:entity/:id').get(apiQueryHandler);
app.route('/api/:entity/:id/:command').put(apiCommandHandler).get(apiQueryHandler);




/**
 * Create Command object from http request
 * @param {*} request 
 */
function createCommand(request) {
  const id = request.params.id;
  const entityName = request.params.entity;
  const restCommandName = request.params.command;
  const httpBody = request.body;
  const httpMethod = request.method;
  const path = request.path;

  const commandName = (id != undefined && restCommandName != undefined) ? restCommandName : entityName + 'Create'; //command name not supplied for new entity types so use convention

  const command = {
    id: id,
    name: commandName,
    type: entityName,
    date: new Date(),
    source: 'rest-api',
    headers: {
      http_method: httpMethod,
      api_url: request.path
    },
    data: httpBody
  }
    //console.log('apiCommandHandler(): command=' + JSON.stringify(command));
  return command;
}


