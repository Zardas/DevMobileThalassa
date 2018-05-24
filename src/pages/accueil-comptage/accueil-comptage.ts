import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NavController, NavParams, Nav } from 'ionic-angular';

import { HomePage } from '../home/home';
import { InventaireComptagePage } from '../inventaire-comptage/inventaire-comptage';
import { ParametresComptagePage } from '../parametres-comptage/parametres-comptage';
import { NouveauComptagePage } from '../nouveau-comptage/nouveau-comptage';

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

  public bdd: DatabaseUtilisation;

  public isSearchbarOpened = false;

 	constructor(
  		public navCtrl: NavController,
  		public navParams: NavParams,
  		public nav: Nav,
      private sanitizer: DomSanitizer
  	) {

 		this.parametragePagesAccessibles();
    
    this.bdd = navParams.get('database');
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
    	this.nav.setRoot(this.pagesAccessibles[page], {database: this.bdd});
 	}

 	/*---------------------------------------------------------------------*/
  /*------------Fonction de paramétrage des pages accessibles------------*/
  /*---------------------------------------------------------------------*/
  parametragePagesAccessibles() {
   	this.pagesAccessibles = new Map<String, any>();
   	this.pagesAccessibles['HomePage'] = HomePage;
   	this.pagesAccessibles['InventaireComptagePage'] = InventaireComptagePage;
   	this.pagesAccessibles['ParametresComptagePage'] = ParametresComptagePage;
    this.pagesAccessibles['NouveauComptagePage'] = NouveauComptagePage;
 	}




  addBDD(table: string, champs: Array<any>, values: Array<any>) {
    this.bdd.addBDD(table, champs, values);
  }

  viderTable(table: string) {
    this.bdd.viderTable(table);
  }

  /*-------------------------------------------------------------------------------------------------------------*/
  /*------------Retourne la couleur du fond du badge en fonction de l'état (fermé ou non) du comptage------------*/
  /*-------------------------------------------------------------------------------------------------------------*/
  setColorBadge(comptage: any) {
    //Explication : https://angular.io/api/platform-browser/DomSanitizer
    if(comptage.ouvert == 'true') {
      //Cas ouvert, on est en XLBlue
      return this.sanitizer.bypassSecurityTrustStyle('#0cb3e8');
    } else if(comptage.ouvert == 'false') {
      //Cas fermé, on est en rouge
      return this.sanitizer.bypassSecurityTrustStyle('#f44336');
    } else {
      //Cas inconnu, on met en gris moche
      return this.sanitizer.bypassSecurityTrustStyle('rgb(120,120,120)');
    }
  }


  /*---------------------------------------------------------------------------------*/
  /*------------Retourne le nom du type de comptage associé à un comptage------------*/
  /*---------------------------------------------------------------------------------*/
  findNomTypeComptage(idTypeComptage: number) {
    //On trouve l'indice de l'élément
    let i = 0;
    while(i < this.bdd.localData['typeComptage'].length && this.bdd.localData['typeComptage'][i].idTypeComptage != idTypeComptage) {
      i++;
    }

    if(i < this.bdd.localData['typeComptage'].length) {
      //On a bien trouvé l'indice
      return this.bdd.localData['typeComptage'][i].nom;
    } else {
      //On n'a pas trouvé l'indice
      return 'Type de Comptage inconnu';
    }
  }

  /*------------------------------------------------------------------------------------
   * Trouve le nombre de scan (quantité, pas scan individuels) relatif au comptage this
   * Utilisé pour le badge à gauche de chaque comptage dans la liste
   *----------------------------------------------------------------------------------*/
  findNBArticles(comptage) {
    let nb = 0;
    for(let i = 0 ; i < this.bdd.localData['scan'].length; i++) {
      if(this.bdd.localData['scan'][i].idComptage == comptage.idComptage) {
        nb = nb + this.bdd.localData['scan'][i].quantite;
      }
    }
    return nb;
  }

  getNameIcon() {
    if(this.isSearchbarOpened) {
      return "close";
    } else {
      return "search";
    }
  }


  /*-----------------------------------------------------------------------------------------------------*/
  /*------------Fonctions pour générer des scans d'exemple (pas utile pour la version finale)------------*/
  /*-----------------------------------------------------------------------------------------------------*/
  ajouteScanExemple(comptage: any) {
    this.addBDD('scan', ['dateScan', 'codeBarre', 'designation', 'idComptage', 'quantite', 'auteur', 'prixEtiquette', 'prixBase'], [this.getRandomDate(2018), '1111111111111', 'Exemple', comptage.idComptage, this.getRandomInt(11), 'Lexempleur', 30.5, 40.8]);
  }

  getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }

  getRandomDate(annee: number) {
    return this.getRandomInt(annee) + "-" + this.getRandomInt(13) + "-" + this.getRandomInt(32);
  }
}
