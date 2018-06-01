import { Component } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';

import { AccueilComptagePage } from '../accueil-comptage/accueil-comptage';

import { PageProvider } from '../../providers/page/page';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage extends PageProvider {


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public nav: Nav
  ) {
    
    super(navCtrl, navParams, nav);

    this.parametragePagesAccessibles(['AccueilComptagePage'], [AccueilComptagePage]);    
  }


  ionViewDidLoad() {
  	console.log("Home didLoad()");
  }

  
}
