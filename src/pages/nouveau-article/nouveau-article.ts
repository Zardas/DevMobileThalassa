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

  //Prix en euro du nouvel article
  public prixEuro;

  //Prix en centime du nouvel article
  public prixCentime;

  //Stock du nouvel article
  public stock;

  constructor(
  	public navCtrl: NavController,
  	public navParams: NavParams,
  	public nav: Nav
  ) {

  	super(navCtrl, navParams, nav);

  	this.parametragePagesAccessibles(
      ['ListeArticlePage'],
      [ListeArticlePage]
    );
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
  /*-----------------------------------------
   * Retourne le stock actuellement rentré
   * Utilisé pour afficher en direct le stock
   *---------------------------------------*/
  getStock() {
    if(this.stock == undefined || this.stock == '') {
      return 0;
    } else {
      return this.stock;
    }
  }



















  /*--------------------------------------------------------------*/
  /*------------Fonctions liées à l'ajout d'un article------------*/
  /*--------------------------------------------------------------*/
  /*--------------------------------------------------------------------------------------*/
  /*------------Ajoute un article dans la base grâce aux informations rentrées------------*/
  /*--------------------------------------------------------------------------------------*/
  enregistrerArticle() {
    console.log('Nom article : ' + this.nomArticle);
    console.log('Codebarre article : ' + this.codeBarre);
    console.log('prixEuro : ' + this.prixEuro);
    console.log('PrixCentime : ' + this.prixCentime);
    console.log('Stock' + this.stock);

    let nomValide = this.nomArticleValide();
    let codebarreValide = this.codebarreArticleValide();
    let prixeuroValide = this.prixeuroArticleValide();
    let prixcentimeValide = this.prixcentimeArticleValide();
    let stockValide = this.stockArticleValide();

    console.log("Nom : " + nomValide);
    console.log("Codebarre : " + codebarreValide);
    console.log("prixEuro : " + prixeuroValide);
    console.log("prixCentime : " + prixcentimeValide);
    console.log("stockValide : " + stockValide);

    //Affichage message d'erreur si le nom est invalide (trop long)
    let invalidMessage_nom = document.getElementById("invalidMessage_nom") as HTMLElement;
    if(!nomValide) {
      invalidMessage_nom.innerHTML = "Vous devez rentrer un nom valide";
    } else {
      invalidMessage_nom.innerHTML = "";
    }

    //Affichage message d'erreur si le codeBarre est invalide (trop long ou trop court)
    let invalidMessage_codeBarre = document.getElementById("invalidMessage_codeBarre") as HTMLElement;
    if(!codebarreValide) {
      invalidMessage_codeBarre.innerHTML = "Vous devez rentrer un codeBarre valide";
    } else {
      invalidMessage_codeBarre.innerHTML = "";
    }

    //Affichage message d'erreur si le prixEuro est invalide (?)
    let invalidMessage_prixEuro = document.getElementById("invalidMessage_prixEuro") as HTMLElement;
    if(!prixeuroValide) {
      invalidMessage_prixEuro.innerHTML = "Vous devez rentrer un prix en euros valide";
    } else {
      invalidMessage_prixEuro.innerHTML = "";
    }

    //Affichage message d'erreur si le prixCentime est invalide (?)
    let invalidMessage_prixCentime = document.getElementById("invalidMessage_prixCentime") as HTMLElement;
    if(!prixcentimeValide) {
      invalidMessage_prixCentime.innerHTML = "Vous devez rentrer un prix en centimes valide";
    } else {
      invalidMessage_prixCentime.innerHTML = "";
    }

    //Affichage message d'erreur si le prixEuro est invalide (?)
    let invalidMessage_stock = document.getElementById("invalidMessage_stock") as HTMLElement;
    if(!stockValide) {
      invalidMessage_stock.innerHTML = "Vous devez rentrer un stock valide";
    } else {
      invalidMessage_stock.innerHTML = "";
    }


    //On ajoute dans la BDD si toute les validations sont passées
    if(nomValide && codebarreValide && prixeuroValide && prixcentimeValide && stockValide) {
      let prixTotal = parseInt(this.prixEuro) + (parseInt(this.prixCentime)/100);

      this.addBDD('article', ['codeBarre', 'designation', 'prix', 'stock'], [this.codeBarre, this.nomArticle, prixTotal, this.stock]).then( () => {
        this.goTo('ListeArticlePage');
      });
    }
  }

  /*-------------------------------------------------------------------------------------------------------------*/
  /*------------Renvoie true si le nom du nouvel article est valide (infèrieure à la taille maximale)------------*/
  /*-------------------------------------------------------------------------------------------------------------*/
  nomArticleValide() {
    if(this.nomArticle != undefined) {
      return (this.nomArticle.length > 0 && this.nomArticle.length <= this.constantes.tailleMaxNomArticle);
    } else {
      return false;
    }
  }
  /*-------------------------------------------------------------------------------------------------------------------*/
  /*------------Renvoie true si le codebarre du nouvel article est valide (infèrieure à la taille maximale)------------*/
  /*-------------------------------------------------------------------------------------------------------------------*/
  codebarreArticleValide() {
    if(this.codeBarre != undefined) {
      return (this.codeBarre.length > 0 && this.codeBarre.length <= this.constantes.tailleMaxCodeBarre);
    } else {
      return false;
    }
  }
  /*------------------------------------------------------------------------------------------------*/
  /*------------Renvoie true si le prix en euros du nouvel article est valide (existant)------------*/
  /*------------------------------------------------------------------------------------------------*/
  prixeuroArticleValide() {
    if(this.prixEuro != undefined) {
      return true;
    } else {
      return false;
    }
  }
  /*--------------------------------------------------------------------------------------------------------------------------*/
  /*------------Renvoie true si le prix en centimes du nouvel article est valide (infèrieure à la taille maximale)------------*/
  /*--------------------------------------------------------------------------------------------------------------------------*/
  prixcentimeArticleValide() {
    if(this.prixCentime != undefined) {
      return (this.prixCentime.length > 0 && this.prixCentime.length <= 2);
    } else {
      return false;
    }
  }
  /*----------------------------------------------------------------------------------------*/
  /*------------Renvoie true si le stock du nouvel article est valide (existant)------------*/
  /*----------------------------------------------------------------------------------------*/
  stockArticleValide() {
    if(this.stock != undefined) {
      return true;
    } else {
      return false;
    }
  }



  
}
