import { Component } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';

import { AccueilComptagePage } from '../accueil-comptage/accueil-comptage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  private pagesAccessibles: Map<String, any>;
  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public nav: Nav
  ) {
    
    this.pagesAccessibles = new Map<String, any>();
    
    this.pagesAccessibles['AccueilComptagePage'] = AccueilComptagePage;
  }

  ionViewDidLoad() {
  	console.log("Home didLoad()");
  }


  /*open = on met la page désirée sur le devant de la scène
  Mais la page précédente (this quoi) serra toujours derrière
  */
  open(page) {
  	this.navCtrl.push(this.pagesAccessibles[page]);
  }
  

  //goTo = mettre en racine la page désirée -> différent de open
  goTo(page) {
    this.nav.setRoot(this.pagesAccessibles[page]);
  }

}
