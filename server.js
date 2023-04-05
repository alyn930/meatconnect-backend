const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "meatconnect",
});

app.use(cors());
app.use(bodyParser.json());

conn.connect((error) => {
  if (error) throw error;
  console.log("Mysql connected");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "product/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

app.listen(8080, () => {
  console.log("Server running successfully in port 8080");
});

app.get("/user/login", function (req, res) {
  console.log(req);
  let username = req.body.username;
  let password = req.body.password;

  if (username && password) {
    conn.query(
      "SELECT * FROM user WHERE user_email = ? AND user_password = ?",
      [username, password],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          res.send(results);
          console.log(results);
        } else {
          res.send("Incorrect Username and/or Password");
        }
        res.end();
      }
    );
  } else {
    res.send("Please enter Username and Password!");
    res.end();
  }
});

app.post("/user/register", function (req, res) {
  console.log(req.bod);
  let progress = req.body.progress;
  let contacts = req.body.contacts;
  let address = req.body.address;
  let name = req.body.name;
  let username = req.body.username;
  let password = req.body.password;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;

  if (
    contacts &&
    address &&
    name &&
    username &&
    password &&
    firstName &&
    lastName
  ) {
    conn.query(
      "INSERT INTO user (progress_id, user_contacts, user_address, user_name, user_email, user_password, first_name, last_name) VALUES (?,?,?,?,?,?,?,?)",
      [
        progress,
        contacts,
        address,
        name,
        username,
        password,
        firstName,
        lastName,
      ],
      function (error, results, fields) {
        if (error) throw error;
        else {
          res.send(results);
          console.log(results);
        }
      }
    );
  } else {
    res.send("Please input the needed fields");
    res.end();
  }
});

app.put("/user/update", function (req, res) {
  let id = req.body.id;
  let progress = req.body.progress;
  let contacts = req.body.contacts;
  let address = req.body.address;
  let name = req.body.name;
  let username = req.body.username;
  let password = req.body.password;
  let firstName = req.body.firstName;
  let lastName = req.body.lastName;

  conn.query(
    "UPDATE user SET progress_id = ?, user_contacts = ?, user_address = ?, user_name = ?, user_email = ?, user_password = ?, first_name = ?, last_name = ? WHERE user_id = ?",
    [
      progress,
      contacts,
      address,
      name,
      username,
      password,
      firstName,
      lastName,
      id,
    ],
    function (error, rows, fields) {
      if (error) throw error;
      else {
        res.send(rows);
        console.log(rows);
        res.end();
      }
    }
  );
});

app.get("/user/retrieve", function (req, res) {
  conn.query("SELECT * FROM user", function (error, rows, fields) {
    if (error) throw error;
    else {
      res.send(rows);
      console.log(rows);
      res.end();
    }
  });
});

app.get("/post/retrieve", function (req, res) {
  conn.query("SELECT * FROM post_status", function (error, rows, fields) {
    if (error) throw error;
    else {
      res.send(rows);
      console.log(rows);
      res.end();
    }
  });
});

app.get("/post/retrieveById/:id", function (req, res) {
  conn.query(
    "SELECT * FROM search WHERE user_id = ?",
    [req.params.id],
    function (error, rows, fields) {
      if (error) throw error;
      else {
        res.send(rows);
        console.log(rows);
        res.end();
      }
    }
  );
});

app.post("/insert/cart", function (req, res) {
  let user_id = req.body.user_id;
  let product_id = req.body.product_id;
  let quantity = req.body.quantity;
  let created_date = req.body.created_date;
  let update_date = req.body.update_date;

  if (user_id && product_id && quantity && created_date && update_date) {
    conn.query(
      "INSERT INTO cart (user_id, product_id, quantity, created_date, update_date) VALUES (?,?,?,?,?)",
      [user_id, product_id, quantity, created_date, update_date],
      function (error, rows, fields) {
        if (error) throw error;
        else {
          res.send(rows);
          console.log(rows);
        }
      }
    );
  } else {
    res.send("Please input the needed fields");
    res.end();
  }
});

app.get("/user/retrieve/:id", function (req, res) {
  conn.query(
    "SELECT * FROM user WHERE user_id = ?",
    [req.params.id],
    function (error, rows, fields) {
      if (error) throw error;
      else {
        res.send(rows);
        console.log(rows);
        res.end();
      }
    }
  );
});

app.get("/message/retrieveById/:id", function (req, res) {
  conn.query(
    "SELECT * FROM message WHERE receiver_id = ?",
    [req.params.id],
    function (error, rows, fields) {
      if (error) throw error;
      else {
        res.send(rows);
        console.log(rows);
        res.end();
      }
    }
  );
});

app.get("/message/retrieve", function (req, res) {
  let receiver_id = req.body.receiver_id;
  let sender_id = req.body.sender_id;

  conn.query(
    "SELECT * FROM message WHERE receiver_id = ? AND sender_id = ?",
    [receiver_id, sender_id],
    function (error, rows, fields) {
      if (error) throw error;
      else {
        res.send(rows);
        console.log(rows);
        res.end();
      }
    }
  );
});

app.post("/message/update", function (req, res) {
  let message_id = req.body.message_id;
  let sender_id = req.body.sender_id;
  let receiver_id = req.body.receiver_id;
  let message_chat = req.body.message_chat;
  let created_at = req.body.created_at;

  if (message_id && sender_id && receiver_id && message_chat && created_at) {
    conn.query(
      "INSERT INTO message (message_id, sender_id, receiver_id, message_chat, created_at) VALUES (?,?,?,?,?)",
      [message_id, sender_id, receiver_id, message_chat, created_at],
      function (error, rows, fields) {
        if (error) throw error;
        else {
          res.send(rows);
          console.log(rows);
        }
      }
    );
  } else {
    res.send("Please input the needed fields");
    res.end();
  }
});

app.post("/product/insert", function (req, res) {
  let livestock_animal_id = req.body.livestock_animal_id;
  let livestock_animal_name = req.body.livestock_animal_name;
  let livestock_animal_type = req.body.livestock_animal_type;
  let livestock_animal_detail = req.body.livestock_animal_detail;
  let livestock_animal_photo = req.body.livestock_animal_photo;

  if (
    livestock_animal_id &&
    livestock_animal_name &&
    livestock_animal_type &&
    livestock_animal_detail &&
    livestock_animal_photo
  ) {
    conn.query(
      "INSERT INTO animal_category (livestock_animal_id, livestock_animal_name, livestock_animal_type, livestock_animal_detail, livestock_animal_photo) VALUES (?,?,?,?,?)",
      [
        livestock_animal_id,
        livestock_animal_name,
        livestock_animal_type,
        livestock_animal_detail,
        livestock_animal_photo,
      ],
      function (error, rows, fields) {
        if (error) throw error;
        else {
          res.send(rows);
          console.log(rows);
        }
      }
    );
  } else {
    res.send("Please input needed fields");
    res.end();
  }
});
