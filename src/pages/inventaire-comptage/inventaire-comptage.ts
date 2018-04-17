import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController } from 'ionic-angular';

import { HomePage } from '../home/home';

/**
 * Generated class for the InventaireComptagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
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
    private toastCtrl: ToastController
  ) {
    
    this.pagesAccessibles = new Map<String, any>();
    this.listeProduit = Array<[string, number]>();

    this.pagesAccessibles['HomePage'] = HomePage;
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

  affList() {

  }
}
