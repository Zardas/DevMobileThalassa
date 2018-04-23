import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../databaseProvider/databaseProvider';

//import { DatabaseProvider } from '../databaseProvider/databaseProvider';
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





@IonicPage()
@Component({
  selector: 'page-inventaire-comptage',
  templateUrl: 'inventaire-comptage.html',
})

export class InventaireComptagePage {

  private pagesAccessibles: Map<String, any>;
  private listeProduit: Array<[string, number]>;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, public nav: Nav,
    private toastCtrl: ToastController,
    private sqlite: SQLite,
    private database: DatabaseProvider
  ) {

    this.listeProduit = Array<[string, number]>();

    this.pagesAccessibles = new Map<String, any>();
    this.pagesAccessibles['HomePage'] = HomePage;

    this.sqlite = new SQLite();

    

    

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
  creationBDD() {
    

      /*------------------*/
      /*---Création BDD---*/
      /*------------------*/
      this.sqlite.create({
        name: 'inventaire.db',
        location: 'default'
      })
        .then( (db: SQLiteObject) => {
          this.isOpen = true;
          this.bdd = db;
          db.executeSQL('CREATE TABLE IF NOT EXISTS Article(id INTEGER PRIMARY KEY, prix INTEGER)', [])
            .then( () => console.log('Ca marche omg Oo'))
            .catch( e => console.log('a'));
        })
        .catch( e => console.log('b'));
  }

  addBDD() {
    /*this.bdd.executeSQL('INSERT INTO Article VALUES(0,9)', {})
    .then( () => console.log('Insertion complétée'))
    .catch( e => console.log('Insertion ratée'));*/
  }


  CreateArticle() {
    this.database.createArticle(0,10)
      .then( (data) => {
        console.log(data);
        console.log("Réussite 1");
      }, (error) => {
        console.log(error);
        console.log("Echec 1");
      })
  }


  GetAllArticles() {
    this.database.getAllArticles()
      .then( (data) => {
        console.log(data);
        console.log("Réussite 2");
        console.log(this.ArticlesListes(data));
      }, (error) => {
        console.log(error);
        console.log("Echec 2");
      })
  }

  ArticlesListes(data) {
    let listeData = "";
    for(var i = 0 ; i < data.rows.length ; i++) {
      listeData = listeData + "[" + data.rows.item(i).id + ";" + data.rows.item(i).prix + "] ; ";
    }
    return listeData;
  }



  ajout(numero) {
    let i = 0;
    while(i < this.listeProduit.length && this.listeProduit[i][0] != numero) {
      i++
    }
    if(i < this.listeProduit.length) {
      console.log(this.listeProduit[i]);
      this.listeProduit[i][1] = this.listeProduit[i][1] + 1;
    } else {
      this.listeProduit.push([numero, 1]);
    }
  }




  


}




