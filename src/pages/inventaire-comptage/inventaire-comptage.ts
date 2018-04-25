import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
//import { DatabaseProvider } from '../databaseProvider/databaseProvider';
import { Database } from '../databaseProvider/databaseProvider';
import { HomePage } from '../home/home';
/**
 * Generated class for the InventaireComptagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/* Si jamais window et document ne sont pas reconnus
const win: any = window;
const doc: any = document;
*/

var users: Array<user> = [];
var article: Array<article> = [];

interface champ {
  nom: string;
  type: string;
  primaryKey: boolean;
}

interface table {
  nom: string;
  champs: Array<champ>;
}

interface user {
  username: string;
  password: string;
}
interface article {
  id: integer;
  prix: integer;
}

@IonicPage()
@Component({
  selector: 'page-inventaire-comptage',
  templateUrl: 'inventaire-comptage.html',
})

export class InventaireComptagePage {

  private pagesAccessibles: Map<String, any>;
  private database: Database;
  public userss: Array<user> = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, public nav: Nav,
    private toastCtrl: ToastController,
  ) {


    this.pagesAccessibles = new Map<String, any>();
    this.pagesAccessibles['HomePage'] = HomePage;

    let tables: Array<table> = [];

    /* Création de l'array de configuration des tables */
    let champsTableUser: Array<champ> = [];
    champsTableUser.push({nom: 'username', type: 'VARCHAR(255)', primaryKey: true});
    champsTableUser.push({nom: 'password', type: 'VARCHAR(255)', primaryKey: false});

    let champsTableArticle: Array<champ> = [];
    champsTableArticle.push({nom: 'id', type: 'INTEGER', primaryKey: true});
    champsTableArticle.push({nom: 'prix', type: 'INTEGER', primaryKey: false});

    tables.push({nom: 'user', champs: champsTableUser});
    tables.push({nom: 'Article', champs: champsTableArticle});

    this.creationBDD(tables);
  }




  ionViewDidLoad() {
    console.log('InventaireComptage didLoad()');
  }


  /*open = on met la page désirée sur le devant de la scène
  Mais la page précédente (this quoi) serra toujours derrière
  */
  open(page) {
  	this.navCtrl.push(this.pagesAccessibles[page]);
  }

  //goTo = mettre en racine la page désirée -> différent de open
  goTo(page) {
    this.nav.setRoot(this.pagesAccessibles[page]);
  }


  //Affichage d'un toast en bas de l'écran
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


  /*---------------------------------------------------------*/
  /*------------Partie gestion de BDD avec SQLite------------*/
  /*---------------------------------------------------------*/
  /*------------------*/
  /*---Création BDD---*/
  /*------------------*/
  creationBDD(tables: Array<table>) {
      this.database = new Database(new SQLite(), tables);
  }

  /*-----------------------------*/
  /*---Ajout d'un utilisateur---*/
  /*---------------------------*/
  addBDD(table: string, champs: Array<string>, values: Array<string>) {
    this.database.add(table, champs, values);
    this.synchronise(table);
  }

  /*----------------------------------------------------------------------------------------------*/
  /*---Met à jour le contenu de la variable globale users avec le retour de SELECT * FROM user---*/
  /*--------------------------------------------------------------------------------------------*/
  synchronise(table: string) {
    users = [];
    this.database.getData(table).then(function(res) {
      //Ici, on ne peut accéder à rien qui appartiennent à la classe InventaireComptagePage
      //C'est pour cela que l'on doit utiliser une variable globale
      for(let i = 0 ; i < res.length ; i++) {
        users.push({username: res[i].username, password: res[i].password});
      }
    });
    this.userss = users;
  }

  /*-----------------------------------------------------*/
  /*---Affiche le contenu de la variable globale users---*/
  /*-----------------------------------------------------*/
  afficheUser() {
    for(let i = 0 ; i < users.length ; i++) {
      console.log("Username : " + users[i].username + " | Password : " + users[i].password);
    }
  }

  /*--------------------------------------------------------------------------------*/
  /*---Supprime le contenu de la table SQLite user et de la variable globle users---*/
  /*--------------------------------------------------------------------------------*/
  viderTable(table: string) {
    this.database.viderTable(table);
    this.synchronise(table);
  }

  /*--------------------------------------------------------*/
  /*---Renvoit true si la variable globale users est vide---*/
  /*--------------------------------------------------------*/
  aucuneArticle() {
    return (users.length == 0);
  }

  /*-------------------------------------------------------*/
  /*---Affiche true si la variable global users est vide---*/
  /*-------------------------------------------------------*/
  aucuneArticleAffiche() {
    console.log(this.aucuneArticle());
  }





  


}




