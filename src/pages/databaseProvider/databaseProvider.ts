import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseProvider {
	private db: SQLiteObject;
	private isOpen: boolean;
	public storage: SQLite;

	constructor() {
		console.log('a');
		if(!this.isOpen) {
			console.log('b');
			this.storage = new SQLite();

			this.storage.create({
				name: 'inventaire.db',
				location: 'default'
			})
			.then( (db:SQLiteObject) => {
				this.db = db;
				db.executeSql("CREATE TABLE IF NOT EXISTS Article (id INTEGER PRIMARY KEY, prix INTEGER)", []);
				this.isOpen = true;
				console.log("BDD créée");
			})
			.catch( (error) => {
				console.log(error);
			})
		}
		console.log('c');

	}


	createArticle(id: number, prix: number) {
		return new Promise( (resolve, reject) => {
			let sql = "INSERT INTO Article (id, prix) VALUES (?, ?)";
			this.db.executeSql(sql, [id, prix]).then( (data) => {
				resolve(data);
				console.log('Article ajouté');
			}, (error) => {
				reject(error);
				console.log("L'article n'a pas pu être ajouté");
			});
		});
	}

	getAllArticles() {
		return new Promise( (resolve, reject) => {
			this.db.executeSql("SELECT * FROM Article", [])
				.then( (data) => {
					let arrayArticle = [];
					if(data.rows.length > 0) {
						for(var i = 0 ; i < data.rows.length ; i++) {
							arrayArticle.push({
								id: data.rows.item(i).id,
								prix: data.rows.item(i).prix
							});
						}
					}
					resolve(arrayArticle);
					console.log("On a bien pu accéder à l'array");
				}, (error) => {
					reject(error);
					console.log("Nous n'avons pas pu accéder à l'array");
				})
		});
	}


}