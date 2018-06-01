import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NavController, NavParams, Nav } from 'ionic-angular';

import { HomePage } from '../home/home';
import { InventaireComptagePage } from '../inventaire-comptage/inventaire-comptage';
import { NouveauComptagePage } from '../nouveau-comptage/nouveau-comptage';

import { PageProvider } from '../../providers/page/page';

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
export class AccueilComptagePage extends PageProvider {

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

    super(navCtrl, navParams, nav);

 		this.parametragePagesAccessibles(['HomePage', 'InventaireComptagePage', 'NouveauComptagePage'], [HomePage, InventaireComptagePage, NouveauComptagePage]);

    this.getComptageCorrespondant(''); //Réinitialise le scan et affiche tout les items relatifs au comptage
 	}


 	ionViewDidLoad() {
    console.log('ionViewDidLoad AccueilComptagePage');
 	}

  //Un goTo spéciale pour aller à un comptage en particulier car il faut aussi fournir l'id du comptage
  goToComptage(comptage) {
    this.nav.setRoot(InventaireComptagePage, {database: this.bdd, comptage: comptage});
  }










  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/


  /*------------------------------------------------*/
  /*------------Fonctions pour AngularJS------------*/
  /*------------------------------------------------*/
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


  /*------------------------------------------------------------------------------------------------------------------------------
   * Return "Il n'y a actuellement aucun comptage, appuyez sur le + en bas pour en créer un" s'il n'y a aucune comtage et "" sinon
   * Utilisé pour indiquer à l'utilisateur ce qu'il doit faire si il n'y a aucun comptage
   *----------------------------------------------------------------------------------------------------------------------------*/
  aucuneComptage() {
    if(this.bdd.localData['comptage'].length == 0) {
      return "Il n'y a actuellement aucun comptage, appuyez sur le + en bas pour en créer un";
    } else {
      return "";
    }
  }
















  /*--------------------------------------------------------------------------------------------------------------------------------------------------*/




  /*-------------------------------------------------*/
  /*------------Fonctions liées au search------------*/
  /*-------------------------------------------------*/
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
