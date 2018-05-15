import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { Database } from '../../providers/databaseProvider/databaseProvider';
import { HomePage } from '../home/home';
/**
 * Generated class for the InventaireComptagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/* 
  Si jamais window et document ne sont pas reconnus
  const win: any = window;
  const doc: any = document;
*/

/*
  Note d'utilisation : lorsque une table doit être rajoutée, penser à modifier les fonctions parametrageTables, findElem
  et dropAllTables pour qu'elle puisse la prendre en compte
*/


interface champ {
  nom: string;
  type: string;
  primaryKey: boolean;
}

interface table {
  nom: string;
  champs: Array<champ>;
}

/*
interface user {
  username: string;
  password: string;
}
interface article {
  id: number;
  nb: number;
  prix: number;
}
*/

@IonicPage()
@Component({
  selector: 'page-inventaire-comptage',
  templateUrl: 'inventaire-comptage.html',
})

export class InventaireComptagePage {

  //Liste des pages accessibles, utiliser pour les fonctions de navigation afin d'éviter que l'on puisse aller n'importe où
  private pagesAccessibles: Map<String, any>;

  //Base de donnée sur laquelle les différentes requêtes seront effectuées
  private database: Database;

  //Taille des codes barres à scanner (typiquement 13)
  private tailleCodeBarre: number;

  //Liste des tables de database
  private tables: Array<table>;

  //Données en local utilisé par angular pour afficher les valeurs dynamiquement dans le html et synchronisé avec le contenu de la base à chaque requête et chargement de cette page
  private localData: Map<String, Array<any>>;
  

  //Options pour le scanner
  private BarcodeOptions = {
    //Afficher le bouton pour changer l'orientation de la caméra
    showFlipCameraButton: true,
    //Affiche le bouton allumant la lumière de la caméra
    showTorchButton: true,
    //Temps où le résultat est affiché (0 ne l'affiche pas)
    resultDisplayDuration: 0,
    //Texte afficher en bas de la fenêtre de scan et donnant des instructions à l'utilisateur
    prompt: "Placer le code-barre au niveau du trait rouge (et entièrement dans la zone de scan)"
  };


  /*------------------------------------*/
  /*------------Constructeur------------*/
  /*------------------------------------*/
  constructor(
    public navCtrl: NavController,         //Pile de pages
    public navParams: NavParams,           //Paramètres de navigation
    public nav: Nav,                       //Gestionnaire de navigation
    private toastCtrl: ToastController,    //Contrôleur des toast (les petits popup)
    private barcodeScanner: BarcodeScanner //Scanner des code-barrres
  ) {

    this.tailleCodeBarre = 13;

    this.parametragePagesAccessibles();

    this.parametrageTables();    

    this.creationBDD(this.tables);

  }


  /*---------------------------------------------------------------------*/
  /*------------Fonction de paramétrage des pages accessibles------------*/
  /*---------------------------------------------------------------------*/
  parametragePagesAccessibles() {
    this.pagesAccessibles = new Map<String, any>();

    this.pagesAccessibles['HomePage'] = HomePage;
  }


  /*-------------------------------------------------------------------------------------------------------*/
  /*------------Fonction de paramétrage des tables ! A modifier lorsque l'on ajoute une table !------------*/
  /*-------------------------------------------------------------------------------------------------------*/
  parametrageTables() {
    this.tables = [];

    /* Pour la table user */
    let champsTableUser: Array<champ> = [];
    champsTableUser.push({nom: 'username', type: 'VARCHAR(255)', primaryKey: true});
    champsTableUser.push({nom: 'password', type: 'VARCHAR(255)', primaryKey: false});

    /* Pour la table article */
    let champsTableArticle: Array<champ> = [];
    champsTableArticle.push({nom: 'id', type: 'VARCHAR(255)', primaryKey: true});
    champsTableArticle.push({nom: 'nb', type: 'VARCHAR(255)', primaryKey: false});
    champsTableArticle.push({nom: 'prix', type: 'VARCHAR(255)', primaryKey: false});

    /* On met tout ça dans les tables qui seront créées plus tard */
    this.tables.push({nom: 'user', champs: champsTableUser});
    this.tables.push({nom: 'article', champs: champsTableArticle});

    /* Et on en profite pour créer les donénes en local (puisque elle sont liées aux tables à créer */
    this.localData = new Map<String, Array<any>>();
    this.localData['user'] = [];
    this.localData['article'] = [];
  }


  ionViewDidLoad() {
    console.log('InventaireComptage didLoad()');
  }


