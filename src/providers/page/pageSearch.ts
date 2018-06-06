import { Injectable } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';

import { PageProvider } from '../../providers/page/page';

//Page spéciale pouvant réaliser un search
@Injectable()
export class PageSearchProvider extends PageProvider {

	//La liste des scans correspondants au comptage ET correspondant à la string recherchée
  	//public result: Array<any>;

  	//Indique si la searchbar est ouverte ou fermée
  	public isSearchbarOpened = false;

	/*------------------------------------*/
  /*------------Constructeur------------*/
  /*------------------------------------*/
  constructor(
   	public navCtrl: NavController,           //Pile de pages
   	public navParams: NavParams,             //Paramètres de navigation
   	public nav: Nav,                         //Gestionnaire de navigation
  ) {
		super(navCtrl, navParams, nav);
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


  //TODO : voir comment on pourrait implémenter le search (la difficulté consistant à check un champ particulier pour chaque page)
}