'use strict'

const express = require("express");

const router = express.Router();

// Import the model (burger.js) to use its database functions.
const Burger = require("../models/burger.js");

// Create all our routes and set up logic within those routes where required.
router.get("/", (req, res) => {
  console.log("in controllers/burgers_controller.js#get'/'")
  Burger.all((data)  => {
    const hbsObject = {
      burgers: data,
      title: "Awesome Burgers"
    };
    // console.log(hbsObject);
    // console.log("hbsObject", hbsObject);
    // res.json(hbsObject);
    res.render("index", hbsObject);
  });
});
let dumbarray = [];
router.post("/api/burger", (req, res)  => {
  dumbarray.push(req.body.burger_name);
  console.log("dumbarray", dumbarray, "done");
  console.log("insert", req.body)
  // let burger = new Burger(req.body);
  // console.log("burger", burger)
  // burger.save(result => {
  //   res.json({ id: result.insertId});
  // })
  Burger.insertOne(req.body, result => {
    res.json({ id: result.insertId});
  })
  // burger.create([
  //   "name", "devoured"
  // ], [
  //   req.body.name, req.body.devoured
  // ], (result)  => {
  //   // Send back the ID of the new quote
  //   res.json({ id: result.insertId });
  // });
});

router.put("/api/burger/:id", (req, res)  => {
  console.log("in /api/burger/:id, for id ", req.params.id )
  // const condition = "id = " + req.params.id;
  console.log("devoured", req.body, req.body.devoured);

  // console.log("condition", condition);
  let params = {
    id: req.params.id,
    devoured: req.body.devoured
  }
  Burger.update(params, (result)  => {
    console.log("sql update result", result);
    if (result.changedRows == 0) {
      // If no rows were changed, then the ID must not exist, so 404
      return res.status(404).end();
    } else {
      res.status(200).end();
    }
  });
});

router.delete("/api/burger/:id", (req, res) => {
  Burger.delete(req.params.id, (result)  => {
    console.log("delete result", result);
    if (result.affectedRows === 0) {
      return res.status(404).end();
    }
    else {
      res.status(200).end();
    }
  })
})

// Export routes for server.js to use.
module.exports = router;
