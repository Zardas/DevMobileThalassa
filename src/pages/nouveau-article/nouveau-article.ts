import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { ListeArticlePage } from '../liste-article/liste-article';

import { PageProvider } from '../../providers/page/page';
/**
 * Generated class for the NouveauArticlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nouveau-article',
  templateUrl: 'nouveau-article.html',
})
export class NouveauArticlePage extends PageProvider {

	//Nom du nouvel article
	public nomArticle;

  //Codebarre du nouvel article
  public codeBarre;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public nav: Nav
  ) {

  	super(navCtrl, navParams, nav);

  	this.parametragePagesAccessibles(['ListeArticlePage'], [ListeArticlePage]);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NouveauArticlePage');
  }




  /*------------------------------------------------*/
  /*------------Fonctions pour AngularJS------------*/
  /*------------------------------------------------*/
  /*--------------------------------------------------------
   * Retourne la taille du nom d'article actuellement rentré
   * Utilisé pour afficher en direct la taille du nom
   *------------------------------------------------------*/
  getNameLength() {
    if(this.nomArticle == undefined) {
      return 0;
    } else {
      return this.nomArticle.length;
    }
  }
  /*--------------------------------------------------------
   * Retourne la taille du codeBarre actuellement rentré
   * Utilisé pour afficher en direct la taille du codeBarre
   *------------------------------------------------------*/
  getCodeBarreLength() {
    if(this.codeBarre == undefined) {
      return 0;
    } else {
      return this.codeBarre.length;
    }
  }


  
}