  /*-----------------------------------------------*/
  /*------------Fonctions de navigation------------*/
  /*-----------------------------------------------*/
  /*open = on met la page désirée sur le devant de la scène
  Mais la page précédente (this quoi) serra toujours derrière
  */
  open(page) {
  	this.navCtrl.push(this.pagesAccessibles[page]);
  }
  /*goTo = mettre en racine la page désirée -> différent de open
  */
  goTo(page) {
    this.nav.setRoot(this.pagesAccessibles[page]);
  }








  /*---------------------------------------------------------*/
  /*------------Partie gestion de BDD avec SQLite------------*/
  /*---------------------------------------------------------*/
  /*------------------*/
  /*---Création BDD---*/
  /*------------------*/
  creationBDD(tables: Array<table>) {
      //Création d'une nouvelle base de données
      this.database = new Database(new SQLite(), tables);

      //Création des tables associées à cette base /! VOIR le tuto très bien fait pour ça : https://javascript.developpez.com/actu/146280/Comprendre-les-Promises-en-JavaScript-TypeScript-article-de-yahiko/
      return this.database.connectToDb()
        .then(data => {

          console.log("Connexion avec la BDD réussie");
          for(let i of tables) {
            /* Création de la  BDD réussie : on synchronise les données en local avec */
            this.synchronise(i.nom);
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
  addBDD(table: string, champs: Array<string>, values: Array<any>) {

    this.database.add(table, champs, values)
      .then( data => {
        //this.synchronise(table);

        //Ici, data ne peut pas être ajouté directement dans this.localData[table] à cause d'un problème de type
        //On cherche donc le tuple ajouté dans la base pour pouvoir l'ajouter en local
        let where = this.createWhere(champs, values);

        this.database.getData(table, where)
          .then( data => {
            for(let i = 0 ;  i < data.length ; i++) {
              //On vérifie que l'élément ajouté n'est pas déjà présent
              if(this.findElem(table, data[i]) == -1) {
                this.localData[table].push(data[i]);
              }
            }
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


  

  /*---------------------------------------------*/
  /*---Update d'un tuple dans la table "table"---*/
  /*---------------------------------------------*/
  update(table: string, champs: Array<string>, values: Array<any>, where: string) {

    this.database.update(table, champs, values, where)
      .then(data => {
        //this.synchronise(table);

        //Ici, data ne peut pas être ajouté directement dans this.localData[table] à cause d'un problème de type
        //On cherche donc le tuple ajouté dans la base pour pouvoir l'ajouter en local
        let where = this.createWhere(champs, values);

        this.database.getData(table, where)
          .then( data => {
            for(let i = 0 ;  i < data.length ; i++) {

              //Ce truc ne marche pas puisque champs[h] est de type string
              /*while(j < this.localData[table].length && dejaAjoute == false) {
                let h = 0;
                while(h < champs.length && dejaAjoute == false) {
                  dejaAjoute = dejaAjoute || (data[i].champs[h] == this.localData[table][j].champs[h]);
                  h++;
                }
                j++;
              }*/

              //TODO : faire fonctionner le fichu truc au dessus pour éviter à avoir à trimballer le switch immonde

              //On vérifie que la valeur ajouté ne se trouve pas déjà en local
              let pos = this.findElem(table, data[i]);
              if(pos == -1) {
                console.warn("Vous tentez de modifier une valeur qui n'existe pas encore à la position " + pos);
              } else {
                this.localData[table][pos] = data[i];
              }
            }
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
  synchronise(table: string) {
    //on prend tout les tuples de la table désirée
    this.database.getData(table, "")
      .then( data => {
        //On remet les données associées à la table en local à 0
        this.localData[table] = [];
        for(let i = 0 ;  i < data.length ; i++) {
          //On reremplit les dnnées associées à la table en local avec le contenu de la bdd pour la table désirée
          this.localData[table].push(data[i]);
        }
      })
      .catch( err => {
        console.warn("Problème pour synchroniser le contenu local la base de donénes " + err);
      })
    ;
  }



  /*-------------------------------------------------------------------------------*/
  /*---Supprime le contenu de la table "table" et de la variable globle associée---*/
  /*-------------------------------------------------------------------------------*/
  viderTable(table: string) {
    this.database.viderTable(table)
      .then( data => {
        this.synchronise(table);
      })
      .catch( err => {
        console.log("Problème avec le vidage de la table " + table + " : " + err);
      })
  }








  /*---------------------------------*/
  /*---Fonctions relatives au scan---*/
  /*---------------------------------*/
  /*-----------------------*/
  /*---Fonctions de scan---*/
  /*-----------------------*/
  scanBarcode() {
    //On appel la fonction scan sur le barcodeScanner
    this.barcodeScanner.scan(this.BarcodeOptions)
      .then( barcodeData => {
        //On affiche un message de succès (optionnel)
        this.presentToast("We got a barcode\n" +
                          "Result : " + barcodeData.text + "\n" +
                          "Format : " + barcodeData.format + "\n" +
                          "Cancelled : " + barcodeData.cancelled);
        //On ajoute le code-barre scanné en local et dans la BDD
        this.scanArticle(barcodeData.text);
      })
      .catch( err => {
        this.presentToast('Erreur avec le scan : ' + err);
      })
    ;
  }

  /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  /*---Ajoute l'article avec l'id inscrit dans l'input associé à code-barre dans le tableau (s'il n'existe pas déjà), ou incrément sa valeur nb de 1 s'il existe déjà---*/
  /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  scanArticle(article: string) {

    let article = (document.getElementById("inputScan") as HTMLInputElement).value;
    
    if(this.checkFormatArticle(article)) {

      //On vérifie si article est présent dans la liste des articles
      let i = 0;
      console.log("Taille locale : " + this.localData['article'].length);
      while(i < this.localData['article'].length && String(this.localData['article'][i].id) != article) {
        i++;
      }

      if(i < this.localData['article'].length) {
        //Cas UPDATE : l'article est déjà présent : on incrémente sa quantité 1
        console.log('Déjà présent');
        this.update('article', ['nb'], [parseInt(this.localData['article'][i].nb) + 1], "id = " + article);
      } else {
        //Cas ADD : l'article n'est pas présent, on l'add avec une quantité de 1
        console.log('Pas déjà présent');
        this.addBDD('article', ['id', 'prix', 'nb'], [parseInt(article), 5, 1]);
      }

    } else {
      console.log("Aucun article scanné");
    }
  }

  /*-----------------------------------------------------------------*/
  /*---Vérifie si l'article scanné est au bon format (13 chiffres)---*/
  /*-----------------------------------------------------------------*/
  checkFormatArticle(toCheck: any) {
    return (toCheck.length == this.tailleCodeBarre);
  }

  /*-----------------------------------------------------------------------*/
  /*---Fonction perso pour vérifier si "elem" est présent dans "tableau"---*/
  /*-----------------------------------------------------------------------*/
  contains(tableau: Array<any>, elem: any) {
    let j = 0;
    while(tableau[j] != elem && j < tableau.length) {
      j++;
    }
    return (j < tableau.length);
  }

  /*-----------------------------------------------------------------------------------------*/
  /*---Fonction de push perso ne pushant pas si l'élément est déjà présent dans le tableau---*/
  /*-----------------------------------------------------------------------------------------*/
  pushPerso(tableau: Array<any>, elem: any) {
    console.log(this.contains(tableau, elem));
    if(this.contains(tableau, elem) == false) {
      console.log('a');
      tableau.push(elem);
    }
  }




  /*------------------------------------------*/
  /*------------Fonctions diverses------------*/
  /*------------------------------------------*/
  /*--------------------------------------------------------------*/
  /*------------Affichage d'un toast en bas de l'écran------------*/
  /*--------------------------------------------------------------*/
  presentToast(textToDisplay) {
    let toast = this.toastCtrl.create({
      message: textToDisplay,
      duration: 4000,
      position: 'bottom',
      showCloseButton: true
    });

    toast.onDidDismiss( () => {
      console.log('Toast Dismissed');
    });

    toast.present();
  }


  /*----------------------------*/
  /*---Drop toutes les tables---*/
  /*----------------------------*/
  dropAllTables() {
    this.viderTable('user');
    this.viderTable('article');

    this.database.dropTable('user');
    this.database.dropTable('article');
  }

  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  /*---Retourne la position de l'élément "data" dans la table "table" de localData, -1 si l'élement n'est pas dedans (impossible d'utiliser indexOf car data n'est pas du type des élément de localData["table"]---*/
  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  findElem(table: string, data: any) {
    let j = 0;
    let dejaAjoute = false;

    switch(table) {
      case 'user': {
        while(j < this.localData[table].length && dejaAjoute == false) {
          dejaAjoute = dejaAjoute || (data.username == this.localData[table][j].username && data.password == this.localData[table][j].password);
          j++;
        }
        break;
      }
      case 'article': {
        while(j < this.localData[table].length && dejaAjoute == false) {
          //C'est normal que l'on ne vérifie pas pour nb
          dejaAjoute = dejaAjoute || (data.id == this.localData[table][j].id && data.prix == this.localData[table][j].prix);
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




