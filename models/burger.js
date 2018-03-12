'use strict';

// Import the ORM to create functions that will interact with the database.
let ORM = require("../config/orm.js");
const relation = 'burgers';
const idKey = 'id'

// Export the database functions for the controller (catsController.js).

const coerceToBool = p => {
  // console.log("typeof p", typeof p)
  switch (typeof p) {
    case "boolean" : return p;
    case "number" : return (p === 1 ? true : false);
    case "string" : return (p === "true" || p === "1");
    default : return (p == true);
  }
}

module.exports = class Burger extends ORM {
  constructor(params) {
    if ("devoured" in params) {
      params.devoured = coerceToBool(params.devoured);
    }
    super(params);
    this.relation = relation;
    this.idKey = idKey;
  }

  static newMe(params) {
    // I couldn't figure out how to have the parent class (ORM) create an instance of the derived class (Burger)
    // so I have all of the derived classes implement this function, which the returns an instantiated object
    let burger = new Burger(params);
    return burger;
  }
  
  static all(cb) {
    // console.log("in models/burger.js#all")
    Burger.selectAll(cb);
  }

  static create(params, cb) {
    Burger.insertOne(params, cb);
  }

  static update(params, cb) {
    if ("devoured" in params) {
      params.devoured = coerceToBool(params.devoured);
    }
    Burger.updateOne(params, cb);
  }

  // delete method is already provided by ORM. call with Burger.delete(id, cb);
  // static delete(id, cb) {

  // }

}

// static variables
module.exports.idKey = idKey;
module.exports.relation = relation;
module.exports.columns = [idKey, "burger_name", "devoured"]
