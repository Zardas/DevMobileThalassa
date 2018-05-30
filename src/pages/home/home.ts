import { Component } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';

import { AccueilComptagePage } from '../accueil-comptage/accueil-comptage';
import { DatabaseUtilisation } from '../../providers/databaseProvider/databaseProviderUtilisation';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {

  //Liste des pages accessibles, utiliser pour les fonctions de navigation afin d'éviter que l'on puisse aller n'importe où
  private pagesAccessibles: Map<String, any>;

  //Provider possédant à la fois la base de donnée et la hash-map localData
  public bdd: DatabaseUtilisation;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public nav: Nav
  ) {
    
    this.parametragePagesAccessibles();

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
    this.nav.setRoot(this.pagesAccessibles[page], {database: this.bdd});
  }


  /*---------------------------------------------------------------------*/
  /*------------Fonction de paramétrage des pages accessibles------------*/
  /*---------------------------------------------------------------------*/
  parametragePagesAccessibles() {
    this.pagesAccessibles = new Map<String, any>();

    this.pagesAccessibles['AccueilComptagePage'] = AccueilComptagePage;
  }

  /*----------------------------------------------------------------------------------*/
  /*------------Créer une nouvelle base de données (avec les bonnes tables------------*/
  /*----------------------------------------------------------------------------------*/
  refreshBDD() {
    this.bdd = new DatabaseUtilisation();
  }

  

  addBDD(table: string, champs: Array<any>, values: Array<any>) {
    this.bdd.addBDD(table, champs, values);
  }

  viderTable(table: string) {
    this.bdd.viderTable(table, '');
  }

  dropAllTables() {
    this.bdd.dropAllTables();
  }
  

  
}
