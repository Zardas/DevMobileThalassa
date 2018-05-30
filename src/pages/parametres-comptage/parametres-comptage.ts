import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, AlertController } from 'ionic-angular';

import { DatabaseUtilisation } from '../../providers/databaseProvider/databaseProviderUtilisation';

import { AccueilComptagePage } from '../accueil-comptage/accueil-comptage';
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
    public newName: string;

    //Taille maximale du nom
    public tailleMaxNom: number;

  	constructor(
  		public navCtrl: NavController,
  		public navParams: NavParams,
  		public nav: Nav,
      private alertCtrl: AlertController //Permet d'afficher des alertes (pour le nom et la quantité des articles scanné)
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
      this.pagesAccessibles['AccueilComptagePage'] = AccueilComptagePage;
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





    /*----------------------------------------------------------------------*/
    /*------------Fonctions liées au changement de l'état ouvert------------*/
    /*----------------------------------------------------------------------*/
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









    /*------------------------------------------------------------*/
    /*------------Fonctions liées au changement de nom------------*/
    /*------------------------------------------------------------*/
    /*------------------------------------------------------------------------------------
    * Retourne la taille du nom de comptage actuellement rentré
    * Utilisé pour afficher en direct la taille du nom
    *----------------------------------------------------------------------------------*/
    getNameLength() {
      if(this.newName == undefined) {
        return 0
      } else {
        return this.newName.length;
      }
    }


    changeName() {
      console.log('TYPE : ' + typeof this.newName);
      let nomValide = this.nomComptageValide();
      //Affichage message d'erreur si le nom est invalide (trop long)
      let invalidMessage_nom = document.getElementById("invalidMessage_nom") as HTMLElement;
      if(!nomValide) {
        invalidMessage_nom.innerHTML = "Vous devez rentrer un nom valide";
      } else {
        invalidMessage_nom.innerHTML = "";
        this.updateBDD('comptage', ['nom'], [this.newName]);
        this.comptage.nom = this.newName;
      }      
    }

    /*---------------------------------------------------------------------------------------------------------------*/
    /*------------Renvoie true si le nom du nouveau comptage est valide (infèrieure à la taille maximale)------------*/
    /*---------------------------------------------------------------------------------------------------------------*/
    nomComptageValide() {
      if(this.newName == undefined) {
        return false;
      } else {
        return (this.newName.length > 0 && this.newName.length <= this.tailleMaxNom);
      }
    }





    /*--------------------------------------------------------------------*/
    /*------------Fonctions liées à la suppression du comptage------------*/
    /*--------------------------------------------------------------------*/
    deleteBDD(table: string, where: string) {
      return this.bdd.viderTable(table, where)
    }


    deleteComptage() {
      let alert = this.alertCtrl.create({
        title: 'Suppression de ' + this.comptage.nom,
        message: 'Êtes-vous sûr de vouloir supprimer ' + this.comptage.nom + ' ?',
        buttons: [
          {
            text: 'Non',
            role: 'cancel',
            handler: () => {
              console.log('Suppression annulée');
            }
          },
          {
            text: 'Oui',
            handler: () => {
              this.deleteComptageConfirmed();
            }
          }
        ]
      });
      alert.present();
    }


    deleteComptageConfirmed() {
      //Avant de supprimer le comptage, il faut supprimer tout les scans qui lui sont associés
      this.deleteBDD('scan', 'idComptage = ' + this.comptage.idComptage).then( () => {
        this.deleteBDD('comptage', 'idComptage = ' + this.comptage.idComptage).then( () => {
          this.goTo('AccueilComptagePage');
        });
      });
    }
    
}
