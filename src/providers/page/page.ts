import { Injectable } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';

import { DatabaseUtilisation } from '../../providers/databaseProvider/databaseProviderUtilisation';
import { ConstantesProvider } from '../../providers/constantes/constantes';

/*
  Generated class for the PageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

/* Représente une page de base, aec ses fonctions de déplacement, sa liaison avec la BDD... */

@Injectable()
export class PageProvider {

	//Provider possédant à la fois la base de donnée et la hash-map localData
 	public bdd: DatabaseUtilisation;

 	//Provider avec toute les constantes de l'application
 	public constantes: ConstantesProvider

 	//Liste des pages accessibles, utiliser pour les fonctions de navigation afin d'éviter que l'on puisse aller n'importe où
  	private pagesAccessibles: Map<String, any>;

 	constructor(
 		public navCtrl: NavController,
    	public navParams: NavParams,
    	public nav: Nav
	) {

 		if(navParams.get('database') == undefined) {
      		this.refreshBDD();
    	} else {
      	this.bdd = navParams.get('database');
    	}

    	
    	this.constantes = new ConstantesProvider();
    	console.log('Hello PageProvider Provider');
 	}


 	/*open = on met la page désirée sur le devant de la scène
 	Mais la page précédente (this quoi) serra toujours derrière
	*/
  	open(page) {
  		this.navCtrl.push(this.pagesAccessibles[page], {database: this.bdd});
  	}
  
  	//goTo = mettre en racine la page désirée -> différent de open
  	goTo(page) {
    	this.nav.setRoot(this.pagesAccessibles[page], {database: this.bdd});
  	}


  	/*---------------------------------------------------------------------*/
  	/*------------Fonction de paramétrage des pages accessibles------------*/
  	/*---------------------------------------------------------------------*/
  	parametragePagesAccessibles(listName: Array<string>, listPage: Array<any>) {
    	this.pagesAccessibles = new Map<String, any>();
    	let min = Math.min(listName.length, listPage.length);

    	for(let i = 0 ; i < min ; i++) {
    		this.pagesAccessibles[listName[i]] = listPage[i];
    	}
  	}

  	/*----------------------------------------------------------------------------------*/
  	/*------------Créer une nouvelle base de données (avec les bonnes tables------------*/
  	/*----------------------------------------------------------------------------------*/
  	refreshBDD() {
    	this.bdd = new DatabaseUtilisation();
  	}


	addBDD(table: string, champs: Array<any>, values: Array<any>) {
    	this.bdd.addBDD(table, champs, values);
  	}

  	viderTable(table: string) {
    	this.bdd.viderTable(table, '');
  	}

  	dropAllTables() {
    	this.bdd.dropAllTables();
  	}


}
