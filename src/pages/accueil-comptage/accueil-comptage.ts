import { Component } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';

import { HomePage } from '../home/home';
import { InventaireComptagePage } from '../inventaire-comptage/inventaire-comptage';
import { ParametresComptagePage } from '../parametres-comptage/parametres-comptage';

import { DatabaseUtilisation } from '../../providers/databaseProvider/databaseProviderUtilisation';
/**
 * Generated class for the AccueilComptagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-accueil-comptage',
  templateUrl: 'accueil-comptage.html',
})
export class AccueilComptagePage {

	private pagesAccessibles: Map<String, any>;

  private bdd: DatabaseUtilisation;
  public localData: Map<String, Array<any>>;

 	constructor(
  		public navCtrl: NavController,
  		public navParams: NavParams,
  		public nav: Nav
  	) {

 		this.parametragePagesAccessibles();
    
    this.bdd = navParams.get('database');
    this.localData = navParams.get('localData');


 	}


 	ionViewDidLoad() {
    	console.log('ionViewDidLoad AccueilComptagePage');
 	}

	/*open = on met la page désirée sur le devant de la scène
 	Mais la page précédente (this quoi) serra toujours derrière
 	*/
 	open(page) {
  		this.navCtrl.push(this.pagesAccessibles[page]);
 	}
  
 	//goTo = mettre en racine la page désirée -> différent de open
 	goTo(page) {
    	this.nav.setRoot(this.pagesAccessibles[page], {database: this.bdd, localData: this.localData});
 	}

 	/*---------------------------------------------------------------------*/
  /*------------Fonction de paramétrage des pages accessibles------------*/
  /*---------------------------------------------------------------------*/
  parametragePagesAccessibles() {
   	this.pagesAccessibles = new Map<String, any>();
   	this.pagesAccessibles['HomePage'] = HomePage;
   	this.pagesAccessibles['InventaireComptagePage'] = InventaireComptagePage;
   	this.pagesAccessibles['ParametresComptagePage'] = ParametresComptagePage;
 	}




  addBDD(user: string, champs: Array<any>, values: Array<any>) {
    this.bdd.addBDD(this.localData, user, champs, values);
  }

  viderTable(table: string) {
    this.bdd.viderTable(this.localData, table);
  }

  
}
