import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Platform } from "ionic-angular";

/* Classe gérant la base de donnée


*/

const BDD_name: string = 'Inventaire';
const win: any = window

export enum TABLES {
	Article,
	User,
	Scan
}

@Injectable()
export class BDDHandler{

	private bddPromise: Promise<any>;

	//Construit, ouvre et créer les tables initiales de la BDD
	
	constructor(public platform: Platform) {
		this.bddPromise = new Promise( (resolve, reject) => {
			try {
				let bdd: any;
				this.platform.ready().then( () => {
					if(this.platform.is('cordova') && win.sqllitePlugin) {
						//Mobile
						//Ouverture de la base
						bdd = win.sqllitePlugin.openDatabase({
							name: BDD_name,
							location: 'default'
						});
					} else {
						//WebSQL (Attention : déprécié)
						console.warn("Le plugin SQLite n'est pas installé, passage en WBSQL. Ce genre de chose est déprécié donc pensé à installer cordova-sqlite-storage dès que possible");
						bdd = win.openDatabase(
							BDD_name,
							'1.0',
							"Base de données pour l'inventaire",
							5 * 1024 * 1024
						);
					}
					resolve(bdd);
				});
			} catch(err) {
				reject({err: err});
			}
		});
		this.tryInit();
	}

	//Initialisation des tables (avec Drop avant si besoin)
	tryInit(drop = false) {
		if(drop) {
			this.dropTable(TABLES.Article);
			this.dropTable(TABLES.User);
			this.dropTable(TABLES.Scan);
		}
		this.createTableArticle();
		this.createTableUser();
		this.createTableScan();
	}

	//Drop des tables
	private dropTable(table: TABLES) {
		this.query("DROP TABLE " + TABLES[table], [])
			.catch(err => {
				console.error('Problème de base de donnée : Impossible de supprimer la table ' + TABLES[table], err.tx, err.err);
			});
	}

	//Création des tables----------------A modifier si on ajoute une tables ou un champ------------------------------------------------------------
	private createTableArticle() {
		this.query('CREATE TABLE IF NOT EXISTS ' + TABLES[TABLES.Article] + '( id INTEGER KEY AUTOINCREMENT, prix INTEGER NOT NULL, PRIMARY-KEY(id)', [])
			.catch(err => {
				console.error('Problème de base de donnée : Impossible de créer la table Article', err.tx, err.err);
			});
	}
	private createTableUser() {
		this.query('CREATE TABLE IF NOT EXISTS ' + TABLES[TABLES.User] + '( id INTEGER KEY AUTOINCREMENT, nom VARCHAR(50), PRIMARY-KEY(id)', [])
			.catch(err => {
				console.error('Problème de base de donnée : Impossible de créer la table User', err.tx, err.err);
			});
	}
	private createTableScan() {
		this.query('CREATE TABLE IF NOT EXISTS ' + TABLES[TABLES.Scan] + '( id INTEGER KEY AUTOINCREMENT, idArticle INTEGER REFERENCES(' + TABLES[TABLES.Article] + '.id), idUser INTEGER REFERENCES(' + TABLES[TABLES.User] + '.id), prix DATE, PRIMARY-KEY(id)', [])
			.catch(err => {
				console.error('Problème de base de donnée : Impossible de créer la table User', err.tx, err.err);
			});
	}

	//Insertion
	insert(table: TABLES, champs: string, value: string): Promise<any> {
		return this.query('INSERT INTO ' + TABLES[table] + '(' + value + ') VALUES (' + value + ')', []);
	}

	//Update
	update(table: TABLES, set: string, where: string): Promise<any> {
		return this.query('UPDATE' + TABLES[table] + 'SET ' + set + where, []);
	}

	//Delete
	delete(table: TABLES, where: string) {
		return this.query('DELETE FROM' + TABLES[table] + where, []);
	}


	//La commande pour créer des requêtes. Peut être utilisée directement pour créer ses propres requêtes
	query(query: string, params: any[] []): Promise<any> {
		return new Promise( ( resolve, reject) => {
			try {
				this.bddPromise.then(bdd => {
					bdd.transaction((tx: any) => {
						tx.executeSQL(query, params, 
							(tx: any, res: any) => resolve({tx: tx, res: res}),
							(tx: any, err: any) => reject({tx: tx, err: err}));
					},
					(err: any) => reject({err: err}));
				});
			} catch (err) {
				reject({err: err});
			}
		});
	}

}