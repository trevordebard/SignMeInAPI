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

app.get('/api/trevor', (req, res) => {
    res.send('hello');
});

app.get('/api/doesRoomExist/:roomId', (req, res) => {
    roomId = req.params.roomId;
    db.doesRoomExist(roomId, (err, response) => {
        if (err || !response) {
            console.log('Whoops It appears that room does not exist.');
            res.send(false);
        } else {
            res.send(true);
        }
    });
});

app.get('/api/createRoom/:roomId', (req, res) => {
    roomId = req.params.roomId;
    db.createRoom(roomId, (err, response) => {
        if (err) {
            console.log(`Error inserting ${roomId} into the database`);
            res.send('Room could not be added to the database successfully. Please try again');
        } else if (!response) {
            console.log(`No response from server when creating room ${roomId}`);
        } else {
            console.log(`Room with id: ${roomId} has been created`);
            res.send(response);
        }
    })
});

app.get('/api/getUsers/:roomId', (req, res) => {
    roomId = req.params.roomId;
    db.getUsers(roomId, (err, response) => {
        if (err) {
            console.log(`Error getting users for room ${roomId}`);
            res.send('There was an error retreiving users from the database. Make sure you inputed the correct room code');
        } else {
            res.send(response);
        }
    })
});

/**
 * Need to add a third parameter for sessions once that is set up
 */
app.get('/api/addUser/:roomId/:name', (req, res) => {
    roomId = req.params.roomId;
    name = req.params.name;
    db.addUser(roomId, name, (err, response) => {
        if (err) {
            console.log(`Error adding ${name} to room ${roomId}`);
            res.send(`Oops! There was an error adding ${name} to room ${roomId}.`)
        } else {
            console.log(response);
            res.send(`Successfully added ${name} to room ${roomId}`)
        }
    })
})

app.get('/api/doesSessionExist/:roomId/:sessionId', (req, res) => {
    sessionId = req.params.sessionId;
    roomId = req.params.roomId;
    db.doesSessionExist(roomId, sessionId, (err, response) => {
        if (err || !response) {
            console.log('Whoops It appears that session does not exist.');
            res.send(false);
        } else {
            res.send(true);
        }
    });
});