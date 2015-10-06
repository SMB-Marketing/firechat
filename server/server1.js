var Firebase = require('firebase');
var cfg = require('../config');
var FirebaseTokenGenerator = require("firebase-token-generator");
//var db = new Firebase('https://firechat-test-smb.firebaseio.com');

//var generator = new FirebaseTokenGenerator('YOUR-FIREBASE-ADMIN-SECRET-HERE');

var generator = new FirebaseTokenGenerator(cfg.firebase_secret);

var token = generator.createToken(
    {uid:'server1', debug: process.env.NODE_ENV != 'production'},
    //{uid:'server1', debug: true},
     {admin: true});

console.log(token);
console.log('node_env:', process.env.NODE_ENV);

var roomsdb = new Firebase('https://firechat-test-smb.firebaseio.com/company1/room-metadata');
roomsdb.authWithCustomToken(token, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Login Succeeded!", authData);
    roomsdb.on('child_added', function(dataSnapshot, prevChildKey) {
        // code to handle new value.
        console.log('ROOMS:child_added:',dataSnapshot.val(), 'prevChildKey', prevChildKey);
    });

    /*
    roomsdb.on('child_changed', function(dataSnapshot, prevChildKey) {
        // code to handle new value.
        console.log('ROOMS:child_changed:',dataSnapshot.val(), 'prevChildKey', prevChildKey);
    });
    roomsdb.on('value', function(dataSnapshot) {
        // code to handle new value.
        console.log('ROOMS:value:',dataSnapshot.val());
    });
    */
  }
});

/*
var messagesdb = new Firebase('https://firechat-test-smb.firebaseio.com/company1/room-messages');
messagesdb.authWithCustomToken(token, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    console.log("Login Succeeded!", authData);
    messagesdb.on('child_added', function(dataSnapshot) {
        // code to handle new value.
        console.log('MESSAGES:child_added',dataSnapshot.val());
    });
  }
});
*/
