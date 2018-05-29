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

  //Liste des pages accessibles, utiliser pour les fonctions de navigation afin d'éviter que l'on puisse aller n'importe où
	private pagesAccessibles: Map<String, any>;

  //Provider possédant à la fois la base de donnée et la hash-map localData
  public bdd: DatabaseUtilisation;

  //La liste des scans correspondants au comptage ET correspondant à la string recherchée
  public comptage_searched: Array<any>;

  //Indique si la searchbar est ouverte ou fermée
  public isSearchbarOpened = false;

 	constructor(
  		public navCtrl: NavController,
  		public navParams: NavParams,
  		public nav: Nav,
      private sanitizer: DomSanitizer
  	) {

 		this.parametragePagesAccessibles();
    
    if(navParams.get('database') == undefined) {
      this.refreshBDD();
    } else {
      this.bdd = navParams.get('database');
    }

    this.getComptageCorrespondant('');
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

  //Un goTo spéciale pour aller à un comptage en particulier car il faut aussi fournir l'id du comptage
  goToComptage(comptage) {
    this.nav.setRoot(InventaireComptagePage, {database: this.bdd, comptage: comptage});
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
    this.bdd.viderTable(table);
  }

  /*-------------------------------------------------------------------------------------------------------------*/
  /*------------Retourne la couleur du fond du badge en fonction de l'état (fermé ou non) du comptage------------*/
  /*-------------------------------------------------------------------------------------------------------------*/
  setColorBadge(comptage: any) {
    //Explication : https://angular.io/api/platform-browser/DomSanitizer
    if(comptage.ouvert == 1) {
      //Cas ouvert, on est en XLBlue
      return this.sanitizer.bypassSecurityTrustStyle('#0cb3e8');
    } else if(comptage.ouvert == 0) {
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
  findNomTypeComptage(nomTypeComptage: string) {
    //On trouve l'indice de l'élément
    let i = 0;
    while(i < this.bdd.localData['typeComptage'].length && this.bdd.localData['typeComptage'][i].nom != nomTypeComptage) {
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

  /*------------------------------------------------------------------------------------------------------------------------------
   * Return "close" si la barre de recherche est ouvert et "search" sinon
   * Utilisé pour trouver quelle icône afficher à droite (loupe ou croix) en fonction de l'état de la searchbar (fermée ou ouverte)
   *-----------------------------------------------------------------------------------------------------------------------------*/
  getNameIcon() {
    if(this.isSearchbarOpened) {
      return "close";
    } else {
      return "search";
    }
  }



  /*-----------------------------------------------------------------------------------------------------------------------------------------*/
  /*------------Créer la liste de tout les comptage possédant searched dans leur nom, en parcourant la liste de tout les comptage------------*/
  /*-----------------------------------------------------------------------------------------------------------------------------------------*/
  getComptageCorrespondant(searched) {
    console.log("Search");
    this.comptage_searched = new Array<any>();

    //on remplit le tableau scans_searched
    if(searched != '') {
      let re = new RegExp(searched.target.value, "i");
      for(let i = 0 ; i < this.bdd.localData['comptage'].length ; i++) {
        if((this.bdd.localData['comptage'][i].nom).search(re) != -1) {
          this.comptage_searched.push(this.bdd.localData['comptage'][i]);
        }
      }
    } else {
      this.comptage_searched = this.bdd.localData['comptage'];
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
