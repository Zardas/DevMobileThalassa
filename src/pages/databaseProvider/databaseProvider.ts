import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class Database {
	
	theConsole: string = "Console Messages";
	toReturn: string = "";
	options: any = {
		name: 'data.db',
		location: 'default',
		createFromLocation: 1
	}

	private db: SQLiteObject;

	constructor(private sqlite: SQLite) {
		this.connectToDb();
	}


	private connectToDb():void {
		this.sqlite.create(this.options)
			.then( (db: SQLiteObject) => {
				this.db = db;
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

	getDealer() {
		var toReturn = "";
		var sql = "SELECT * FROM user";

		this.db.executeSql(sql, {})
			.then( (result) => {
				this.theConsole += JSON.stringify(result);
				console.log("Nombre de résultats : " + result.rows.length);

				if(result.rows.length > 0) {
					this.theConsole += 'Result' + result.rows.item(0);
				}
				this.theConsole += "\n" + result.rows.item(0).username + result.rows.item(0).password;
				this.theConsole += "\n" + 'Rows' + result.rows.length;

				for(let i = 0 ; i < result.rows.length ; i++) {
					toReturn += "[" + result.rows.item(i).username + " ; " + result.rows.item(i).password + "] ";
				}
			})
			.catch( e => {
				this.theConsole += JSON.stringify(e);
				toReturn = "Problème pour le SELECT";
			});
		
		return toReturn;
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

	tableUserVide() {
		var sql = "SELECT * FROM user";

		this.db.executeSql(sql, {})
			.then( (result) => {
				this.theConsole += JSON.stringify(result);
				return (result.rows.length == 0)
			})
			.catch( e => {
				this.theConsole += JSON.stringify(e);
				return null
			});
	}


}