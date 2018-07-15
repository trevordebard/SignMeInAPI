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
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', `${process.env.ORIGIN_URL}`);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
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

app.get('/api/createRoom/:roomId/:uuid/:name/:phone/:email', (req, res) => {
    roomId = req.params.roomId;
    uuid = req.params.uuid;
    name = req.params.name;
    phone = req.params.phone;
    email = req.params.email;
    console.log(uuid)
    console.log(name)
    console.log(phone)
    console.log(email)
    db.createRoom(roomId, uuid, name, phone, email, (err, response) => {
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
    name = req.query.name;
    phone = req.query.phone;
    email = req.query.email;
    console.log(phone);
    db.addUser(roomId, name, phone, email, (err, response) => {
        if (err) {
            console.log(`Error adding ${response.name} to room ${response.room}`)
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
