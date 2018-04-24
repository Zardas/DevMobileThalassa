import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

interface user {
	username: string;
	password: stirng;
}

@Injectable()
export class Database {
	
	theConsole: string = "Console Messages";

	options: any = {
		name: 'data.db',
		location: 'default',
		createFromLocation: 1
	}

	private db: SQLiteObject;


	/*--------------------------*/
  	/*---Constructeur basique---*/
  	/*--------------------------*/
	constructor(private sqlite: SQLite) {
		this.connectToDb();
	}

	/*--------------------------------------------------*/
  	/*---Création de la base de données et des tables---*/
  	/*--------------------------------------------------*/
  	/*  Possible problème ici : si on tente direct de faire une requête SQL après l'appel à connectToDb, 
  		on peut se retrouver dans le cas où db n'a pas encore été créé (TODO) */
	private connectToDb():void {
		this.sqlite.create(this.options)
			.then( (db: SQLiteObject) => {
				this.db = db;
				this.toReturn = "";
				var sql = 'CREATE TABLE IF NOT EXISTS `user` (username VARCHAR(255), password VARCHAR(255))';

				this.db.executeSql(sql, {})
					.then( () => this.theConsole += 'Executed SQL' + sql)
					.catch( e => this.theConsole += "Error : " + JSON.stringify(e));
			})
			.catch(e => this.theConsole += JSON.stringify(e));
	}


	addUser(username, password):void {
		var sql = "INSERT INTO `user` (username,password) VALUES ('"+username+"','"+ password+"')";

		this.db.executeSql(sql, {})
			.then( () => this.theConsole += 'Executed SQL' + sql)
			.catch( e => this.theConsole += "Error : " + JSON.stringify(e));
	}

	//https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call
	getDataUser() {
		var sql = "SELECT * FROM user";

		return this.db.executeSql(sql, {})
			.then( function(result) {
				console.log("----Nombre de users dans la bdd : " + result.rows.length + "----");
				let toReturn: Array<user> = [];
				for(let i = 0 ; i < result.rows.length ; i++) {
					//toReturn += "[" + result.rows.item(i).username + " ; " + result.rows.item(i).password + "]";
					toReturn.push({username: result.rows.item(i).username, password: result.rows.item(i).password});
				}
				return toReturn;
			});
	}



	getConsoleMessage() {
		return this.theConsole;
	}

	viderTableUser() {
		var sql = "DELETE FROM `user`";

		this.db.executeSql(sql, {})
			.then( () => this.theConsole += 'Executed SQL' + sql)
			.catch( e => this.theConsole += "Error : " + JSON.stringify(e));
	}



}