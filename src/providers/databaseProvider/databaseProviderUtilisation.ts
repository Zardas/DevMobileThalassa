import { Injectable } from '@angular/core';
import { SQLite } from '@ionic-native/sqlite';
import { Database } from './databaseProvider';

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
export class DatabaseUtilisation {

	//Base de donnée sur laquelle les différentes requêtes seront effectuées
	private database: Database;

	//Liste des tables de database
	private tables: Array<table>;

	//Données en local utilisé par angular pour afficher les valeurs dynamiquement dans le html et synchronisé avec le contenu de la base à chaque requête et chargement de cette page
	//private localData: Map<String, Array<any>>;

	/*------------------------------------*/
 	/*------------Constructeur------------*/
 	/*------------------------------------*/
 	constructor(
    	public localData: Map<String, Array<any>>,    //Contrôleur des toast (les petits popup)
  	) {
    	this.parametrageTables(localData);
    	this.creationBDD(localData, this.tables);
  }

  /*-------------------------------------------------------------------------------------------------------*/
  /*------------Fonction de paramétrage des tables ! A modifier lorsque l'on ajoute une table !------------*/
  /*-------------------------------------------------------------------------------------------------------*/
  parametrageTables(localData: Map<String, Array<any>>) {
    this.tables = [];

    /* Pour la table article */
    let champsTableArticle: Array<champ> = [];
    champsTableArticle.push({nom: 'codeBarre', type: 'VARCHAR(255)', foreignKey: '', primaryKey: true});
    champsTableArticle.push({nom: 'designation', type: 'VARCHAR(255)', foreignKey: '', primaryKey: false});
    champsTableArticle.push({nom: 'prix', type: 'REAL', foreignKey: '', primaryKey: false});
    champsTableArticle.push({nom: 'stock', type: 'REAL', foreignKey: '', primaryKey: false});

    let champsTableMagasin: Array<champ> = [];
    champsTableMagasin.push({nom: 'idMagasin', type: 'INTEGER', foreignKey: '', primaryKey: true});
    champsTableMagasin.push({nom: 'nom', type: 'VARCHAR(255)', foreignKey: '', primaryKey: false});

    let champsTableComptage: Array<champ> = [];
    champsTableComptage.push({nom: 'idComptage', type: 'INTEGER', foreignKey: '', primaryKey: true});
    champsTableComptage.push({nom: 'idMagasin', type: 'INTEGER', foreignKey: 'magasin(idMagasin)', primaryKey: false});
    champsTableComptage.push({nom: 'dateDebut', type: 'DATE', foreignKey: '', primaryKey: false});
    champsTableComptage.push({nom: 'idTypeComptage', type: 'INTEGER', foreignKey: '', primaryKey: false});
    champsTableComptage.push({nom: 'auteur', type: 'VARCHAR(255)', foreignKey: '', primaryKey: false});
    champsTableComptage.push({nom: 'ouvert', type: 'BOOLEAN', foreignKey: '', primaryKey: false});

    /* On met tout ça dans les tables qui seront créées plus tard */
    this.tables.push({nom: 'article', champs: champsTableArticle});
    this.tables.push({nom: 'magasin', champs: champsTableMagasin});
    this.tables.push({nom: 'comptage', champs: champsTableComptage});

    /* Et on en profite pour créer les donénes en local (puisque elle sont liées aux tables à créer */
    localData['article'] = [];
    localData['magasin'] = [];
    localData['comptage'] = [];
  }

  /*------------------*/
  /*---Création BDD---*/
  /*------------------*/
  creationBDD(localData: Map<String, Array<any>>, tables: Array<table>) {
      //Création d'une nouvelle base de données
      this.database = new Database(new SQLite(), tables);

      //Création des tables associées à cette base /! VOIR le tuto très bien fait pour ça : https://javascript.developpez.com/actu/146280/Comprendre-les-Promises-en-JavaScript-TypeScript-article-de-yahiko/
      return this.database.connectToDb()
        .then(data => {

          console.log("Connexion avec la BDD réussie");
          for(let i of tables) {
            /* Création de la  BDD réussie : on synchronise les données en local avec */
            this.synchronise(localData, i.nom);
          }

        })
        .catch(err => {

          console.warn('Problème lors de la création des tables : ' + err);

        })
      ;

  }


  /*--------------------------------------------*/
  /*---Ajout d'un tuple dans la table "table"---*/
  /*--------------------------------------------*/
  addBDD(localData: Map<String, Array<any>>, table: string, champs: Array<string>, values: Array<any>) {

    this.database.add(table, champs, values)
      .then( data => {
        //this.synchronise(table);

        //Ici, data ne peut pas être ajouté directement dans this.localData[table] à cause d'un problème de type
        //On cherche donc le tuple ajouté dans la base pour pouvoir l'ajouter en local
        let where = this.createWhere(champs, values);

        this.database.getData(table, where)
          .then( data => {
            this.ajouteDataLocal(localData, table, data);
          })
          .catch( err => {
            console.warn("Problème pour trouver le tuple ajouté dans la BDD : " + err);
          })
        ;
       

        })
      .catch( err => {
        console.warn("Problème avec l'ajout sur la table " + table + " : " + err);
      })
    ;
  }

  ajouteDataLocal(localData: Map<String, Array<any>>, table: string, data) {
    for(let i = 0 ;  i < data.length ; i++) {
      //On vérifie que l'élément ajouté n'est pas déjà présent
      if(this.findElem(localData, table, data[i]) == -1) {
        localData[table].push(data[i]);
      }
    }
  }



