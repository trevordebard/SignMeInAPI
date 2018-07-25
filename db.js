const pg = require('pg');

const client = new pg.Client(process.env.DB_URL);

/**
 * Establishes connection with the client database
 */
const connect = () => {
  client.connect((err) => {
    if (!err) {
      console.log('Successfully connected to database');
    } else {
      console.log('Error connecting to database: ');
      console.log(err);
    }
  });
};

/**
 * Insert a room into the database
 * @param {string} room the room to be created
 * @param {function} cb the callbackfunction
 */
const createRoom = (room, uuid, reqs, cb) => {
  client.query(`INSERT INTO rooms (roomId, uuid, reqs) VALUES ('${room}', '${uuid}','${reqs}');`, (err, res) => {
    if (err) {
      console.log(err)
      cb(err);
    } else {
      cb(null, {room: room, success: true, message: `Room ${room} successfully added`});
    }
  });
}
const didCreateRoom = (roomId, uuid, cb) => {
  client.query(`SELECT uuid FROM rooms WHERE roomid='${roomId}';`, (err, result) => {
    if (err) {
      return cb(err, null);
    }
    if (result.rows.length == 0) {
      return cb(null, {success: true, exists: false})
    }
    if (result.rows.length == 1) {
      let resUUID = result.rows[0].uuid;
      console.log(resUUID);
      if(resUUID === uuid) {
        return cb(null, {success: true, didCreate: true})
      }
      else {
        return cb(null, {success: true, didCreate: false})
      }
    }
    else {
      return cb(null, {success: true, didCreate: false})
    }
  })
};

/**
 * Retrieve a list of users for a given room
 * @param {string} room 
 * @param {function} cb 
 */
const getUsers = (room, cb) => {
  client.query(`SELECT reqs, firstname, lastname FROM users WHERE roomid='${room}'`, (err, result) => {
    if (err) {
      cb(err, {success: false, error: err, message: 'There was an error retreiving users from the database. Make sure you inputed the correct room code'});
    }
    if (result.rows.length == 0) {
      cb(null, {success: true, result: null, message: `Room ${room} currently has no users, or that room does not exist`});
    }
    else {
      let users = result.rows;
      users.forEach((element) => {
        element.reqs = JSON.parse(element.reqs)
        element.reqs.forEach((req) => {
          element[Object.keys(req)[0]] = req[Object.keys(req)[0]]; 
        })
        delete element.reqs
      })
      cb(null, {success: true, result: users});
    }
  });
};

/**
 * Add a user to a given room
 * @param {string} room 
 * @param {string} user 
 * @param {function} cb 
 */
const addUser = (room, firstname, lastname, reqs, cb) => {
  
  queryString = `INSERT INTO users (reqs, roomid, firstname, lastname) VALUES ('${reqs}', '${room}', '${firstname}', '${lastname}')`
  client.query(queryString, (err, result) => {
    if (err) {
      return cb(err, {success: false, room: room, message: `Error adding ${firstname} to room ${room}`});
    }
    else {
      cb(null, {reqs: reqs, success: true, message:`${reqs} was successfully added to room ${room}`});
    }
  });
};

const doesRoomExist = (room, cb) => {
  client.query(`SELECT roomid FROM rooms WHERE roomid='${room}';`, (err, result) => {
    if (err) {
      return cb(err, null);
    }
    if (result.rows.length == 0) {
      return cb(null, {success: true, exists: false})
    }
    if (result.rows.length == 1) {
      return cb(null, {success: true, exists: true, roomCode: room})
    }
    cb(null, {success: true, exists: false, roomCode: room});
  })
};

const doesSessionExist = (room, session, cb) => {
  client.query(`SELECT session FROM users WHERE roomId = '${room}' and session = '${session}' LIMIT 1;`, (err, result) => {
    if (err) {
      return cb(err, null);
    }
    if (result.rows.length > 0) {
      return cb(null, {success: true, exists: true});
    }
    else {
      return cb(null, {success: true, exists: false});
    }
  })
}
const getRequiredParams = (roomId, cb) => {
  console.log(roomId);
  client.query(`SELECT reqs FROM rooms WHERE roomid='${roomId}'`, (err, result) => {
    if (err) {
      console.log('error')
      cb(err, {success: false, error: err, message: 'There was an error retreiving params from the database.'});
    }
    if (result.rows.length == 0) {
      cb(null, {success: true, result: null, message: `No results getting params`});
    }
    else if(result.rows.length == 1){
      cb(null, {success: true, result: result.rows[0]});
    }
    else {
      cb(null, {success: true, result: null, message: 'Error. too many results.'})
    }
  });
};



module.exports = {
  connect,
  createRoom,
  getUsers,
  addUser,
  doesRoomExist,
  doesSessionExist,
  didCreateRoom,
  getRequiredParams
};