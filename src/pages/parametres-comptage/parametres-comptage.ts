import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, AlertController } from 'ionic-angular';

import { PageProvider } from '../../providers/page/page';

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
export class ParametresComptagePage extends PageProvider {

  	//Le comptage
  	public comptage;  

    //Nom du nouveau comptage (https://stackoverflow.com/questions/46494041/cant-get-value-of-input-ionic-3)
    public newName: string;


    /*------------------------------------*/
    /*------------Constructeur------------*/
    /*------------------------------------*/
  	constructor(
  		public navCtrl: NavController,
  		public navParams: NavParams,
  		public nav: Nav,
      private alertCtrl: AlertController //Permet d'afficher des alertes (pour le nom et la quantité des articles scanné)
  	) {

      super(navCtrl, navParams, nav);

  		this.parametragePagesAccessibles(['AccueilComptagePage', 'InventaireComptagePage'], [AccueilComptagePage, InventaireComptagePage]);


    	//On récupère le comptage
    	if(navParams.get('comptage') == undefined) {
      		this.comptage = new Array<any>();
      		this.comptage.idComptage = -1;
    	} else {
      		this.comptage = navParams.get('comptage');
    	}

  	}


  	ionViewDidLoad() {
    	console.log('ionViewDidLoad ParametresComptagePage');
  	}



  	/*-----------------------------------------------*/
 	  /*------------Fonctions de navigation------------*/
  	/*-----------------------------------------------*/
    //Un goTo spéciale pour aller à l'inventaire car il faut aussi passé le comptage (pour que inventaireComptage sache quel comptage elle doit afficher)
  	goToInventaire() {
    	this.nav.setRoot(InventaireComptagePage, {database: this.bdd, comptage: this.comptage});
  	}


    /*-----------------------------------------------------------------------------------------------------------*/
    /*------------Cette fonction permet de ne pas avoir à repréciser le where à chaque appel d'update------------*/
    /*-----------------------------------------------------------------------------------------------------------*/
    updateBDD_withWhere(table, champs: Array<any>, values: Array<any>) {
      this.updateBDD(table, champs, values, "idComptage = " + this.comptage.idComptage);
    }
    














    /*----------------------------------------------------------------------*/
    /*------------Fonctions liées au changement de l'état ouvert------------*/
    /*----------------------------------------------------------------------*/
  	changerOuvertureComptage() {
      this.updateBDD_withWhere('comptage', ['ouvert'], [1-this.comptage.ouvert]);
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
    /*---------------------------------------------------------
    * Retourne la taille du nom de comptage actuellement rentré
    * Utilisé pour afficher en direct la taille du nom
    *--------------------------------------------------------*/
    getNameLength() {
      if(this.newName == undefined) {
        return 0
      } else {
        return this.newName.length;
      }
    }

    /*-------------------------------------------------------------------------*/
    /*------------Change le nom du comptage dans la BDD et en local------------*/
    /*-------------------------------------------------------------------------*/
    changeName() {
      let nomValide = this.nomComptageValide();
      //Affichage message d'erreur si le nom est invalide (trop long)
      let invalidMessage_nom = document.getElementById("invalidMessage_nom") as HTMLElement;

      if(!nomValide) {
        invalidMessage_nom.innerHTML = "Vous devez rentrer un nom valide";
      } else {
        invalidMessage_nom.innerHTML = "";
        this.updateBDD_withWhere('comptage', ['nom'], [this.newName]);
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
        return (this.newName.length > 0 && this.newName.length <= this.constantes.tailleMaxNom);
      }
    }














    /*-------------------------------------------------------------*/
    /*------------Fonctions liées au vidage du comptage------------*/
    /*-------------------------------------------------------------*/
    /*-----------------------------------------------------------------
    * Affiche un pop-up demandant la confirmation du vidage du comptage
    * Utilisé lors de l'appui sur le bouton de suppression du comptage
    *----------------------------------------------------------------*/
    viderComptage() {
      let alert = this.alertCtrl.create({
        title: 'Vidage de ' + this.comptage.nom,
        message: 'Êtes-vous sûr de vouloir vider ' + this.comptage.nom + ' ?',
        buttons: [
          {
            text: 'Non',
            role: 'cancel',
            handler: () => {
              console.log('Vidage annulée');
            }
          },
          {
            text: 'Oui',
            handler: () => {
              this.viderComptageConfirmed();
            }
          }
        ]
      });
      alert.present();
    }

    /*----------------------------------------------------------------------------------*/
    /*------------Vide le comptage actuel et repasse sur la page du comptage------------*/
    /*----------------------------------------------------------------------------------*/
    viderComptageConfirmed() {
      //Avant de supprimer le comptage, il faut supprimer tout les scans qui lui sont associés
      this.deleteBDD('scan', 'idComptage = ' + this.comptage.idComptage).then( () => {
          this.goToInventaire();
      });
    }













    /*--------------------------------------------------------------------*/
    /*------------Fonctions liées à la suppression du comptage------------*/
    /*--------------------------------------------------------------------*/
    /*-------------------------------------------------------------------------
    * Affiche un pop-up demandant la confirmation de la suppression du comptage
    * Utilisé lors de l'appui sur le bouton de suppression du comptage
    *-------------------------------------------------------------------------*/
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

    /*----------------------------------------------------------------------------------------*/
    /*------------Supprime le comptage actuel et passe sur la page accueilComptage------------*/
    /*----------------------------------------------------------------------------------------*/
    deleteComptageConfirmed() {
      //Avant de supprimer le comptage, il faut supprimer tout les scans qui lui sont associés
      this.deleteBDD('scan', 'idComptage = ' + this.comptage.idComptage).then( () => {
        this.deleteBDD('comptage', 'idComptage = ' + this.comptage.idComptage).then( () => {
          this.goTo('AccueilComptagePage');
        });
      });
    }
    
}
