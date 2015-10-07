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

var rooms={};

var ref = new Firebase('https://firechat-test-smb.firebaseio.com/company1');

//var roomsdb = new Firebase('https://firechat-test-smb.firebaseio.com/company1/room-metadata');
var roomsdb = ref.child('room-metadata');
var messagesdb = ref.child('room-messages');

roomsdb.authWithCustomToken(token, function(error, authData) {
  if (error) {
    console.log("Login Failed!", error);
  } else {
    //console.log("xxxLogin Succeeded!", authData);
    roomsdb.on('child_added', function(dataSnapshot, prevChildKey) {
        // code to handle new value.
        //console.log('xxxROOMS:child_added:',dataSnapshot.val(), 'prevChildKey', prevChildKey);
        rooms[dataSnapshot.key()]=dataSnapshot.val();
                if (dataSnapshot.val().style === 'form'){
                listen(dataSnapshot.key());
                }
    });
    //listenForMessages();

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

function listen(roomId){
      roomsdb.child(roomId).once('value', function(snapshot) {
        messagesdb.child(roomId).on('child_added', function(snapshot) {
          //self._onNewMessage(roomId, snapshot);
            //console.log(roomId, snapshot.val());
            var message = snapshot.val();
            console.log('from room: ', rooms[roomId].name,message.name, message.amount, message.offertype );
        }, /* onCancel */ function() {
          // Turns out we don't have permission to access these messages.
          console.error('cannot read');
          //self.leaveRoom(roomId);
        });
      });
}


function listenForMessages() {
    //var messagesdb = new Firebase('https://firechat-test-smb.firebaseio.com/company1/room-messages');
    messagesdb.authWithCustomToken(token, function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            //console.log("xxxLogin Succeeded!", authData);
            messagesdb.on('child_added', function(dataSnapshot, prevChildKey) {
            console.log('QQQ',dataSnapshot.val());
                // code to handle new value.
                //console.log('xxxQQQ:', rooms);
                //console.log('xxxQQQ: from room: ', rooms[dataSnapshot.key()]);
                //console.log ('xxx',rooms[dataSnapshot.key()].type );
                //console.log ('xxx',rooms[dataSnapshot.key()] );

                if (rooms[dataSnapshot.key()].style === 'form'){
                var message=dataSnapshot.val();
                console.log('from room: ', message);
                //console.log('from room: ', rooms[dataSnapshot.key()].name,message.name, message.amount, message.offertype, message);
                }
                //console.log('xxxQQQ: from room: ', rooms[dataSnapshot.key()]);
                //console.log('xxxMESSAGES:child_added', dataSnapshot.val());
            });
        }
    });
}
