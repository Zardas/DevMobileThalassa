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

  private bdd: DatabaseUtilisation;
  public localData: Map<String, Array<any>>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public nav: Nav
  ) {
    
    this.pagesAccessibles = new Map<String, any>();
    
    this.pagesAccessibles['AccueilComptagePage'] = AccueilComptagePage;

    //console.log('NavParams : ' + navParams.get('database'));

    //this.localData = new Map<String, Array<any>>();

    if(navParams.get('database') == undefined || navParams.get('localData') == undefined) {
      console.log('FLAG A');
      this.refreshBDD();
    } else {
      console.log('FLAG B');
      this.bdd = navParams.get('database');
      this.localData = navParams.get('localData');
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
    this.nav.setRoot(AccueilComptagePage, {database: this.bdd, localData: this.localData});
  }



  addBDD(user: string, champs: Array<any>, values: Array<any>) {
    this.bdd.addBDD(this.localData, user, champs, values);
  }

  viderTable(table: string) {
    this.bdd.viderTable(this.localData, table);
  }


  refreshBDD() {
    this.localData = new Map<String, Array<any>>();
    this.bdd = new DatabaseUtilisation(this.localData);
  }
}
