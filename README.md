# cmd-ctrl

Node/JS CQRS Style Command processor and state manager.

CMD+CTRL helps you manage the state of entities in your domain using a CQRS approach where
Commands (mutating entities) are separated from Queries.

By using Commands and associating htem with CommandHandlers your domain entities will always be 
in a well known state as client will not be able to arbitrarily muttate state.


# Depedencies 

install npm dependency

```
  npm install cmd-ctrl
```

### Getting started using cmd+ctrl with simple in-mem commands

```
///// STEP 1: SETUP

  counter = 0;
  const createUserCmdHandler = {
      name: 'createUser',
      execute: function(command, existingEntity) {
          // existingEntity will be undefined, it's a new user
          const newUser = {};
          newUser.id = counter++;
          newUser.name =  command.data.name;
          newUser.email = command.data.email;
          newUser.type = command.type;
          return newUser;
      },
      validateCommand: function() {},
      preValidateEntity: function() {},
      postValidateEntity: function() {},
  }

const updateUserCmdHandler = {
    name: 'updateUser'
    execute: function(command, entity) {
        entity.name =  command.data.name;
        entity.email = command.data.email;
        return entity;
    },
    validateCommand: function() {},
    preValidateEntity: function() {},
    postValidateEntity: function() {}
}

var cmdctrl = require('cmd-ctrl');
var commandProcessor = cmdCtrl.init([createUserCmdHandler, updateUserCmdHandler]); // pass in an array of command handlers 



///// STEP 3: SUBMIT COMMANDS 

const createUserCommand = {name: 'createUser', type: 'user', data: {name: 'bob', email: 'bob@gmail.com'}};
const updateUserCommand = {name: 'updateUser', id: 1, type: 'user', data: {name: 'bobby', email: 'bobby@gmail.com'}};

const result1 = await commandProcessor.process(createUserCommand); // this will return new user bob with id
console.log(result1);

const result2 = await commandProcessor.process(updateUserCommand);// this will return user with profile update to bobby
console.log(result2);
```




# Examples

see /examples directory for a rest api that uses cmd+ctrl

# Run Tests

  mocha --recursive
