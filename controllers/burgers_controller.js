'use strict'

const express = require("express");

const router = express.Router();

// Import the model (burger.js) to use its database functions.
const Burger = require("../models/burger.js");


const coerceToBool = p => {
  // console.log("typeof p", typeof p)
  switch (typeof p) {
    case "boolean" : return p;
    case "number" : return (p === 1 ? true : false);
    case "string" : return (p === "true" || p === "1");
    default : return (p == true);
  }
}

// Create all our routes and set up logic within those routes where required.
router.get("/", (req, res) => {
  // console.log("in controllers/burgers_controller.js#get'/'")
  Burger.all((data)  => {
    const hbsObject = {
      burgers: data,
      title: "Awesome Burgers"
    };
    res.render("index", hbsObject);
  });
});


router.get("/api/burger", (req, res) => {
  let cb = data => res.json(data);
  Burger.all(cb)
})

router.post("/api/burger", (req, res)  => {
  // console.log('req.body', req.body);
  const params = { ...req.body };
  if ("devoured" in params) {
    params.devoured = coerceToBool(params.devoured);
    params.devoured = params.devoured ? 1 : 0;
  }
  // Burger.insertOne(req.body, result => {
  Burger.create(params, result => {
    res.json({ id: result.insertId});
  })
});

router.put("/api/burger/:id", (req, res)  => {
  let params = {
    id: req.params.id,
    devoured: req.body.devoured
  }
  Burger.update(params, (result)  => {
    // console.log("sql update result", result);
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
      // console.log("delete result", result);
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
