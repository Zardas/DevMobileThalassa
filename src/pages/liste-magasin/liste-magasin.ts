import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { AccueilComptagePage } from '../accueil-comptage/accueil-comptage';
import { NouveauMagasinPage } from '../nouveau-magasin/nouveau-magasin';

import { PageSearchProvider } from '../../providers/page/pageSearch';
/**
 * Generated class for the ListeMagasinPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-liste-magasin',
  templateUrl: 'liste-magasin.html',
})
export class ListeMagasinPage extends PageSearchProvider {

  //La liste des magasins correspondant à la string recherchée
  public magasin_searched: Array<any>;


  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public nav: Nav
  ) {

  	super(navCtrl, navParams, nav);

  	this.parametragePagesAccessibles(
      ['AccueilComptagePage', 'NouveauMagasinPage'],
      [AccueilComptagePage, NouveauMagasinPage]
    );

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListeArticlePage');
    this.search('');
  }


  /*------------------------------------------------*/
  /*------------Fonctions pour AngularJS------------*/
  /*------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------------------------------------
   * Return "Il n'y a actuellement aucun magasin, appuyez sur le + en bas pour en créer un" s'il n'y a aucune magasin et "" sinon
   * Utilisé pour indiquer à l'utilisateur ce qu'il doit faire si il n'y a aucun magasin
   *----------------------------------------------------------------------------------------------------------------------------*/
  aucunMagasin() {
    if(this.bdd.localData['magasin'].length == 0) {
      return "Il n'y a actuellement aucun magasin, appuyez sur le + en bas pour en créer un";
    } else {
      return "";
    }
  }


  /*-------------------------------------------------*/
  /*------------Fonctions liées au search------------*/
  /*-------------------------------------------------*/
  /*-----------------------------------------------------------------------------------------------------------------------------------------*/
  /*------------Créer la liste de tout les magasins possédant searched dans leur nom, en parcourant la liste de tout les magasins------------*/
  /*-----------------------------------------------------------------------------------------------------------------------------------------*/
  search(searched) {
    console.log("Search");
    this.magasin_searched = new Array<any>();

    let loading = document.getElementById("loading") as HTMLElement;
    loading.style.display = 'block';

    this.getBDD('magasin', [], []).then( data => {
      this.magasin_searched = [];

      if(searched == '') {

        for(let i = 0 ; i < data.length ; i++) {
          this.magasin_searched.push(data[i]);
        }

      } else {

        let re = new RegExp(searched.target.value, "i");
        for(let i = 0 ; i < data.length ; i++) {
          if((data[i].nom).search(re) != -1) {
            this.magasin_searched.push(data[i]);
          }
        }

      }
      loading.style.display = 'none';
    });
  }

}
