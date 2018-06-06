import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { InventaireComptagePage } from '../pages/inventaire-comptage/inventaire-comptage';
import { AccueilComptagePage } from '../pages/accueil-comptage/accueil-comptage';
import { ParametresComptagePage } from '../pages/parametres-comptage/parametres-comptage';
import { ParametresGlobauxPage } from '../pages/parametres-globaux/parametres-globaux';
import { ListeArticlePage } from '../pages/liste-article/liste-article';
import { NouveauComptagePage } from '../pages/nouveau-comptage/nouveau-comptage';
import { NouveauArticlePage } from '../pages/nouveau-article/nouveau-article';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage = AccueilComptagePage;
  pages: Array<{title: string, component: any}>;


  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Accueil', component: HomePage },
      { title: 'Inventaire', component: InventaireComptagePage },
      { title: 'Accueil Comptage', component: AccueilComptagePage },
      { title: 'Parametres Comptage', component: ParametresComptagePage },
      { title: 'Parametres Globaux', component: ParametresGlobauxPage },
      { title: 'Liste articles', component: ListeArticlePage },
      { title: 'Nouveau Comptage', component: NouveauComptagePage },
      { title: 'Nouvel Article', component: NouveauArticlePage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }


}

