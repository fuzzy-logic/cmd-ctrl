
///// STEP 1: STEUP COMMAND PROCESSOR

counter = 1;
const createUserCmdHandler = {
    name: 'createUser',
    execute: function(command, existingEntity) {
        // existingEntity will be undefined, it's a new user
        const newUser = {};
        newUser.id = counter++;
        newUser.name =  command.data.name;
        newUser.email = command.data.email;
        newUser.type = command.type;
        newUser.version = 1;
        return newUser;
    },
    validateCommand: function() {},
    preValidateEntity: function() {},
    postValidateEntity: function() {},
}

const updateUserCmdHandler = {
  name: 'updateUser',
  execute: function(command, entity) {
      entity.name =  command.data.name;
      entity.email = command.data.email;
      entity.version++;
      return entity;
  },
  validateCommand: function() {},
  preValidateEntity: function() {},
  postValidateEntity: function() {}
}

var cmdctrl = require('../index.js');
var commandProcessor = cmdctrl.init([createUserCmdHandler, updateUserCmdHandler]); // pass in an array of command handlers 



///// STEP 3: SUBMIT COMMANDS 

const createUserCommand = {name: 'createUser', type: 'user', data: {name: 'bob', email: 'bob@gmail.com'}};
const updateUserCommand = {name: 'updateUser', id: 1, type: 'user', data: {name: 'bobby', email: 'bobby@gmail.com'}};

const result1 =  commandProcessor.process(createUserCommand); // this will return new user bob with id
console.log(result1);

const result2 =  commandProcessor.process(updateUserCommand);// this will return user with profile update to bobby
console.log(result2);