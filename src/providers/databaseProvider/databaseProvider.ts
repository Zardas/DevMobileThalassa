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
				
				//Création et éxécution de la commande SQLite
				for(let i = 0 ; i < this.tables.length ; i++) {

					//Création de la commande SQL
					let sql = "CREATE TABLE IF NOT EXISTS " + this.tables[i].nom + "(";
					let primarykey = "PRIMARY KEY(";
					let firstPrimaryKey = true; //Utile puisque il ne faut pas mettre une virgule avant le champ dans le cas de la première clé primaire
					//Les types des champs associés
					for(let j = 0 ; j < this.tables[i].champs.length ; j++) {
						sql = sql + this.tables[i].champs[j].nom + " " + this.tables[i].champs[j].type + ", ";

						//Création en même temps de la dernière partie indiquant les clés primaires
						if(this.tables[i].champs[j].primaryKey) {
							if(firstPrimaryKey) {
								primarykey = primarykey + this.tables[i].champs[j].nom;
								firstPrimaryKey = false;
							} else {
								primarykey = primarykey + ", " + this.tables[i].champs[j].nom;
							}
						}
					}
					sql = sql + primarykey + "))";
					
					console.log('Commande SQL de création de la table ' + i + ' : ' + sql);
					this.db.executeSql(sql, {})
						.then( () => {
							console.log('La table ' + this.tables[i].nom + ' a été créée');
						})
						.catch( e => {
							console.log('La table ' + this.tables[i].nom + ' n\'a pas pu être créée');
						});
				}
			})
			.catch(e => {
				console.log('Ca ne marche pas du tout');
			});
	}




	/*-------------------------------------------------------------------------------------------------*/
  	/*---Ajout d'un tuple dans la table "table" avec comme values "valeurs" pour les champs "champs"---*/
  	/*-------------------------------------------------------------------------------------------------*/
	add(table: string, champs: Array<string>, valeurs: Array<any>):void {
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

		console.log("SQL d'ajout : " + sql);

		this.db.executeSql(sql, {})
			.then( () => {
				console.log("Le tuple a été ajouté dans la table " + table);
			})
			.catch( e => {
				console.log("Le tuple n'a pas été ajouté dans la table " + table);
			});
	}

	//https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call
	/*------------------------------------------------*/
  	/*---Select tout les tuples de la table "table"---*/
  	/*------------------------------------------------*/
	getData(table: string) {
		var sql = "SELECT * FROM " + table + "";

		return this.db.executeSql(sql, {})
			.then( function(result) {
				console.log("----Nombre de tuple dans la table : " + result.rows.length + "----");
				let toReturn: Array<any> = [];
				for(let i = 0 ; i < result.rows.length ; i++) {
					//toReturn += "[" + result.rows.item(i).username + " ; " + result.rows.item(i).password + "]";
					//toReturn.push({username: result.rows.item(i).username, password: result.rows.item(i).password});
					toReturn.push(result.rows.item(i));
				}
				return toReturn;
			});
	}



	/*-----------------------------------------------------------------------------------------------------------------------------------------------*/
  	/*---Update des tuples dans la table "table" avec comme values "valeur[i]" pour le champs "champs[i], le respectant la condition where "where"---*/
  	/*-----------------------------------------------------------------------------------------------------------------------------------------------*/
	update(table: string, champs: Array<string>, valeurs: Array<any>, where: string):void {
		var sql = "UPDATE " + table + " SET ";

		sql = sql + champs[0] + " = " + valeurs[0] ;
		for(let i = 1 ; i < champs.length ; i++) {
			sql = sql + ", " + champs[i] + " = " + valeurs[i];
		}
		sql = sql + " WHERE " + where;

		console.log("Requête SQL d'update : " + sql);
		this.db.executeSql(sql, {})
			.then( () => {
				console.log("Les tuples ont été update dans la table " + table);
			})
			.catch( e => {
				console.log("Les tuples n'ont pas pu être update dans la table " + table);
			});
	}





	/*--------------------------------------------------*/
  	/*---Supprime tout les tuples de la table "table"---*/
  	/*--------------------------------------------------*/
	viderTable(table: string) {
		var sql = "DELETE FROM " + table;

		this.db.executeSql(sql, {})
			.then( () => {
				console.log("La table " + table + " a été vidée");
			})
			.catch( e => {
				console.log("La table " + table + " n'a pas pu être vidée")
			});
	}


	/*---------------------------*/
  	/*---Drop la table "table"---*/
  	/*---------------------------*/
  	dropTable(table: string) {
  		var sql = "PRAGMA foreign_keys = OFF";

  		this.db.executeSql(sql, {})
  		.then( () => {
  			console.log("foreign_keys has been set off");

  			sql = "DROP TABLE " + table;

  			this.db.executeSql(sql, {})
  			.then( () => {
  				console.log("La table " + table + " a été drop");

  				sql = "PRAGMA foreign_keys = ON";

  				this.db.executeSql(sql, {})
  				.then( () => {
  					console.log("foreign_keys has been set on");
  				})
  				.catch( e => {
  					console.log("failed to set foreign_key on");
  				});
  			})
  			.catch( e => {
  				console.log("La table " + table + " n'a pas pu être drop");

  				sql = "PRAGMA foreign_keys = ON";

  				this.db.executeSql(sql, {})
  				.then( () => {
  					console.log("foreign_keys has been set on");
  				})
  				.catch( e => {
  					console.log("failed to set foreign_key on");
  				});
  			});
  		})
  		.catch( e => {
  			console.log("failed to set foreign_key off");
  		});
  	}
}