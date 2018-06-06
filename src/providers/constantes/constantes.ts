import { Injectable } from '@angular/core';

/*
  Generated class for the ConstantesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConstantesProvider {

	/* Placer ici toute les constantes de l'application */

	//Taille maximale des noms des comptage
	public tailleMaxNomComptage: number;

  //Taille maximale des noms des articles
  public tailleMaxNomArticle: number;

	//Taille maximale des codes-barres
  public tailleMaxCodeBarre: number;

  //Taille maximale des noms de magasins
  public tailleMaxNomMagasin: number;

 	constructor() {
    	this.tailleMaxNomComptage = 50;
      this.tailleMaxNomArticle = 200;
    	this.tailleMaxCodeBarre = 60;
      this.tailleMaxNomMagasin = 200;
 	}

}
