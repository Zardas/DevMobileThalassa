import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


interface champ {
	nom: string;
	type: string;
	primaryKey: boolean;
}
interface table {
  nom: string;
  champs: Array<champ>;
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
  	/* private tables: Map<String, Array<champ>> : le string est le nom de la table
  		Chaque table est donc associé à un liste de champ (champ = nom + type + primaryKey?) */
	constructor(private sqlite: SQLite, public tables: Array<table>) {
		this.connectToDb(tables);
	}

	/*--------------------------------------------------*/
  	/*---Création de la base de données et des tables---*/
  	/*--------------------------------------------------*/
  	/*  Possible problème ici : si on tente direct de faire une requête SQL après l'appel à connectToDb, 
  		on peut se retrouver dans le cas où db n'a pas encore été créé (TODO) */
	private connectToDb(public tables: Array<table>):void {
		this.sqlite.create(this.options)
			.then( (db: SQLiteObject) => {
				this.db = db;
				
				//Création et éxécution de la commande SQLite
				for(let i = 0 ; i < tables.length ; i++) {

					//Création de la commande SQL
					let sql = "CREATE TABLE IF NOT EXISTS " + tables[i].nom + "(";
					let primarykey = "PRIMARY KEY(";
					let firstPrimaryKey = true; //Utile puisque il ne faut pas mettre une virgule avant le champ dans le cas de la première clé primaire

					//Les types des champs associés
					for(let j = 0 ; j < tables[i].champs.length ; j++) {
						sql = sql + tables[i].champs[j].nom + " " + tables[i].champs[j].type + ", ";

						//Création en même temps de la dernière partie indiquant les clés primaires
						if(tables[i].champs[j].primaryKey) {
							if(firstPrimaryKey) {
								primarykey = primarykey + tables[i].champs[j].nom;
								firstPrimaryKey = false;
							} else {
								primarykey = primarykey + ", " + tables[i].champs[j].nom;
							}
						}
					}
					sql = sql + primarykey + "))";
					
					console.log('Commande SQL de création de la table ' + i + ' : ' + sql);
					this.db.executeSql(sql, {})
						.then( () => {
							this.theConsole += 'Executed SQL' + sql;
							console.log('La table ' + tables[i].nom + ' a été créée');
						})
						.catch( e => {
							this.theConsole += "Error : " + JSON.stringify(e);
							console.log('La table ' + tables[i].nom + ' n\'a pas pu être créée');
						});
				}
			})
			.catch(e => {
				this.theConsole += JSON.stringify(e);
				console.log('Ca ne marche pas du tout');
			});
	}




	addTest(table: string, valeurs: Array<string>) {
		var sql = "INSERT INTO " + table + " (username, password) VALUES (" + valeurs[0] + ", " + valeurs[1] + ")";

		console.log(sql);
		this.db.executeSql(sql, {})
			.then( () => this.theConsole += 'Executed SQL' + sql)
			.catch( e => this.theConsole += "Error : " + JSON.stringify(e));
	}

	add(table: string, champs: Array<string>, valeurs: Array<string>, username, password):void {
		var sql = "INSERT INTO " + table + " (";

		sql = sql + champs[0];
		for(let i = 1 ; i < champs.length ; i++) {
			sql = sql + ", " + champs[i];
		}
		sql = sql + ") VALUES ('" + valeurs[0] + "'";
		for(let j = 1 ; j < valeurs.length ; j++) {
			sql = sql + ", '" + valeurs[j] + "'";
		}
		sql = sql + ")";

		//sql = "INSERT INTO user (username, password) VALUES (greg, " + 532 + ")";
		//sql = "INSERT INTO user (username, password) VALUES ('"+username+"','"+ password+"')";
		console.log("SQL d'ajout : " + sql);

		this.db.executeSql(sql, {})
			.then( () => {
				this.theConsole += 'Executed SQL' + sql;
				console.log("Le tuple a été ajouté dans la table " + table);
			})
			.catch( e => {
				this.theConsole += "Error : " + JSON.stringify(e);
				console.log("Le tuple n'a pas été ajouté dans la table " + table);
			});
	}

	//https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call
	getData(table: string) {
		var sql = "SELECT * FROM " + table + "";

		return this.db.executeSql(sql, {})
			.then( function(result) {
				console.log("----Nombre de tuple dans la table : " + result.rows.length + "----");
				let toReturn: Array = [];
				for(let i = 0 ; i < result.rows.length ; i++) {
					//toReturn += "[" + result.rows.item(i).username + " ; " + result.rows.item(i).password + "]";
					//toReturn.push({username: result.rows.item(i).username, password: result.rows.item(i).password});
					toReturn.push(result.rows.item(i));
				}
				return toReturn;
			});
	}



	getConsoleMessage() {
		return this.theConsole;
	}

	viderTable(table: string) {
		console.log(table);
		var sql = "DELETE FROM " + table;

		this.db.executeSql(sql, {})
			.then( () => {
				this.theConsole += 'Executed SQL' + sql;
				console.log("La table " + table + " a été vidée");
			})
			.catch( e => {
				this.theConsole += "Error : " + JSON.stringify(e);
				console.log("La table " + table + " n'a pas pu être vidée")
			});
	}



}