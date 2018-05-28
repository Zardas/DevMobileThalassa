import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController } from 'ionic-angular';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { DatabaseUtilisation } from '../../providers/databaseProvider/databaseProviderUtilisation';

import { AccueilComptagePage } from '../accueil-comptage/accueil-comptage';
import { ParametresComptagePage } from '../parametres-comptage/parametres-comptage';
/**
 * Generated class for the InventaireComptagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/* 
  Si jamais window et document ne sont pas reconnus
  const win: any = window;
  const doc: any = document;
*/


@IonicPage()
@Component({
  selector: 'page-inventaire-comptage',
  templateUrl: 'inventaire-comptage.html',
})

export class InventaireComptagePage {

  //Liste des pages accessibles, utiliser pour les fonctions de navigation afin d'éviter que l'on puisse aller n'importe où
  private pagesAccessibles: Map<String, any>;

  //Provider possédant à la fois la base de donnée et la hash-map localData
  public bdd: DatabaseUtilisation;

  //Le comptage
  public comptage;  

  //Taille des coes-barres
  public tailleCodeBarre: number;

  //La liste des scans correspondants au comptage
  public scans: Array<any>;

  //La liste des scans correspondants au comptage ET correspondant à la string recherchée
  public scans_searched: Array<any>;

  //Indique si la searchbar est ouverte ou fermée
  public isSearchbarOpened = false;

  //Options pour le scanner
  private BarcodeOptions = {
    //Afficher le bouton pour changer l'orientation de la caméra
    showFlipCameraButton: true,
    //Affiche le bouton allumant la lumière de la caméra
    showTorchButton: true,
    //Temps où le résultat est affiché (0 ne l'affiche pas)
    resultDisplayDuration: 0,
    //Texte afficher en bas de la fenêtre de scan et donnant des instructions à l'utilisateur
    prompt: "Placer le code-barre au niveau du trait rouge (et entièrement dans la zone de scan)"
  };


  /*------------------------------------*/
  /*------------Constructeur------------*/
  /*------------------------------------*/
  constructor(
    public navCtrl: NavController,         //Pile de pages
    public navParams: NavParams,           //Paramètres de navigation
    public nav: Nav,                       //Gestionnaire de navigation
    private toastCtrl: ToastController,    //Contrôleur des toast (les petits popup)
    private barcodeScanner: BarcodeScanner //Scanner des code-barrres
  ) {

    this.tailleCodeBarre = 13;

    this.parametragePagesAccessibles();

    //On récupère la base de données
    if(navParams.get('database') == undefined) {
      this.refreshBDD();
    } else {
      this.bdd = navParams.get('database');
    }

    //On récupère le comptage
    if(navParams.get('comptage') == undefined) {
      this.comptage = new Array<any>();
      this.comptage.idComptage = -1;
    } else {
      this.comptage = navParams.get('comptage');
    }

    this.getScansCorrespondant('null');
  }

  /*---------------------------------------------------------------------*/
  /*------------Fonction de paramétrage des pages accessibles------------*/
  /*---------------------------------------------------------------------*/
  parametragePagesAccessibles() {
    this.pagesAccessibles = new Map<String, any>();
    this.pagesAccessibles['AccueilComptagePage'] = AccueilComptagePage;
    this.pagesAccessibles['ParametresComptagePage'] = ParametresComptagePage;
  }


  ionViewDidLoad() {
    console.log('InventaireComptage didLoad()');
  }


