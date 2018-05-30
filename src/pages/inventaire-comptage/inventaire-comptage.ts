import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController, AlertController } from 'ionic-angular';

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

  //La liste des scans correspondants au comptage ET correspondant à la string recherchée
  public scans_searched: Array<any>;

  //Indique si la searchbar est ouverte ou fermée
  public isSearchbarOpened = false;

  //True = on affiche tout les scans / False : on regroupe les scans par codeBarre
  public item_par_item = true;

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
    private barcodeScanner: BarcodeScanner, //Scanner des code-barrres
    private alertCtrl: AlertController //Permet d'afficher des alertes (pour le nom et la quantité des articles scanné)
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

    this.getScansCorrespondant('');
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
  goToParam() {
    this.nav.setRoot(ParametresComptagePage, {database: this.bdd, comptage: this.comptage});
  }
  
  /*----------------------------------------------------------------------------------*/
  /*------------Créer une nouvelle base de données (avec les bonnes tables------------*/
  /*----------------------------------------------------------------------------------*/
  refreshBDD() {
    this.bdd = new DatabaseUtilisation();
  }


  addBDD(table: string, champs: Array<any>, values: Array<any>) {
    return this.bdd.addBDD(table, champs, values);
  }


  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  /*------------Créer la liste de tout les scans correspondant au comptage this et possédant searched dans leur nom, en parcourant la liste de tout les scans------------*/
  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  getScansCorrespondant(searched) {
    console.log("Search");
    //Scans = array contenant tout les scans correspondant au comptage en cours
    let scans = new Array<any>();
    this.scans_searched = new Array<any>();

    //On remplit le tableau scans
    for(let i = 0 ; i < this.bdd.localData['scan'].length ; i++) {
      if(this.bdd.localData['scan'][i].idComptage == this.comptage.idComptage) {
        scans.push(this.bdd.localData['scan'][i]);
      }
    }
    //on remplit le tableau scans_searched
    if(searched != '') {
      let re = new RegExp(searched.target.value, "i");
      for(let i = 0 ; i < scans.length ; i++) {
        if((scans[i].designation).search(re) != -1) {
          this.scans_searched.push(scans[i]);
        }
      }
      //Si on est en mode item_regroupé, il faut encore regouper les items (logique...)
      if(!this.item_par_item) {
        this.scans_searched = this.regroupeItem(this.scans_searched);
      }
    } else {
      this.scans_searched = scans;
    }
  }

  /*-----------------------------------------------------------------------------------------------------------------------*/
  /*------------Renvoie un tableau comprenant les scan passés en paramètres, mais regroupés selon le code-barre------------*/
  /*-----------------------------------------------------------------------------------------------------------------------*/
  regroupeItem(toRegroupe: Array<any>) {
    let item_regroupes = new Array<any>();
    let codeBarreChecked = new Array<any>(); //Indique les codes-barres qui ont déjà été gérés

    for(let i = 0 ; i < toRegroupe.length ; i++) {
      if(codeBarreChecked.indexOf(toRegroupe[i].codeBarre) == -1) { //Si le code-barre n'a pas encore été check
        let quantite = 0;
        for(let j = i ; j < toRegroupe.length ; j++) { //On parcours les autres tuples disponibles
          if(toRegroupe[j].codeBarre == toRegroupe[i].codeBarre) { //Et si le code-barre correspond
            quantite = quantite + toRegroupe[j].quantite; //On incrémente la quantite
          }
        }
        item_regroupes.push({dateScan: toRegroupe[i].dateScan, //Après avoir parcourues tout les tuples restants, on ajoute un tuple avec la quantite somme dans le nouvel array
                             codeBarre: toRegroupe[i].codeBarre,
                             designation: toRegroupe[i].designation,
                             idComptage: toRegroupe[i].idComptage,
                             quantite: quantite,
                             auteur: toRegroupe[i].auteur,
                             prixEtiquette: toRegroupe[i].prixEtiquette,
                             prixBase: toRegroupe[i].prixBase,
                             stockBase: toRegroupe[i].stockBase
                             });
        codeBarreChecked.push(toRegroupe[i].codeBarre); //Et on fait en sorte de ne plus recheck ce code-barre
      }
    }
    return item_regroupes;
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

  /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  /*------------Indique si c'est le codeBarre ou la désignation qui doit être affiché en texte principal (si la designation est '', c'est le codeBarre qui est principal, sinon, c'est la désignation)------------*/
  /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  getPrimaryText(scan) {
    if(scan.designation == "") {
      return scan.codeBarre;
    } else {
      return scan.designation;
    }
  }
  getSecondaryText(scan) {
    if(scan.designation == "") {
      return scan.designation;
    } else {
      return scan.codeBarre;
    }
  }


  /*---------------------------------------------*/
  /*---Fonctions relatives au mode d'affichage---*/
  /*---------------------------------------------*/
  /*--------------------------------------------*/
  /*---Indique le nom à afficher pour le scan---*/
  /*--------------------------------------------*/
  getNomMode() {
    if(this.item_par_item) {
      return "Scans individuels";
    } else {
      return "Scans regroupés";
    }
  }
  /*--------------------------------*/
  /*---Change le mode d'affichage---*/
  /*--------------------------------*/
  changeMode() {
    this.item_par_item = !this.item_par_item;

    if(this.item_par_item) {
      this.getScansCorrespondant('');
    } else {
      this.scans_searched = this.regroupeItem(this.scans_searched);
    }
  }































  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  /*---Fonctions relatives au scan (Appel de scanBarcode qui appel presentAlertNewScan qui appel gestionParametresScan qui appel ajoutScan qui ajoute l'élément)---*/
  /*---------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  /*-----------------------*/
  /*---Fonctions de scan---*/
  /*-----------------------*/
  scanBarcode() {
    //On appel la fonction scan sur le barcodeScanner
    this.barcodeScanner.scan(this.BarcodeOptions)
      .then( barcodeData => {
        //On affiche un message de succès (optionnel)
        //this.presentToast("Article n°" + barcodeData.text + " scanné");
        //On ajoute le code-barre scanné en local et dans la BDD
        //this.ajoutScan(barcodeData.text);
        
        let indice = this.findIndiceCorrespondant(barcodeData.text);

        let nomDefaut = "";
        let prixEuro = undefined;
        let prixCentime = undefined;
        let prixBase = undefined;
        let stockBase = undefined;

        if(indice != -1) { //Si l'article scanné est déjà repertorié dans la bdd
          nomDefaut = this.bdd.localData['article'][indice].designation;
          stockBase = this.bdd.localData['article'][indice].stock;
          let prix = this.getPrix(this.bdd.localData['article'][indice].prix);
          prixEuro = prix.euros;
          prixCentime = prix.centimes;
          prixBase = prixEuro + (prixCentime/100);
        }

        this.presentAlertNewScan(barcodeData.text, nomDefaut, prixEuro, prixCentime, prixBase, stockBase);
      })
      .catch( err => {
        this.presentToast('Erreur avec le scan : ' + err);
      })
    ;
  }

  /*---------------------------------------------------------------------------------------------------------*/
  /*---Affiche une alerte pour que l'utilisateur puisse rentrer la quantité correspondant au scan effectué---*/
  /*---------------------------------------------------------------------------------------------------------*/
  presentAlertNewScan(codeBarre: string, nomDefaut: string, prixEuroDefaut, prixCentimeDefaut, prixBase, stockBase) {

    let placeholderNom: string;
    if(nomDefaut == "") {
      placeholderNom = "Nom";
    } else {
      placeholderNom = nomDefaut;
    }

    let placeholderQuantite: string;
    placeholderQuantite = "Quantite";

    let placeholderPrixEuro: string;
    if(prixEuroDefaut == undefined) {
      placeholderPrixEuro = "00 euros";
    } else {
      placeholderPrixEuro = prixEuroDefaut + " euros";
    }

    let placeholderPrixCentime: string;
    if(prixCentimeDefaut == undefined) {
      placeholderPrixCentime = "00 centimes";
    } else {
      placeholderPrixCentime = prixCentimeDefaut + " centimes";
    }
    
    let alert = this.alertCtrl.create({
      title: 'Ajout d\'un scan',
      subTitle: 'Ne rien mettre dans les champs pour les valeurs par défaut',
      inputs: [
        {
          name: 'name',
          placeholder: placeholderNom,
          type: "text",
          label: "Nom"
        },
        {
          name: 'quantite',
          placeholder: placeholderQuantite,
          type: "number"
        },
        {
          name: 'prixEuro',
          placeholder: placeholderPrixEuro,
          type: "number"
        },
        {
          name: "prixCentime",
          placeholder: placeholderPrixCentime,
          type: "number"
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: data => {
            this.presentToast('Scan annulé');
          }
        },
        {
          text: 'Ajouter',
          handler: data => {
            this.gestionParametresScan(codeBarre, data, nomDefaut, prixEuroDefaut, prixCentimeDefaut, prixBase, stockBase);
          }
        }
      ]
    });
    alert.present();
  }


  /*--------------------------------------------------------------------------------------------------------------------------*/
  /*---Calcul les paramètres à envoyé à la fonction d'ajout du scan dans la base à partir des données rentrée dans l'alerte---*/
  /*--------------------------------------------------------------------------------------------------------------------------*/
  gestionParametresScan(codeBarre: string, data, nomDefaut, prixEuroDefaut, prixCentimeDefaut, prixBase, stockBase) {
    let quantite_number = new Number(data.quantite);
    let prixEuro_number;
    let prixCentime_number;
    
    //Valeurs par défaut
    //Pour la quantité
    if(quantite_number == 0) {
      quantite_number = 1;
    }
    //Pour le nom
    if(data.name == "") {
      data.name = nomDefaut; //Si il y a un nom par défaut, il ne faut pas que l'utilisateur ait à le réindiquer
    }
    //Pour le prix (euros)
    if(data.prixEuro == "") {
      if(prixEuroDefaut != undefined) {
        prixEuro_number = prixEuroDefaut;
      } else {
        prixEuro_number = 0;
      }
    } else {
      prixEuro_number = parseInt(data.prixEuro);
    }
    //Pour le prix (centime)
    if(data.prixCentime == "") {
      if(prixCentimeDefaut != undefined) {
        prixCentime_number = prixCentimeDefaut;
      } else {
        prixCentime_number = 0;
      }
    } else {
      prixCentime_number = parseInt(data.prixCentime);
    }
    
    let prix_number = prixEuro_number + (prixCentime_number/100);
    this.ajoutScan(codeBarre, (quantite_number as number), data.name, prix_number, prixBase, stockBase);
  }


  /*--------------------------------------------------------------------------------------------------------------------*/
  /*---Ajoute le scan dans la BDD et recharge la liste des scans avec une recherche vide (tout les scans du comptage)---*/
  /*--------------------------------------------------------------------------------------------------------------------*/
  ajoutScan(codeBarre: string, quantite: number, name: string, prix: number, prixBase, stockBase) {
    //if(this.checkFormatArticle(scan)) {
      let currentDate = this.getCurrentDate();
      this.addBDD("scan", ["dateScan", "codeBarre", "designation", "idComptage", "quantite", "auteur", "prixEtiquette", "prixBase", "stockBase"], [currentDate, codeBarre, name, this.comptage.idComptage, quantite, "auteureeee", prix, prixBase, stockBase]).then( () => {
        this.scans_searched.push({dateScan: currentDate,
                                  codeBarre: codeBarre,
                                  designation: name,
                                  idComptage: this.comptage.idComptage,
                                  quantite: quantite,
                                  auteur: "auteureeee",
                                  prixEtiquette: prix,
                                  prixBase: prixBase,
                                  stockBase: stockBase
                                  });
        if(!this.item_par_item) {
          this.scans_searched = this.regroupeItem(this.scans_searched);
        }
        //this.getScansCorrespondant('');
      });
    /*} else {
      console.log("Le code-barre scanné est invalide");
    }*/
  }

  /*------------------------------------------------------------------------------------------------------------------------------------------*/
  /*---Retourne l'indice correpsondant au codeBarre "codeBarre" dans la table Article de la hash-map (-1 si le codeBarre n'est pas présent)---*/
  /*------------------------------------------------------------------------------------------------------------------------------------------*/
  findIndiceCorrespondant(codeBarre: string) {
    let i = 0;
    while(i < this.bdd.localData['article'].length && this.bdd.localData['article'][i].codeBarre != codeBarre) {
      i++;
    }
    if(i < this.bdd.localData['article'].length) {
      return i;
    } else {
      return -1;
    }
  }

  /*-----------------------------------------------------------------*/
  /*---Vérifie si l'article scanné est au bon format (13 chiffres)---*/
  /*-----------------------------------------------------------------*/
  checkFormatArticle(toCheck: any) {
    return (toCheck.length == this.tailleCodeBarre);
  }

  
  /*----------------------------------------------------------------------------------------------------------------------*/
  /*---Renvoie le prix correspondant à prix. On peut aisément y récupéré la quantité d'euros et la quantité de centimes---*/
  /*----------------------------------------------------------------------------------------------------------------------*/
  getPrix(prix: number) {
    let centime = this.getCentime(prix);
    return {euros: prix-(centime/100), centimes: centime};
  }

  /*-------------------------------------------------------------*/
  /*---Renvoie le nombre de centime du prix passé en paramètre---*/
  /*-------------------------------------------------------------*/
  getCentime(prix: number) {
    return ((prix%1)*100);
  }


  /*------------------------------------------------------------------------------------------*/
  /*------------Renvoie a date actuelle sous la forme YYYY-MM-DD-HHhMMmSSsMSMSMSms------------*/
  /*------------------------------------------------------------------------------------------*/
  getCurrentDate() {
    var today = new Date();
    var msmsms = today.getMilliseconds();
    var ss = today.getSeconds();
    var mimi = today.getMinutes();
    var hh = today.getHours();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = (today.getFullYear()).toString();

    var new_msmsms;
    if(msmsms < 100) { //Pour l'affichage
      new_msmsms = '0' + msmsms.toString();
      if(msmsms < 10) {
        new_msmsms = '0' + new_msmsms;
      }
    } else {
      new_msmsms = msmsms.toString();
    }

    var new_ss;
    if(ss < 10) { //Pour l'affichage
      new_ss = '0' + ss.toString();
    } else {
      new_ss = ss.toString();
    }

    var new_mimi;
    if(mimi < 10) { //Pour l'affichage
      new_mimi = '0' + mimi.toString();
    } else {
      new_mimi = mimi.toString();
    }

    var new_hh;
    if(hh < 10) { //Pour l'affichage
      new_hh = '0' + hh.toString();
    } else {
      new_hh = hh.toString();
    }

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

    return (yyyy + '-' + new_mm + '-' + new_dd + '-' + new_hh + "h" + new_mimi + "m" + new_ss + "s" + new_msmsms + "ms");
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
      duration: 8000,
      position: 'top',
      showCloseButton: true
    });

    toast.onDidDismiss( () => {
      console.log('Toast Dismissed');
    });

    toast.present();
  }



}

