import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ConstantesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConstantesProvider {

	/* Placer ici toute les constantes de l'application */
	public taille: number;

 	constructor(public http: HttpClient) {
    	console.log('Hello ConstantesProvider Provider');
    	this.taille = 23;
 	}

}
