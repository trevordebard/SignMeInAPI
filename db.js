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
const createRoom = (room, cb) => {
  client.query(`INSERT INTO rooms (roomId) VALUES ('${room}');`, (err, res) => {
    if (err) {
      return cb(err);
    } else {
      cb(null, `Room ${room} has been created`);
    }
  });
}

/**
 * Retrieve a list of users for a given room
 * @param {string} room 
 * @param {function} cb 
 */
const getUsers = (room, cb) => {
  client.query(`SELECT name FROM users WHERE roomid='${room}'`, (err, result) => {
    if (err) {
      return cb(err);
    }
    if (result.rows.length == 0) {
      return cb('no record');
    }
    cb(null, result.rows);
  });
};

/**
 * ONCE SESSIONS ARE WORKING
 * Add a user to a given room
 * @param {string} room 
 * @param {string} user 
 * @param {function} cb 
 *
const addUser = (room, user, session, cb) => {
  client.query(`INSERT INTO users (name, roomid, session) VALUES ('${user}', '${room}', '${session}');`, (err, result) => {
    if (err) {
      return cb(err);
    }
    cb(null, 'Insert complete');
  });
};
*/

/**
 * Add a user to a given room
 * @param {string} room 
 * @param {string} user 
 * @param {function} cb 
 */
const addUser = (room, user, cb) => {
  client.query(`INSERT INTO users (name, roomid) VALUES ('${user}', '${room}');`, (err, result) => {
    if (err) {
      console.log(err);
      return cb(err);
    }
    cb(null, `${user} was successfully added to room ${room}`);
  });
};


const doesRoomExist = (room, cb) => {
  client.query(`SELECT roomid FROM rooms WHERE roomid='${room}';`, (err, result) => {
    if (err) {
      return cb(err, false);
    }
    if (result.rows.length == 0) {
      return cb(null, false)
    }
    if (result.rows.length == 1) {
      return cb(null, true)
    }
    cb(null, false);
  })
};

const doesSessionExist = (room, session, cb) => {
  console.log(room);
  console.log(session);
  client.query(`SELECT session FROM users WHERE roomId = '${room}' and session = '${session}' LIMIT 1;`, (err, result) => {
    if (err) {
      return cb(err, false);
    }
    console.log(`Sessions: ${result.rows}`);
    if (result.rows.length > 0) {
      return cb(null, true);
    }
    return cb(null, false);
  })
}



module.exports = {
  connect,
  createRoom,
  getUsers,
  addUser,
  doesRoomExist,
  doesSessionExist
};