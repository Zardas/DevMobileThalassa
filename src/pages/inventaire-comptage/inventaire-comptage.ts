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





@IonicPage()
@Component({
  selector: 'page-inventaire-comptage',
  templateUrl: 'inventaire-comptage.html',
})

export class InventaireComptagePage {

  private pagesAccessibles: Map<String, any>;
  private listeProduit: Array<[string, number]>;
  private database: Database;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, public nav: Nav,
    private toastCtrl: ToastController
  ) {

    this.listeProduit = Array<[string, number]>();

    this.pagesAccessibles = new Map<String, any>();
    this.pagesAccessibles['HomePage'] = HomePage;

    this.creationBDD();
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
      this.database = new Database(new SQLite());
  }

  addBDD() {
    this.database.addUser("John","12345");
  }


  getDealer() {
    console.log(this.database.getDealer());
  }

  showConsoleMessage() {
    console.log(this.database.getConsoleMessage());
  }

  viderTableUser() {
    this.database.viderTableUser();
  }

  aucuneArticle() {
    return this.database.tableUserVide();
  }

  aucuneArticleBis() {
    console.log(this.aucuneArticle());
  }

  /*-------------------------------------------------------------*/
  /*---------------------Ajout d'un article---------------------*/
  /*-----------------------------------------------------------*/
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




