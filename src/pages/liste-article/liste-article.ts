import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { AccueilComptagePage } from '../accueil-comptage/accueil-comptage';
import { NouveauArticlePage } from '../nouveau-article/nouveau-article';

import { PageSearchProvider } from '../../providers/page/pageSearch';

/**
 * Generated class for the ListeArticlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-liste-article',
  templateUrl: 'liste-article.html',
})
export class ListeArticlePage extends PageSearchProvider {
  
  //La liste des articles correspondant à la string recherchée
  public article_searched: Array<any>;


  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public nav: Nav
  ) {

  	super(navCtrl, navParams, nav);

  	this.parametragePagesAccessibles(
      ['NouveauArticlePage', 'AccueilComptagePage'],
      [NouveauArticlePage, AccueilComptagePage]
    );

    this.search('');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListeArticlePage');
  }

  getStock(article: any) {
    if(article.stock == undefined) {
      return 'Stock indisponible';
    } else {
      return article.stock;
    }
  }



  /*-------------------------------------------------*/
  /*------------Fonctions liées au search------------*/
  /*-------------------------------------------------*/
  /*-----------------------------------------------------------------------------------------------------------------------------------------*/
  /*------------Créer la liste de tout les articles possédant searched dans leur nom, en parcourant la liste de tout les articles------------*/
  /*-----------------------------------------------------------------------------------------------------------------------------------------*/
  search(searched) {
    console.log("Search");
    this.article_searched = new Array<any>();

    //on remplit le tableau scans_searched
    if(searched != '') {
      let re = new RegExp(searched.target.value, "i");
      for(let i = 0 ; i < this.bdd.localData['article'].length ; i++) {
        if((this.bdd.localData['article'][i].designation).search(re) != -1) {
          this.article_searched.push(this.bdd.localData['article'][i]);
        }
      }
    } else {
      this.article_searched = this.bdd.localData['article'];
    }
  }
}
