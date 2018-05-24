import { Component } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';

import { AccueilComptagePage } from '../accueil-comptage/accueil-comptage';
import { DatabaseUtilisation } from '../../providers/databaseProvider/databaseProviderUtilisation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  private pagesAccessibles: Map<String, any>;

  public bdd: DatabaseUtilisation;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public nav: Nav
  ) {
    
    this.pagesAccessibles = new Map<String, any>();
    
    this.pagesAccessibles['AccueilComptagePage'] = AccueilComptagePage;


    if(navParams.get('database') == undefined) {
      this.refreshBDD();
    } else {
      this.bdd = navParams.get('database');
    }
    
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
    this.nav.setRoot(AccueilComptagePage, {database: this.bdd});
  }



  addBDD(user: string, champs: Array<any>, values: Array<any>) {
    this.bdd.addBDD(user, champs, values);
  }

  viderTable(table: string) {
    this.bdd.viderTable(table);
  }

  dropAllTables() {
    this.bdd.dropAllTables();
  }
  
  refreshBDD() {
    this.bdd = new DatabaseUtilisation();
  }
}
