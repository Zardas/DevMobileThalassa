import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { ParametresGlobauxPage } from '../parametres-globaux/parametres-globaux';
import { NouveauArticlePage } from '../nouveau-article/nouveau-article';

import { PageProvider } from '../../providers/page/page';

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
export class ListeArticlePage extends PageProvider {

  public isSearchbarOpened = false;
  
  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public nav: Nav
  ) {

  	super(navCtrl, navParams, nav);

  	this.parametragePagesAccessibles(
      ['ParametresGlobauxPage', 'NouveauArticlePage'],
      [ParametresGlobauxPage, NouveauArticlePage]
    );
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

}