  /*---------------------------------------------*/
  /*---Update d'un tuple dans la table "table"---*/
  /*---------------------------------------------*/
  update(localData: Map<String, Array<any>>, table: string, champs: Array<string>, values: Array<any>, where: string) {

    this.database.update(table, champs, values, where)
      .then(data => {
        //this.synchronise(table);

        //Ici, data ne peut pas être ajouté directement dans this.localData[table] à cause d'un problème de type
        //On cherche donc le tuple ajouté dans la base pour pouvoir l'ajouter en local
        let where = this.createWhere(champs, values);

        this.database.getData(table, where)
          .then( data => {
            
            /*for(let i = 0 ;  i < data.length ; i++) {

              //Ce truc ne marche pas puisque champs[h] est de type string
              while(j < this.localData[table].length && dejaAjoute == false) {
                let h = 0;
                while(h < champs.length && dejaAjoute == false) {
                  dejaAjoute = dejaAjoute || (data[i].champs[h] == this.localData[table][j].champs[h]);
                  h++;
                }
                j++;
              }

              //TODO : faire fonctionner le fichu truc au dessus pour éviter à avoir à trimballer le switch immonde

              //On vérifie que la valeur ajouté ne se trouve pas déjà en local
              let pos = this.findElem(table, data[i]);
              if(pos == -1) {
                console.warn("Vous tentez de modifier une valeur qui n'existe pas encore à la position " + pos);
              } else {
                this.localData[table][pos] = data[i];
              }


            }*/

            this.updateDataLocal(localData, table, data);
          })
          .catch( err => {
            console.warn("Problème pour trouver le tuple ajouté dans la BDD : " + err);
          })
        ;

      })
      .catch(err => {
        console.warn("Problème avec l'update sur la table " + table + " : " + err);
      })
    ;
  }


  updateDataLocal(localData: Map<String, Array<any>>, table: string, data) {
    for(let i = 0 ;  i < data.length ; i++) {
      let pos = this.findElem(localData, table, data[i]);
      if(pos == -1) {
        console.warn("Vous tentez de modifier une valeur qui n'existe pas encore à la position " + pos);
      } else {
        localData[table][pos] = data[i];
      }
    }
  }


  /*------------------------------------------------*/
  /*---Créer le where, utilisé pour update et add---*/
  /*------------------------------------------------*/
  createWhere(champs: Array<string>, values: Array<any>) {
    let where = " WHERE " + champs[0] + " = '" + values[0] + "'";
    for(let i = 1 ; i < champs.length ; i++) {
      where = where + " AND " + champs[i] + " = '" + values[i] + "'";
    }
    return where;
  }



  /*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
  /*---Met à jour le contenu de la variable globale relative à "table" et de la variable locale qui lui est associée avec le retour de SELECT * FROM "table"---*/
  /*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
  synchronise(localData: Map<String, Array<any>>, table: string) {
    //on prend tout les tuples de la table désirée
    this.database.getData(table, "")
      .then( data => {
        //On remet les données associées à la table en local à 0
        localData[table] = [];
        for(let i = 0 ;  i < data.length ; i++) {
          //On reremplit les dnnées associées à la table en local avec le contenu de la bdd pour la table désirée
          localData[table].push(data[i]);
        }
      })
      .catch( err => {
        console.warn("Problème pour synchroniser le contenu local la base de données " + err);
      })
    ;
  }


  /*-------------------------------------------------------------------------------*/
  /*---Supprime le contenu de la table "table" et de la variable globle associée---*/
  /*-------------------------------------------------------------------------------*/
  viderTable(localData: Map<String, Array<any>>, table: string) {
    this.database.viderTable(table)
      .then( data => {
        this.synchronise(localData, table);
      })
      .catch( err => {
        console.log("Problème avec le vidage de la table " + table + " : " + err);
      })
  }


  /*----------------------------*/
  /*---Drop toutes les tables---*/
  /*----------------------------*/
  dropAllTables(localData: Map<String, Array<any>>) {
    this.viderTable(localData, 'article');
    this.viderTable(localData, 'magasin');
    this.viderTable(localData, 'comptage');

    this.database.dropTable('article');
    this.database.dropTable('magasin');
    this.database.dropTable('comptage');
  }



  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  /*---Retourne la position de l'élément "data" dans la table "table" de localData, -1 si l'élement n'est pas dedans (impossible d'utiliser indexOf car data n'est pas du type des élément de localData["table"]---*/
  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  findElem(localData: Map<String, Array<any>>, table: string, data: any) {
    let j = 0;
    let dejaAjoute = false;

    switch(table) {
      case 'article': {
        while(j < localData[table].length && dejaAjoute == false) {
          //C'est normal que l'on ne vérifie pas pour nb
          dejaAjoute = dejaAjoute || (data.codeBarre == localData[table][j].codeBarre);
          j++;
        }
        break;
      }
      case 'article': {
        while(j < localData[table].length && dejaAjoute == false) {
          //C'est normal que l'on ne vérifie pas pour nb
          dejaAjoute = dejaAjoute || (data.idMagasin == localData[table][j].idMagasin);
          j++;
        }
        break;
      }
      case 'comptage': {
        while(j < localData[table].length && dejaAjoute == false) {
          //C'est normal que l'on ne vérifie pas pour nb
          dejaAjoute = dejaAjoute || (data.idComptage == localData[table][j].idComptage);
          j++;
        }
        break;
      }
    }

    if(dejaAjoute == true) {
      return (j-1);
    } else {
      return -1;
    }
  }

}