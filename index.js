const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./db');
db.connect();

const app = express();
const port = process.env.PORT || 4001;

const server = app.listen(port, () => {
    console.log(`listening for requests on port ${port}`);
});
// Add headers
  app.use(function(req, res, next){
    var whitelist = ['http://localhost:4006', 'http://signmein.org', 'http://signmein.trevordebard.com', 'http://signmein.trevordebard.com'];

    var host = req.get('host');
  
    whitelist.forEach(function(val, key){
      if (host.indexOf(val) > -1){
        res.setHeader('Access-Control-Allow-Origin', host);
      }
    })
  
    next();
  });

app.get('/api/doesRoomExist/:roomId', (req, res) => {
    roomId = req.params.roomId;
    db.doesRoomExist(roomId, (err, response) => {
        if (err && !response) {
            console.log(err);
            res.json(err);
        } else {
            res.json(response);
        }
    });
});

app.get('/api/createRoom/:roomId/:uuid', (req, res) => {
    roomId = req.params.roomId;
    uuid = req.params.uuid;
    const reqs = req.query.params;
    
    db.createRoom(roomId, uuid, reqs, (err, response) => {
        if (err) {
            console.log(`Error inserting ${roomId} into the database`);
            res.json(err);
        }
        else {
            res.json(response);
        }
    })
});

app.get('/api/didCreateRoom/:roomId/:uuid', (req, res) => {
    roomId = req.params.roomId;
    uuid = req.params.uuid;
    db.didCreateRoom(roomId, uuid, (err, response) => {
        if (err) {
            console.log(`Error determining if user created room ${roomId}`);
            res.json(err);
        }
        else {
            res.json(response);
        }
    })
})

app.get('/api/getUsers/:roomId', (req, res) => {
    roomId = req.params.roomId;
    
    db.getUsers(roomId, (err, response) => {
        if (err) {
            console.log(`Error getting users for room ${roomId}`);
            console.log(response.error);
            res.json(err)
        } 
        else if(response.result == null) {
            res.json(response)
        }
        else {
            res.json(response);
        }
    })
});
/**
 * Need to add a third parameter for sessions once that is set up
 */
app.get('/api/addUser', (req, res) => {
    roomId = req.query.roomId;
    let reqs = JSON.parse(req.query.reqs);
    name = (reqs[0].name).split(' ');
    let firstName;
    let lastName;
    if(name.length > 1) {
        firstName = name[0];
        lastName = name.slice(1, name.length).join(' ');
    }
    else {
        firstName = name[0];
        lastName = 'empty';
    }
    reqs.splice(0, 1);
    reqs=JSON.stringify(reqs);
    console.log(firstName);
    db.addUser(roomId, firstName, lastName, reqs, (err, response) => {
        if (err) {
            console.log(response.message)
            res.json(response)
        } else {
            res.json(response)
        }
    })
})

app.get('/api/doesSessionExist/:roomId/:sessionId', (req, res) => {
    sessionId = req.params.sessionId;
    roomId = req.params.roomId;
    db.doesSessionExist(roomId, sessionId, (err, response) => {
        if (err || !response) {
            console.log('Whoops It appears that session does not exist.');
            res.json(err);
        } else {
            res.json(response);
        }
    });
});

app.get('/api/getRequiredParams/:roomId', (req, res) => {
    roomId = req.params.roomId;
    db.getRequiredParams(roomId, (err, response) => {
        if (err) {
            console.log('Error getting required params');
            res.json(err);
        } else {
            res.json(response);
        }
    });
});
