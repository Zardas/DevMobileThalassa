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
	public tailleMaxNom: number;

	//Taille maximale des codes-barres
  	public tailleCodeBarre: number;

 	constructor() {
    	console.log('Hello ConstantesProvider Provider');
    	this.tailleMaxNom = 50;
    	this.tailleCodeBarre = 60
 	}

}
