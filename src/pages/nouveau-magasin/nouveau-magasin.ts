import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { ListeMagasinPage } from '../liste-magasin/liste-magasin';

import { PageProvider } from '../../providers/page/page';
/**
 * Generated class for the NouveauMagasinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nouveau-magasin',
  templateUrl: 'nouveau-magasin.html',
})
export class NouveauMagasinPage extends PageProvider {

	//Nom du nouveau magasin
	public nomMagasin: string;

 	constructor(
  		public navCtrl: NavController,
  		public navParams: NavParams,
  		public nav: Nav
  	) {

  		super(navCtrl, navParams, nav);

  		this.parametragePagesAccessibles(
  			['ListeMagasinPage'],
  			[ListeMagasinPage]
  		);
  	}

  	ionViewDidLoad() {
    	console.log('ionViewDidLoad NouveauMagasinPage');
  	}








  	/*------------------------------------------------*/
  	/*------------Fonctions pour AngularJS------------*/
  	/*------------------------------------------------*/
  	/*------------------------------------------------------------
   	 * Retourne la taille du nom de magasin actuellement rentré
   	 * Utilisé pour afficher en direct la taille du nom du magasin
   	 *----------------------------------------------------------*/
  	getNameLength() {
    	if(this.nomMagasin == undefined) {
      	return 0;
    	} else {
      	return this.nomMagasin.length;
    	}
  	}








  	/*--------------------------------------------------------------*/
  	/*------------Fonctions liées à l'ajout d'un magasin------------*/
  	/*--------------------------------------------------------------*/
  	/*--------------------------------------------------------------------------------------*/
  	/*------------Ajoute un magasin dans la base grâce aux informations rentrées------------*/
  	/*--------------------------------------------------------------------------------------*/
  	enregistrerMagasin() {
    	console.log('Nom magasin : ' + this.nomMagasin);

    	let nomValide = this.nomMagasinValide();

    	console.log("Nom : " + nomValide);

    	//Affichage message d'erreur si le nom est invalide (trop long)
    	let invalidMessage_nom = document.getElementById("invalidMessage_nom") as HTMLElement;
    	if(!nomValide) {
      		invalidMessage_nom.innerHTML = "Vous devez rentrer un nom valide";
    	} else {
      		invalidMessage_nom.innerHTML = "";
    	}

    	//On ajoute dans la BDD si toute les validations sont passées
    	if(nomValide) {
    		let id = this.getIdNouveauMagasin();
			this.addBDD('magasin', ['idMagasin', 'nom'], [id, this.nomMagasin]).then( () => {
        		this.goTo('ListeMagasinPage');
      		});
    	}
  	}

	/*----------------------------------------------------------------------------------------------------*/
  	/*------------Renvoie l'id a attribuer au nouveau comptage (l'id le plus haut +1)------------*/
  	/*----------------------------------------------------------------------------------------------------*/
  	getIdNouveauMagasin() {
    	return (this.findIdMagasinMax()+1);
  	}

	findIdMagasinMax() {
    	let idMax = -1;

    	for(let i = 0 ; i < this.bdd.localData['magasin'].length ; i++) {
      		if(this.bdd.localData['magasin'][i].idMagasin > idMax) { //Normalement, on entre toujours dans le if vu que c'est croissant, mais dans le doute on fait quand même
        		idMax = this.bdd.localData['magasin'][i].idMagasin;
      		}
    	}
    	return idMax;
  	}

	/*--------------------------------------------------------------------------------------------------------------*/
  	/*------------Renvoie true si le nom du nouveau magasin est valide (infèrieure à la taille maximale)------------*/
  	/*--------------------------------------------------------------------------------------------------------------*/
  	nomMagasinValide() {
    	if(this.nomMagasin != undefined) {
      		return (this.nomMagasin.length > 0 && this.nomMagasin.length <= this.constantes.tailleMaxNomMagasin);
    	} else {
      		return false;
    	}
  	}

}
