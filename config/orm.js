'use strict';

// const stringify = require('json-stringify');
const connection = require('./connection');

const validTableNames = {
  "burgers": true
};

module.exports = class ORM {
	constructor(params) {
		Object.keys(params).forEach(key=> this[key] = params[key]);
		this.params = params;
	}

	static selectAll(cb) {
		let columnsToSelect = this.columns;
		connection.query("select ?? from ??", [columnsToSelect, this.relation], (err, results) => {
			if (err) { throw err}
			cb(results.map(result => this.newMe(result)));
		})
	}

	static insertOne(params, cb) {
		let item = this.newMe(params);
		item.save(cb);
		// this.insert(params, cb);
	}

	static updateOne(params, cb) {
		console.log("in ORM#updateOne")
		let item = this.newMe(params);
		item[this.idKey] = params[this.idKey];
		item.update(cb);
	}

	static delete(id, cb) {
		console.log("in ORM#delete")

		connection.query("delete from ?? where ?? = ?", [this.relation, this.idKey, id] , (err, results) =>{
			if (err) throw err;
			// console.log(results);
			cb(results)
		})
	}




	save(callback) {
		let sqlStatement = 'insert into ?? SET ?';
		connection.query(sqlStatement, [this.relation].concat(this.params), (err, results, fields) => {
			if (err) {throw error}
			if (typeof callback === "function") {
				// the rersults will be an object that says fieldCount, affectedRows, insertId, and some other stuff
				callback(results);
			}
		})
	}


	update(callback) {
		let updates = Object.assign({}, this.params);
		Object.keys(updates).forEach(key => {
			updates[key] = this[key]
		});

		if (updates[this.idKey]) delete updates[this.idKey];

		if (Object.keys(updates).length < 1) {
			console.log ("No updates to make");
			callback({})
		}
		else {
			let sqlStatement = 'update  ??  SET ? where ?? = ?';
			connection.query(sqlStatement, [this.relation, updates, this.idKey, this.params[this.idKey]], (err, results, fields) => {
				if (err) {throw err;}
				callback(results)
			})
		}

	}

	static newMe(params) {
		// the ORM class is an abstract class, and this particular function is implemented in the derived class
		// the derived class should implement this function
	}

}




