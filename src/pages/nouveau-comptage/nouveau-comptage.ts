import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { AccueilComptagePage } from '../accueil-comptage/accueil-comptage';

import { DatabaseUtilisation } from '../../providers/databaseProvider/databaseProviderUtilisation';
/**
 * Generated class for the NouveauComptagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nouveau-comptage',
  templateUrl: 'nouveau-comptage.html',
})
export class NouveauComptagePage {

	//Liste des pages accessibles, utiliser pour les fonctions de navigation afin d'éviter que l'on puisse aller n'importe où
	private pagesAccessibles: Map<String, any>;

  //Provider possédant à la fois la base de donnée et la hash-map localData
  public bdd: DatabaseUtilisation;

  //Nom du nouveau comptage (https://stackoverflow.com/questions/46494041/cant-get-value-of-input-ionic-3)
  public nomComptage;

  //Type du nouveau comptage
  public typeComptage;

  //Magasin du nouveau comptage
  public magasinComptage;

 	constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
     public nav: Nav
  ) {
    this.parametragePagesAccessibles();

    if(navParams.get('database') == undefined) {
      this.refreshBDD();
    } else {
      this.bdd = navParams.get('database');
    }
  }

  ionViewDidLoad() {
   	console.log('ionViewDidLoad NouveauComptagePage');
  }

  /*open = on met la page désirée sur le devant de la scène
  Mais la page précédente (this quoi) serra toujours derrière
  */
  open(page) {
    this.navCtrl.push(this.pagesAccessibles[page]);
  }
  
  //goTo = mettre en racine la page désirée -> différent de open
  goTo(page) {
    this.nav.setRoot(this.pagesAccessibles[page], {database: this.bdd});
  }

  /*---------------------------------------------------------------------*/
  /*------------Fonction de paramétrage des pages accessibles------------*/
  /*---------------------------------------------------------------------*/
  parametragePagesAccessibles() {
    this.pagesAccessibles = new Map<String, any>();
    this.pagesAccessibles['AccueilComptagePage'] = AccueilComptagePage;
  }


  refreshBDD() {
    this.bdd = new DatabaseUtilisation();
  }


  getNameLength() {
    if(this.nomComptage == undefined) {
      return 0
    } else {
      return this.nomComptage.length;
    }
  }



  /*---------------------------------------------------------------------------------------*/
  /*------------Ajoute un comptage dans la base grâce aux informations rentrées------------*/
  /*---------------------------------------------------------------------------------------*/
  enregistrerComptage() {
    console.log('MyInput : ' + this.myInput);
  }

  public myInput;
  logChange(event) {
  console.log(event);
}


}