  /*-----------------------------------------------*/
  /*------------Fonctions de navigation------------*/
  /*-----------------------------------------------*/
  /*open = on met la page désirée sur le devant de la scène
  Mais la page précédente (this quoi) serra toujours derrière
  */
  open(page) {
  	this.navCtrl.push(this.pagesAccessibles[page]);
  }
  /*goTo = mettre en racine la page désirée -> différent de open
  */
  goTo(page) {
    this.nav.setRoot(this.pagesAccessibles[page], {database: this.bdd});
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


  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  /*------------Créer la liste de tout les scans correspondant au comptage this et possédant searched dans leur nom, en parcourant la liste de tout les scans------------*/
  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  getScansCorrespondant(searched) {
    console.log("Search");
    this.scans = new Array<any>();
    this.scans_searched = new Array<any>();

    //On remplit le tableau scans
    for(let i = 0 ; i < this.bdd.localData['scan'].length ; i++) {
      if(this.bdd.localData['scan'][i].idComptage == this.comptage.idComptage) {
        this.scans.push(this.bdd.localData['scan'][i]);
      }
    }
    
    //on remplit le tableau scans_searched
    if(searched != 'null' && searched != '') {
      let re = new RegExp(searched.target.value, "i");
      for(let i = 0 ; i < this.scans.length ; i++) {
        if((this.scans[i].designation).search(re) != -1) {
          console.log('Flag 1 : ' + searched.target.value);
          this.scans_searched.push(this.scans[i]);
        }
      }
    } else {
      this.scans_searched = this.scans;
    }
  }

  /*------------------------------------------------------------------------------------------------------------------------------
   * Return "close" si la barre de recherche est ouvert et "search" sinon
   * Utilisé pour trouver quelle icône afficher à droite (loupe ou croix) en fonction de l'état de la searchbar (fermée ou ouverte)
   *-----------------------------------------------------------------------------------------------------------------------------*/
  getNameIcon() {
    if(this.isSearchbarOpened) {
      return "close";
    } else {
      return "search";
    }
  }


  /*---------------------------------*/
  /*---Fonctions relatives au scan---*/
  /*---------------------------------*/
  /*-----------------------*/
  /*---Fonctions de scan---*/
  /*-----------------------*/
  scanBarcode() {
    //On appel la fonction scan sur le barcodeScanner
    this.barcodeScanner.scan(this.BarcodeOptions)
      .then( barcodeData => {
        //On affiche un message de succès (optionnel)
        this.presentToast("We got a barcode\n" +
                          "Result : " + barcodeData.text + "\n" +
                          "Format : " + barcodeData.format + "\n" +
                          "Cancelled : " + barcodeData.cancelled);
        //On ajoute le code-barre scanné en local et dans la BDD
        this.scanArticle(barcodeData.text);
      })
      .catch( err => {
        this.presentToast('Erreur avec le scan : ' + err);
      })
    ;
  }

  /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  /*---Ajoute l'article avec l'id inscrit dans l'input associé à code-barre dans le tableau (s'il n'existe pas déjà), ou incrément sa valeur nb de 1 s'il existe déjà---*/
  /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  scanArticle(article: string) {

    //let article = (document.getElementById("inputScan") as HTMLInputElement).value;
    
    if(this.checkFormatArticle(article)) {

      //On vérifie si article est présent dans la liste des articles
      /*let i = 0;
      console.log("Taille locale : " + this.localData['article'].length);
      while(i < this.localData['article'].length && String(this.localData['article'][i].id) != article) {
        i++;
      }

      if(i < this.localData['article'].length) {
        //Cas UPDATE : l'article est déjà présent : on incrémente sa quantité 1
        console.log('Déjà présent');
        this.update('article', ['nb'], [parseInt(this.localData['article'][i].nb) + 1], "id = " + article);
      } else {
        //Cas ADD : l'article n'est pas présent, on l'add avec une quantité de 1
        console.log('Pas déjà présent');
        this.addBDD('article', ['id', 'prix', 'nb'], [parseInt(article), 5, 1]);
      }*/

    } else {
      console.log("Aucun article scanné");
    }
  }

  /*-----------------------------------------------------------------*/
  /*---Vérifie si l'article scanné est au bon format (13 chiffres)---*/
  /*-----------------------------------------------------------------*/
  checkFormatArticle(toCheck: any) {
    return (toCheck.length == this.tailleCodeBarre);
  }

  /*-----------------------------------------------------------------------*/
  /*---Fonction perso pour vérifier si "elem" est présent dans "tableau"---*/
  /*-----------------------------------------------------------------------*/
  contains(tableau: Array<any>, elem: any) {
    let j = 0;
    while(tableau[j] != elem && j < tableau.length) {
      j++;
    }
    return (j < tableau.length);
  }

  /*-----------------------------------------------------------------------------------------*/
  /*---Fonction de push perso ne pushant pas si l'élément est déjà présent dans le tableau---*/
  /*-----------------------------------------------------------------------------------------*/
  pushPerso(tableau: Array<any>, elem: any) {
    console.log(this.contains(tableau, elem));
    if(this.contains(tableau, elem) == false) {
      console.log('a');
      tableau.push(elem);
    }
  }




  /*------------------------------------------*/
  /*------------Fonctions diverses------------*/
  /*------------------------------------------*/
  /*--------------------------------------------------------------*/
  /*------------Affichage d'un toast en bas de l'écran------------*/
  /*--------------------------------------------------------------*/
  presentToast(textToDisplay) {
    let toast = this.toastCtrl.create({
      message: textToDisplay,
      duration: 4000,
      position: 'bottom',
      showCloseButton: true
    });

    toast.onDidDismiss( () => {
      console.log('Toast Dismissed');
    });

    toast.present();
  }



}

