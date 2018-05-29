import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { DatabaseUtilisation } from '../../providers/databaseProvider/databaseProviderUtilisation';

import { InventaireComptagePage } from '../inventaire-comptage/inventaire-comptage';

/**
 * Generated class for the ParametresComptagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parametres-comptage',
  templateUrl: 'parametres-comptage.html',
})
export class ParametresComptagePage {

	//Liste des pages accessibles, utiliser pour les fonctions de navigation afin d'éviter que l'on puisse aller n'importe où
  	private pagesAccessibles: Map<String, any>;

  	//Provider possédant à la fois la base de donnée et la hash-map localData
  	public bdd: DatabaseUtilisation;

  	//Le comptage
  	public comptage;  

    //Nom du nouveau comptage (https://stackoverflow.com/questions/46494041/cant-get-value-of-input-ionic-3)
    public nomComptage;

    //Taille maximale du nom
    public tailleMaxNom: number;

  	constructor(
  		public navCtrl: NavController,
  		public navParams: NavParams,
  		public nav: Nav
  	) {
  		this.parametragePagesAccessibles();

    	//On récupère la base de données
    	if(navParams.get('database') == undefined) {
      		this.refreshBDD();
    	} else {
      	this.bdd = navParams.get('database');
    	}

    	//On récupère le comptage
    	if(navParams.get('comptage') == undefined) {
      		this.comptage = new Array<any>();
      		this.comptage.idComptage = -1;
    	} else {
      		this.comptage = navParams.get('comptage');
    	}

      this.tailleMaxNom = 50;
  	}

  	/*---------------------------------------------------------------------*/
  	/*------------Fonction de paramétrage des pages accessibles------------*/
  	/*---------------------------------------------------------------------*/
	  parametragePagesAccessibles() {
    	this.pagesAccessibles = new Map<String, any>();
    	this.pagesAccessibles['InventaireComptagePage'] = InventaireComptagePage;
  	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad ParametresComptagePage');
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
    	this.nav.setRoot(this.pagesAccessibles[page], {database: this.bdd});
  	}
  	goToInventaire() {
    	this.nav.setRoot(InventaireComptagePage, {database: this.bdd, comptage: this.comptage});
  	}

  	/*----------------------------------------------------------------------------------*/
 	/*------------Créer une nouvelle base de données (avec les bonnes tables------------*/
  	/*----------------------------------------------------------------------------------*/
  	refreshBDD() {
    	this.bdd = new DatabaseUtilisation();
  	}

    updateBDD(table, champs: Array<any>, values: Array<any>) {
      this.bdd.update(table, champs, values, "idComptage = " + this.comptage.idComptage);
    }

  	changerOuvertureComptage() {
      this.updateBDD('comptage', ['ouvert'], [1-this.comptage.ouvert]);
      this.comptage.ouvert = !this.comptage.ouvert; //Nécéssaire puisque les affichages se font en fonction de la variable locale comptage
  	}

  	getOuverture() {
  		if(this.comptage.ouvert) {
  			return {text: "Comptage ouvert", icon: "unlock"};
  		} else {
  			return {text: "Comptage fermé", icon: "lock"};
  		}
  	}










    /*------------------------------------------------------------------------------------
    * Retourne la taille du nom de comptage actuellement rentré
    * Utilisé pour afficher en direct la taille du nom
    *----------------------------------------------------------------------------------*/
    getNameLength() {
      if(this.nomComptage == undefined) {
        return 0
      } else {
        return this.nomComptage.length;
      }
    }


    changeName() {
      console.log("AAAAA");
    }
}
