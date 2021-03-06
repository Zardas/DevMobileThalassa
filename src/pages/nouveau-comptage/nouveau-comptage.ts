import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';

import { AccueilComptagePage } from '../accueil-comptage/accueil-comptage';

import { PageProvider } from '../../providers/page/page';
/**
 * Generated class for the NouveauComptagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-nouveau-comptage',
  templateUrl: 'nouveau-comptage.html',
})
export class NouveauComptagePage extends PageProvider {

  //Nom du nouveau comptage (https://stackoverflow.com/questions/46494041/cant-get-value-of-input-ionic-3)
  public nomComptage;

  //Type du nouveau comptage
  public typeComptage;

  //Magasin du nouveau comptage
  public magasinComptage;


 	constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
     public nav: Nav
  ) {

    super(navCtrl, navParams, nav);

    this.parametragePagesAccessibles(['AccueilComptagePage'], [AccueilComptagePage]);

  }

  ionViewDidLoad() {
   	console.log('ionViewDidLoad NouveauComptagePage');
  }









  /*------------------------------------------------*/
  /*------------Fonctions pour AngularJS------------*/
  /*------------------------------------------------*/
  /*------------------------------------------------------------------------------------
   * Retourne la taille du nom de comptage actuellement rentré
   * Utilisé pour afficher en direct la taille du nom
   *----------------------------------------------------------------------------------*/
  getNameLength() {
    if(this.nomComptage == undefined) {
      return 0
    } else {
      return this.nomComptage.length;
    }
  }















  /*---------------------------------------------------------------*/
  /*------------Fonctions liées à l'ajout d'un comptage------------*/
  /*---------------------------------------------------------------*/
  /*---------------------------------------------------------------------------------------*/
  /*------------Ajoute un comptage dans la base grâce aux informations rentrées------------*/
  /*---------------------------------------------------------------------------------------*/
  enregistrerComptage() {
    console.log('Nom Comptage : ' + this.nomComptage);
    console.log('Type Comptage : ' + this.typeComptage);
    console.log('Magasin Comptage : ' + this.magasinComptage);

    let nomValide = this.nomComptageValide();
    let typeValide = this.typeComptageValide();
    let magasinValide = this.magasinValide();

    console.log("Nom : " + nomValide);
    console.log("Type : " + typeValide);
    console.log("Magasin : " + magasinValide);

    //Affichage message d'erreur si le nom est invalide (trop long)
    let invalidMessage_nom = document.getElementById("invalidMessage_nom") as HTMLElement;
    if(!nomValide) {
      invalidMessage_nom.innerHTML = "Vous devez rentrer un nom valide";
    } else {
      invalidMessage_nom.innerHTML = "";
    }

    //Affichage message d'erreur si le type est invalide (pas cohérent avec la bdd)
    let invalidMessage_type = document.getElementById("invalidMessage_type") as HTMLElement;
    if(!typeValide) {
      invalidMessage_type.innerHTML = "Vous devez rentrer un type valide";
    } else {
      invalidMessage_type.innerHTML = "";
    }

    //Affichage message d'erreur si le magasin est invalide (pas cohérent avec la bdd)
    let invalidMessage_magasin = document.getElementById("invalidMessage_magasin") as HTMLElement;
    if(!magasinValide) {
      invalidMessage_magasin.innerHTML = "Vous devez rentrer un magasin valide";
    } else {
      invalidMessage_magasin.innerHTML = "";
    }

    //Pour gérer le cas du magasin non spécifié (non, on ne peut pas juste mettre "" comme value)
    let comptageType: string;
    if(this.typeComptage == "non_specifie") {
      comptageType = "";
    } else {
      comptageType = this.typeComptage;
    }

    //On ajoute dans la BDD si toute les validations sont passées
    if(nomValide && typeValide && magasinValide) {
      //TODO : gérer l'auteur
      this.addBDD('comptage', ['idComptage', 'nomMagasin', 'dateDebut', 'nomTypeComptage', 'auteur', 'ouvert', 'nom'], [this.getIdNouveauComptage(), this.magasinComptage, this.getCurrentDate(), comptageType, 'Testeur', 1, this.nomComptage]).then( () => {
        this.goTo('AccueilComptagePage');
      });
    }
  }


  /*---------------------------------------------------------------------------------------------------------------*/
  /*------------Renvoie true si le nom du nouveau comptage est valide (infèrieure à la taille maximale)------------*/
  /*---------------------------------------------------------------------------------------------------------------*/
  nomComptageValide() {
    if(this.nomComptage == undefined) {
      return false;
    } else {
      return (this.nomComptage.length > 0 && this.nomComptage.length <= this.constantes.tailleMaxNomComptage);
    }
  }

  /*---------------------------------------------------------------------------------------------------------------------------------------*/
  /*------------Renvoie true si l'id rentrée pour le type de comptage du nouveau comptage est valide (est présente dans la bdd)------------*/
  /*---------------------------------------------------------------------------------------------------------------------------------------*/
  typeComptageValide() {
    if(this.typeComptage == undefined) {
      return false;
    } else if(this.typeComptage == "non_specifie") {
      return true;
    } else {
      let i = 0;
      while(i < this.bdd.localData['typeComptage'].length && this.bdd.localData['typeComptage'][i].nom != this.typeComptage) {
        i++
      }
      return (i < this.bdd.localData['typeComptage'].length);
    }
  }

  /*------------------------------------------------------------------------------------------------------------------------------*/
  /*------------Renvoie true si l'id rentrée pour le magasin du nouveau comptage est valide (est présente dans la bdd)------------*/
  /*------------------------------------------------------------------------------------------------------------------------------*/
  magasinValide() {
    if(this.magasinComptage == undefined) {
      return false;
    } else if(this.magasinComptage == '') {
      return true;
    } else {
      let i = 0;
      while(i < this.bdd.localData['magasin'].length && this.bdd.localData['magasin'][i].nom != this.magasinComptage) {
        i++
      }
      return (i < this.bdd.localData['magasin'].length);
    }
  }

  /*----------------------------------------------------------------------------------------------------*/
  /*------------Renvoie l'id a attribuer au nouveau comptage (le premier qui est disponible)------------*/
  /*----------------------------------------------------------------------------------------------------*/
  getIdNouveauComptage() {
    //On remplit un tableau initialisé à (-1) avec tout les id présents de manière à ce qu'il l'id i soit à l'indice i du tableau
    let tab: Array<number> = new Array<number>();
    let tailleMax = this.findIdComptageMax(); //La taille maximale du tableau est logiquement l'idComptage la plus élevée de localData['comptage']
    console.log("Taille max : " + tailleMax);
    for(let i = 1 ; i <= tailleMax ; i++) {
      tab[i] = -1;
    }
    for(let i = 0 ; i < this.bdd.localData['comptage'].length ; i++) {
      tab[this.bdd.localData['comptage'][i].idComptage] = this.bdd.localData['comptage'][i].idComptage;
    }

    //Puis on cherche le premier -1 dans le tableau (la première case qui n'est pas été remplie avec la correspondance ci-dessus)
    let i = 1;
    while(i <= tailleMax && tab[i] != -1) {
      console.log('Tab[' + i + '] = ' + tab[i]);
      i++
    }

    return i;
  }

  findIdComptageMax() {
    let idMax = -1;

    for(let i = 0 ; i < this.bdd.localData['comptage'].length ; i++) {
      if(this.bdd.localData['comptage'][i].idComptage > idMax) {
        idMax = this.bdd.localData['comptage'][i].idComptage;
      }
    }
    return idMax;
  }





















  /*------------------------------------------------------------------------*/
  /*------------Renvoie a date actuelle sous la forme YYYY-MM-DD------------*/
  /*------------------------------------------------------------------------*/
  getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = (today.getFullYear()).toString();

    var new_dd;
    if(dd < 10) { //Pour l'affichage
      new_dd = '0' + dd.toString();
    } else {
      new_dd = dd.toString();
    }

    var new_mm;
    if(mm < 10) { //Pour l'affichage
      new_mm = '0' + mm.toString();
    } else {
      new_mm = mm.toString();
    }

    return (yyyy + '-' + new_mm + '-' + new_dd);
  }

}
