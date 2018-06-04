import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';


interface champ {
	nom: string;
	type: string;
	foreignKey: string;
	primaryKey: boolean;
}

interface table {
  nom: string;
  champs: Array<champ>;
}

@Injectable()
export class Database {
	
	//Options de la base de données
	options: any = {
		name: 'data.db',
		location: 'default',
		createFromLocation: 1
	}

	//Base de donénes
	private db: SQLiteObject;


	/*--------------------------*/
  	/*---Constructeur basique---*/
  	/*--------------------------*/
  	/* private tables: Map<String, Array<champ>> : le string est le nom de la table
  		Chaque table est donc associé à un liste de champ (champ = nom + type + primaryKey?) */
	constructor(private sqlite: SQLite, public tables: Array<table>) {
		this.connectToDb();
	}


	/*
		Dans toutes les fonctions suivantes, la variable sql représente la reuqête sql à exécuter, elle est construite
		au fur et à mesure en fonctions des paramètre passés en argument de la fonction
	*/

	/*--------------------------------------------------*/
  	/*---Création de la base de données et des tables---*/
  	/*--------------------------------------------------*/
	connectToDb() {

		//Création de la BDD
		return this.sqlite.create(this.options)
			.then( (db: SQLiteObject) => {

				this.db = db;
				
				var sql = "PRAGMA foreign_keys = ON";

				return this.db.executeSql(sql, {})
	  				.then( () => {
						//Création et éxécution de la commande SQLite
						for(let i = 0 ; i < this.tables.length ; i++) {

							//Création de la commande SQL
							sql = "CREATE TABLE IF NOT EXISTS " + this.tables[i].nom + "(";
							let foreignKey = "";
							let primarykey = "PRIMARY KEY(";
							let firstPrimaryKey = true; //Utile puisque il ne faut pas mettre une virgule avant le champ dans le cas de la première clé primaire

							//Les types des champs associés
							for(let j = 0 ; j < this.tables[i].champs.length ; j++) {
								sql = sql + this.tables[i].champs[j].nom + " " + this.tables[i].champs[j].type + ", ";

								//Création en même temps de la partie indiquant les clés étrangères
								if(this.tables[i].champs[j].foreignKey != 'null' && this.tables[i].champs[j].foreignKey != '') {
									foreignKey = foreignKey + "FOREIGN KEY (" + this.tables[i].champs[j].nom + ") REFERENCES " + this.tables[i].champs[j].foreignKey + ", ";
								}
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
							sql = sql + foreignKey + primarykey + "))";
							
							console.log('Commande SQL de création de la table ' + i + ' : ' + sql);
							this.db.executeSql(sql, {})
								.then( () => {
									console.log('La table ' + this.tables[i].nom + ' a été créée');
								})
								.catch( e => {
									console.warn('La table ' + this.tables[i].nom + ' n\'a pas pu être créée');
								});
						}
					})
					.catch( err => {
						console.log("Problème pour set les foreingKeys on : " + err);
					})
				;


			})
			.catch(e => {
				console.warn('Ca ne marche pas du tout');
			})
		;
	}




	/*-------------------------------------------------------------------------------------------------*/
  	/*---Ajout d'un tuple dans la table "table" avec comme values "valeurs" pour les champs "champs"---*/
  	/*-------------------------------------------------------------------------------------------------*/
	add(table: string, champs: Array<string>, valeurs: Array<any>) {
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
		console.log("SQLiteObject : " + this.db);

		return this.db.executeSql(sql, {})
			.then( data => {
				console.log("Le tuple a été ajouté dans la table " + table);
			})
			.catch( e => {
				console.warn("Le tuple n'a pas été ajouté dans la table " + table);
			})
		;
	}

	//https://stackoverflow.com/questions/14220321/how-do-i-return-the-response-from-an-asynchronous-call
	/*------------------------------------------------*/
  	/*---Select tout les tuples de la table "table"---*/
  	/*------------------------------------------------*/
	getData(table: string, where: string): Promise<any> {
		var sql = "SELECT * FROM " + table + where;

		return this.db.executeSql(sql, {})
			.then( result => {
				//console.log("----Nombre de tuple dans la table : " + result.rows.length + "----");
				let toReturn: Array<any> = [];
				for(let i = 0 ; i < result.rows.length ; i++) {
					toReturn.push(result.rows.item(i));
				}
				return toReturn;
			})
			.catch( e => {
				console.warn("Probleme avec la requête get sur la table " + table + " : " + e);
			})
		;
	}



	/*-----------------------------------------------------------------------------------------------------------------------------------------------*/
  	/*---Update des tuples dans la table "table" avec comme values "valeur[i]" pour le champs "champs[i], le respectant la condition where "where"---*/
  	/*-----------------------------------------------------------------------------------------------------------------------------------------------*/
	update(table: string, champs: Array<string>, valeurs: Array<any>, where: string) {
		var sql = "UPDATE " + table + " SET ";

		sql = sql + champs[0] + " = '" + valeurs[0] + "'";
		for(let i = 1 ; i < champs.length ; i++) {
			sql = sql + ", " + champs[i] + " = '" + valeurs[i] + "'";
		}
		sql = sql + " WHERE " + where;

		console.log("Requête SQL d'update : " + sql);
		return this.db.executeSql(sql, {})
			.then( () => {
				console.log("Les tuples ont été update dans la table " + table);
			})
			.catch( e => {
				console.warn("Les tuples n'ont pas pu être update dans la table " + table + " : " + e);
			})
		;
	}





	/*--------------------------------------------------*/
  	/*---Supprime tout les tuples de la table "table"---*/
  	/*--------------------------------------------------*/
	viderTable(table: string, where: string) {
		var sql = "DELETE FROM " + table;

		if(where != '') {
			sql = sql + " WHERE " + where;
		}

		console.log('SQL de suppression : ' + sql);
		return this.db.executeSql(sql, {})
			.then( () => {
				console.log("Les tuples de la table " + table + " ont été supprimés");
				return 'success';
			})
			.catch( e => {
				console.warn("Les tuples de la table " + table + " n'ont pas pu être supprimés : " + e)
				return 'failure';
			})
		;
	}


	/*---------------------------*/
  	/*---Drop la table "table"---*/
  	/*---------------------------*/
  	dropTable(table: string) {
  		var sql = "PRAGMA foreign_keys = OFF";

  		return this.db.executeSql(sql, {})
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
	  					console.warn("failed to set foreign_key on : " + e);
	  				});
	  			})
	  			.catch( e => {
	  				console.warn("La table " + table + " n'a pas pu être drop : " + e);

	  				sql = "PRAGMA foreign_keys = ON";

	  				this.db.executeSql(sql, {})
	  				.then( () => {
	  					console.log("foreign_keys has been set on");
	  				})
	  				.catch( e => {
	  					console.warn("failed to set foreign_key on : " + e);
	  				});
	  			});
	  		})
	  		.catch( e => {
	  			console.warn("failed to set foreign_key off : " + e);
	  		})
	  	;
  	}


  	
}