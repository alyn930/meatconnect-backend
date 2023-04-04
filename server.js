const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

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

app.listen(8080, () => {
  console.log("Server running successfully in port 8080");
});

app.post("/user/login", function (req, res) {
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

app.get("/user/register", function (req, res) {
  console.log(req.bod);
  let progress = req.body.progress;
  let contacts = req.body.contacts;
  let address = req.body.address;
  let name = req.body.name;
  let username = req.body.username;
  let password = req.body.password;

  if (contacts && address && name && username && password) {
    conn.query(
      "INSERT INTO user (progress_id, user_contacts, user_address, user_name, user_email, user_password) VALUES (?,?,?,?,?,?)",
      [progress, contacts, address, name, username, password],
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

app.post("/user/update", function (req, res) {
  let id = req.body.id;
  let progress = req.body.progress;
  let contacts = req.body.contacts;
  let address = req.body.address;
  let name = req.body.name;
  let username = req.body.username;
  let password = req.body.password;

  conn.query(
    'UPDATE user SET progress_id = ?, user_contacts = ?, user_address = ?, user_name = ?, user_email = ?, user_password = ? WHERE user_id = ?',
    [progress, contacts, address, name, username, password, id],
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

app.post("/user/retrieve", function (req, res){
  conn.query('SELECT * FROM user', function(error, rows, fields){
    if(error) throw error;
    else{
      res.send(rows);
      console.log(rows);
      res.end();
    }
  })
})


app.post("/post/retrieve", function(req, res){
  conn.query('SELECT * FROM post_status', function(error, rows, fields){
    if(error) throw error;
    else{
      res.send(rows);
      console.log(rows);
      res.end();
    }
  })
})

app.post("/post/retrieveById/", function(req, res){
  let id = req.body.id;
  conn.query('SELECT * FROM search WHERE user_id = ?', [id], function(error, rows, fields){
    if(error) throw error;
    else{
      res.send(rows);
      console.log(rows);
      res.end();
    }
  })
})

app.post("/insert/cart", function(req, res){
  let user_id = req.body.user_id;
  let product_id = req.body.product_id;
  let quantity = req.body.quantity;
  let created_date = req.body.created_date;
  let update_date = req.body.update_date;

  if(user_id && product_id && quantity && created_date && update_date){
    conn.query('INSERT INTO cart (user_id, product_id, quantity, created_date, update_date) VALUES (?,?,?,?,?)', [user_id, product_id, quantity, created_date, update_date], function(error, rows, fields){
      if(error) throw error;
      else{
        res.send(rows);
        console.log(rows);
      }
    });
  }else{
    res.send("Please input the needed fields");
    res.end();
  }
})

app.get("/user/retrieve/:id", function(req, res){
  conn.query("SELECT * FROM user WHERE user_id = ?" , [req.params.id], function(error, rows, fields){
    if(error) throw error;
    else{
      res.send(rows);
      console.log(rows);
      res.end();
    }
  })
})