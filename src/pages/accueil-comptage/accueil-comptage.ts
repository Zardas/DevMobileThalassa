import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NavController, NavParams, Nav } from 'ionic-angular';

import { HomePage } from '../home/home';
import { InventaireComptagePage } from '../inventaire-comptage/inventaire-comptage';
import { NouveauComptagePage } from '../nouveau-comptage/nouveau-comptage';
import { ParametresGlobauxPage } from '../parametres-globaux/parametres-globaux';

import { PageSearchProvider } from '../../providers/page/pageSearch';

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
export class AccueilComptagePage extends PageSearchProvider {

  //La liste des scans correspondants au comptage ET correspondant à la string recherchée
  public comptage_searched: Array<any>;

  //Liste du nombre d'articles totaux pour chaque comptage (ce nombre ne change jamais donc il n'est pas forcément très cohérent de le recalculer tout le temp)
  public listeNbScanTotaux: Array<number>;

 	constructor(
  		public navCtrl: NavController,
  		public navParams: NavParams,
  		public nav: Nav,
      private sanitizer: DomSanitizer
  	) {

    super(navCtrl, navParams, nav);

    this.listeNbScanTotaux = new Array<number>();
    this.calculListeNbScanTotaux();

 		this.parametragePagesAccessibles(
      ['HomePage', 'InventaireComptagePage', 'NouveauComptagePage', 'ParametresGlobauxPage'],
      [HomePage, InventaireComptagePage, NouveauComptagePage, ParametresGlobauxPage]
    );

    

    this.getComptageCorrespondant(''); //Réinitialise le scan et affiche tout les items relatifs au comptage
 	}

  //S'éxecute quand la page est prêt
 	ionViewDidLoad() {
    console.log('ionViewDidLoad AccueilComptagePage');
    //(document.getElementById("aucuneComptage") as HTMLElement).innerHTML = this.aucuneComptage();
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
    //Version avec la hash-map
    /*for(let i = 0 ; i < this.bdd.localData['scan'].length; i++) {
      if(this.bdd.localData['scan'][i].idComptage == comptage.idComptage) {
        nb = nb + this.bdd.localData['scan'][i].quantite;
      }
    }
    return nb;*/
    //Version avec requête SQLite
    return this.getBDD('scan', ['idComptage'], [comptage.idComptage]).then( data => {
      for(let i = 0 ; i < data.length ; i++) {
        nb = nb + data[i].quantite;
      }
      return nb;
    });
  }
  /*----------------------------------------------------------------
   * Initialise et remplit la variable listeNbScanTotaux
   * Utilisé pour le badge à gauche de chaque comptage dans la liste
   *--------------------------------------------------------------*/
  calculListeNbScanTotaux() {
    //Version avec la hash-map
    /*for(let i = 0 ; i < this.bdd.localData['comptage'].length ; i++) {
      this.listeNbScanTotaux[i] = this.findNBArticles(this.bdd.localData['comptage'][i]);
    }*/
    //Version avec requête SQLite
    for(let i = 0 ; i < this.bdd.localData['comptage'].length ; i++) {
      this.findNBArticles(this.bdd.localData['comptage'][i]).then( data => {
        this.listeNbScanTotaux[i] = data;
      });
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
