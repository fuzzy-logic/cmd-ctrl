const assert = require('assert');
var request = require("superagent");
require('./express-api.js');
const JSON = require('circular-json');

/**
 * Test REST API
 * 
 */
describe('test rest api', function () {

    before(function() {
        // runs before all tests in this block
    });
        
    it('test crate new user via rest api', async function () {
        
        const entity  = 'Customer';
        const newCustomerDan = {
            name: "dan",
            email: "dan@gmail.com"
        };

        const baseUrl = 'http://localhost:3000/api'; //TODO inconsistent url base path for POST and GETS (Get)
        const postUrl = baseUrl + '/' + entity;

        ///// STEP 1: POST new user
        const postNewUserRequest = request.post(postUrl).set('Content-Type', 'application/json');
        const postNewUserResponse = await postNewUserRequest.send(JSON.stringify(newCustomerDan));
        const resourcePath = postNewUserResponse.header['content-location'];
        const body = postNewUserResponse.text;
        console.log("TEST REST API POST Response: " + postNewUserResponse.status + ' ' + postNewUserResponse.text + ' ' + resourcePath);
        assert.equal(201, postNewUserResponse.status);

        ///// STEP 2: GET newly POST'd user
        const getNewUserResponse = await request.get(baseUrl + resourcePath);
        console.log("TEST REST API GET " + resourcePath + "  Response: " + getNewUserResponse.status + ' ' + getNewUserResponse.text);
        const newUserEntity = JSON.parse(getNewUserResponse.text);
        assert.equal(200, getNewUserResponse.status);
        assert.equal(newCustomerDan.name, newUserEntity.name);
        assert.equal(newCustomerDan.email, newUserEntity.email);


        ///// STEP 3: GET all users
        const allUsersResponse = await  request.get(baseUrl + '/' + entity);
        console.log("TEST REST API GET /User Response: " + allUsersResponse.status + ' ' + allUsersResponse.text);
        const allUsers = JSON.parse(allUsersResponse.text);
        assert.equal(200, allUsersResponse.status);
        assert.equal(1, allUsers.length);

    });



});