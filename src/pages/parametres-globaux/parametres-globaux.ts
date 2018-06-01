import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { AccueilComptagePage } from '../accueil-comptage/accueil-comptage';
import { ListeArticlePage } from '../liste-article/liste-article';

import { PageProvider } from '../../providers/page/page';

/**
 * Generated class for the ParametresGlobauxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-parametres-globaux',
  templateUrl: 'parametres-globaux.html',
})
export class ParametresGlobauxPage extends PageProvider {

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public nav: Nav
  ) {

  	super(navCtrl, navParams, nav);

  	this.parametragePagesAccessibles(
      ['AccueilComptagePage', 'ListeArticlePage'],
      [AccueilComptagePage, ListeArticlePage]
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParametresGlobauxPage');
  }

}
