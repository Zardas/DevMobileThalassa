import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SQLite } from '@ionic-native/sqlite';

/**
 * Generated class for the LocalDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


/*
  Note d'utilisation : lorsque une table doit être rajoutée, penser à modifier les fonctions parametrageTables, findElem
  et dropAllTables pour qu'elle puisse la prendre en compte
*/

interface champ {
  nom: string;
  type: string;
  primaryKey: boolean;
}

interface table {
  nom: string;
  champs: Array<champ>;
}
@IonicPage()
@Component({
  selector: 'page-local-data',
  templateUrl: 'local-data.html',
})
export class LocalDataPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocalDataPage');
  }

}
