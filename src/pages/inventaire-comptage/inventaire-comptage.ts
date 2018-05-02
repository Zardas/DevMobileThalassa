import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav, ToastController } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CameraPreview, CameraPreviewPictureOptions, CameraPreviewOptions, CameraPreviewDimensions } from '@ionic-native/camera-preview';
import { Database } from '../databaseProvider/databaseProvider';

import { HomePage } from '../home/home';
/**
 * Generated class for the InventaireComptagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/* Si jamais window et document ne sont pas reconnus
const win: any = window;
const doc: any = document;
*/

var users: Array<user> = [];
var articles: Array<article> = [];

interface champ {
  nom: string;
  type: string;
  primaryKey: boolean;
}

interface table {
  nom: string;
  champs: Array<champ>;
}

interface user {
  username: string;
  password: string;
}
interface article {
  id: number;
  nb: number;
  prix: number;
}

@IonicPage()
@Component({
  selector: 'page-inventaire-comptage',
  templateUrl: 'inventaire-comptage.html',
})

export class InventaireComptagePage {

  private pagesAccessibles: Map<String, any>;
  private database: Database;

  public usersLocal: Array<user>;
  public articlesLocal: Array<article>;

  
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams, public nav: Nav,
    private toastCtrl: ToastController,
    private camera: Camera,
    private cameraPreview: CameraPreview
  ) {

    //Initilisation des tableaux d'élements locaux à vide
    this.usersLocal = [];
    this.articlesLocal = [];


    this.pagesAccessibles = new Map<String, any>();
    this.pagesAccessibles['HomePage'] = HomePage;

    let tables: Array<table> = [];

    /* Création de l'array de configuration des tables */
    let champsTableUser: Array<champ> = [];
    champsTableUser.push({nom: 'username', type: 'VARCHAR(255)', primaryKey: true});
    champsTableUser.push({nom: 'password', type: 'VARCHAR(255)', primaryKey: false});

    let champsTableArticle: Array<champ> = [];
    champsTableArticle.push({nom: 'id', type: 'VARCHAR(255)', primaryKey: true});
    champsTableArticle.push({nom: 'nb', type: 'VARCHAR(255)', primaryKey: false});
    champsTableArticle.push({nom: 'prix', type: 'VARCHAR(255)', primaryKey: false});

    tables.push({nom: 'user', champs: champsTableUser});
    tables.push({nom: 'article', champs: champsTableArticle});

    this.creationBDD(tables);

    this.startCameraPreview();
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
    this.nav.setRoot(this.pagesAccessibles[page]);
  }


  //Affichage d'un toast en bas de l'écran
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


  /*-------------------------------------------------------*/
  /*------------Partie gestion du plugin Camera------------*/
  /*-------------------------------------------------------*/

  myphoto: any;
  public showOrHide: string = "Cacher";

  affCamera() {
    console.log(this.camera);
  }

  takePicture() {
    const options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.myphoto = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      // Handle error
    });

  }

  showOrHideImage() {
    let imageTaken = (document.getElementById("imgTaken") as HTMLInputElement);
    if(this.showOrHide == "Cacher") {
      this.showOrHide = "Afficher";
      imageTaken.style.display = "none";
    } else {
      this.showOrHide = "Cacher";
      imageTaken.style.display = "block";
    }
  }



  displayImage(imgUri) {
    var elem = (document.getElementById('imageFile') as HTMLInputElement);
    elem.src = imgUri;
  }


  /*--------------------------------------------------------------*/
  /*------------Partie gestion du plugin CameraPreview------------*/
  /*--------------------------------------------------------------*/

  private cameraOn: boolean = false;

  startCameraPreview() {
    let options = {
      x: 0,
      y: 50,
      width: window.screen.width,
      height: window.screen.height-50,
      camera: this.cameraPreview.CAMERA_DIRECTION.BACK,
      toBack: true,
      tapPhoto: true,
      tapFocus: false,
      previewDrag: false
    };

    this.cameraOn = true;
    this.cameraPreview.startCamera(options);
  }

  stopCameraPreview() {
    this.cameraPreview.stopCamera();
    this.cameraOn = false
  }

  /*----------------------------------------------------------------------------*/
  /*---Active la preview si elle n'est pas activée et scanne un article sinon---*/
  /*----------------------------------------------------------------------------*/
  startOrScan() {
    if(this.cameraOn == true) {
      this.scanArticle();
    } else {
      this.startCameraPreview();
    }
  }

  /*--------------------------------------------------------------------------------------------------*/
  /*---Eteinds puis rallume la cameraPreview (utile pour le chagement d'orientation qui bug un max----*/
  /*--------------------------------------------------------------------------------------------------*/
  refresh(){
    this.stopCameraPreview();
    this.startCameraPreview();
  }

  /*---------------------------------------------------------*/
  /*------------Partie gestion de BDD avec SQLite------------*/
  /*---------------------------------------------------------*/
  /*------------------*/
  /*---Création BDD---*/
  /*------------------*/
  creationBDD(tables: Array<table>) {
      this.database = new Database(new SQLite(), tables);
  }



  /*--------------------------------------------*/
  /*---Ajout d'un tuple dans la table "table"---*/
  /*--------------------------------------------*/
  addBDD(table: string, champs: Array<string>, values: Array<any>) {
    this.database.add(table, champs, values);
    this.synchronise(table);
  }

  /*--------------------------------------------*/
  /*---Update d'un tuple dans la table "table"---*/
  /*--------------------------------------------*/
  update(table: string, champs: Array<string>, values: Array<any>, where: string) {
    this.database.update(table, champs, values, where);
    this.synchronise(table);
  }

  /*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
  /*---Met à jour le contenu de la variable globale relative à "table" et de la variable locale qui lui est associée avec le retour de SELECT * FROM "table"---*/
  /*-----------------------------------------------------------------------------------------------------------------------------------------------------------*/
  synchronise(table: string) {
    switch(table) {
      case 'user': {
        this.synchroniseUser();
        break;
      }
      case 'article': {
        this.synchroniseArticle();
        break;
      }
    }
  }

  /*--------------------------------------------------------------------------------------------------------------------------*/
  /*---Met à jour le contenu de la variable globale users et de la variable usersLocal avec le retour de SELECT * FROM user---*/
  /*--------------------------------------------------------------------------------------------------------------------------*/
  synchroniseUser() {
    users = [];
    //this.database.getData('user', function (res) {}).then(function(res) {
      this.database.getData('user').then(function(res) {
      //Ici, on ne peut accéder à rien qui appartiennent à la classe InventaireComptagePage
      //C'est pour cela que l'on doit utiliser une variable globale
      for(let i = 0 ; i < res.length ; i++) {
        users.push({username: res[i].username, password: res[i].password});
      }
    });

    this.usersLocal = users;
  }

  /*-----------------------------------------------------------------------------------------------------------------------------------*/
  /*---Met à jour le contenu de la variable globale articles et de la variable articlesLocal avec le retour de SELECT * FROM article---*/
  /*-----------------------------------------------------------------------------------------------------------------------------------*/
  synchroniseArticle() {
    articles = [];
    //this.database.getData('user', function (res) {}).then(function(res) {
      this.database.getData('article').then(function(res) {
      //Ici, on ne peut accéder à rien qui appartiennent à la classe InventaireComptagePage
      //C'est pour cela que l'on doit utiliser une variable globale
      for(let i = 0 ; i < res.length ; i++) {
        articles.push({id: parseInt(res[i].id), nb: parseInt(res[i].nb), prix: parseInt(res[i].prix)});
      }
    });

    this.articlesLocal = articles;
  }


  /*-----------------------------------------------------*/
  /*---Affiche le contenu de la variable globale users---*/
  /*-----------------------------------------------------*/
  afficheUser() {
    for(let i = 0 ; i < users.length ; i++) {
      console.log("Username : " + users[i].username + " | Password : " + users[i].password);
    }
  }

  /*-------------------------------------------------------------------------------*/
  /*---Supprime le contenu de la table "table" et de la variable globle associée---*/
  /*-------------------------------------------------------------------------------*/
  viderTable(table: string) {
    this.database.viderTable(table);
    this.synchronise(table);
  }

  /*--------------------------------------------------------*/
  /*---Renvoit true si la variable globale users est vide---*/
  /*--------------------------------------------------------*/
  aucuneArticle() {
    return (users.length == 0);
  }

  /*-----------------------------------------------------------------------*/
  /*---Affiche true dans la console si la variable global users est vide---*/
  /*-----------------------------------------------------------------------*/
  aucuneArticleAffiche() {
    console.log(this.aucuneArticle());
  }




  /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  /*---Ajoute l'article avec l'id inscrit dans l'input associé à code-barre dans le tableau (s'il n'existe pas déjà), ou incrément sa valeur nb de 1 s'il existe déjà---*/
  /*--------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
  scanArticle() {
    
    let article = (document.getElementById("inputScan") as HTMLInputElement).value;

    
    if(this.checkFormatArticle(article)) {

      //TODO : problème : à cause de la synchronisation : articlesLocal est encore vide, donc on ne peut
      //pas vérifier que l'id est déjà présent
      //


      //On vérifie si article est présent dans la liste des articles
      let i = 0;
      console.log("Taille locale : " + this.articlesLocal.length);
      while(i < this.articlesLocal.length && String(this.articlesLocal[i].id) != article) {
        console.log("ArticleLocal n°" + i + " : " + this.articlesLocal[i].id);
        i++;
      }

      if(i < this.articlesLocal.length) {
        console.log('Déjà présent');
        this.update('article', ['nb'], [this.articlesLocal[i].nb + 1], "id = " + article);
      } else {
        console.log('Pas déjà présent');
        this.addBDD('article', ['id', 'prix', 'nb'], [parseInt(article), 5, 1]);
      }
      

    } else {
      console.log("Aucun article scanné");
    }
  }

  /*-----------------------------------------------------------------*/
  /*---Vérifie si l'article scanné est au bon format (13 chiffres)---*/
  /*-----------------------------------------------------------------*/
  checkFormatArticle(toCheck: any) {
    return (toCheck.length == 13);
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

  /*----------------------------*/
  /*---Drop toutes les tables---*/
  /*----------------------------*/
  dropAllTables() {
    this.database.dropTable('user');
    this.database.dropTable('article');
  }
  


}




