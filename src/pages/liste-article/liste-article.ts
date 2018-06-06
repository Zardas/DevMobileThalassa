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

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListeArticlePage');
    this.search('');
  }

  getStock(article: any) {
    if(article.stock == undefined) {
      return 'Stock indisponible';
    } else {
      return article.stock;
    }
  }







  /*------------------------------------------------*/
  /*------------Fonctions pour AngularJS------------*/
  /*------------------------------------------------*/
  /*------------------------------------------------------------------------------------------------------------------------------
   * Return "Il n'y a actuellement aucun article, appuyez sur le + en bas pour en créer un" s'il n'y a aucune article et "" sinon
   * Utilisé pour indiquer à l'utilisateur ce qu'il doit faire si il n'y a aucun article
   *----------------------------------------------------------------------------------------------------------------------------*/
  aucuneComptage() {
    if(this.bdd.localData['article'].length == 0) {
      return "Il n'y a actuellement aucun article, appuyez sur le + en bas pour en créer un";
    } else {
      return "";
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

    let loading = document.getElementById("loading") as HTMLElement;
    loading.style.display = 'block';

    this.getBDD('article', [], []).then( data => {
      this.article_searched = [];

      if(searched == '') {

        for(let i = 0 ; i < data.length ; i++) {
          this.article_searched.push(data[i]);
        }

      } else {

        let re = new RegExp(searched.target.value, "i");
        for(let i = 0 ; i < data.length ; i++) {
          if((data[i].designation).search(re) != -1) {
            this.article_searched.push(data[i]);
          }
        }

      }
      loading.style.display = 'none';
    });
  }

}
