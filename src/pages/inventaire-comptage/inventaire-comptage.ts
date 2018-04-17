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
    
    let stockInitial = this.destockJson();
    //S'il n'y a pas de variables locale, on initialise le tableau à vide
    //Sinon, on met le tableau existant à la place (pérénnité des données)
    if(stockInitial == null) {
      this.listeProduit = new Array<[string, number]>();
    } else {
      this.listeProduit = this.destockJson();
    }

    this.pagesAccessibles['HomePage'] = HomePage;
  }

  ionViewDidLoad() {
    console.log('InventaireComptage didLoad()');
  }


  /*
  open = on met la page désirée sur le devant de la scène
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


  /*
  Ajout d'un tuple [string, int] où string est numero et int le numéro précédemment
  associé à string, mais incrémenté de 1. S'il n'existe aucun tuple avec string dans la
  liste : on le rajoute à la fin avec comme nombre d'occurence (puisque il s'agit de 
  cela) 1
  */
  ajout(numero) {
    let i = 0;
    while(i < this.listeProduit.length && this.listeProduit[i][0] != numero) {
      i++
    }
    if(i < this.listeProduit.length) {
      //console.log(this.listeProduit[i]);
      this.listeProduit[i][1] = this.listeProduit[i][1] + 1;
    } else {
      this.listeProduit.push([numero, 1]);
    }

    this.stockJson();
  }

  //Les deux fonctions suivantes permettent la pérénisation des données, même lorsque l'on quitte l'application

  //Stock le contenu de la liste des produits dans un fichier JSON en local
  stockJson() {
    let myJSON = JSON.stringify(this.listeProduit);
    localStorage.setItem("ScannedItems", myJSON);
  }

  /*
  Retourne la liste des produits inscrite dans la fichier json sous forme
  d'un Array<[string, name]>. Elle est par exemple utilisée dans la constructeur
  pour repartir avec les données de la session précédente
  */
  destockJson(): Array<[String, number]> {
    let text = localStorage.getItem("ScannedItems")
    console.log("parse");

    if(text == null) {
      return null;
    } else {
      
      let scannedItems = JSON.parse(text);
      for(let i = 0 ; i < scannedItems.length ; i++) {
        console.log(scannedItems[i]);
      }

      return scannedItems;
    }
  }

  //Vide la liste de toute les données
  viderLesDonnees() {
    this.listeProduit = new Array<[string, number]>();
    this.stockJson();
  }
}

