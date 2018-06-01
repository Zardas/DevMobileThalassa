import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { HttpModule } from '@angular/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { InventaireComptagePage } from '../pages/inventaire-comptage/inventaire-comptage';
import { AccueilComptagePage } from '../pages/accueil-comptage/accueil-comptage';
import { ParametresComptagePage } from '../pages/parametres-comptage/parametres-comptage';
import { ParametresGlobauxPage } from '../pages/parametres-globaux/parametres-globaux';
import { NouveauComptagePage } from '../pages/nouveau-comptage/nouveau-comptage';
import { NouveauArticlePage } from '../pages/nouveau-article/nouveau-article';
import { ListeArticlePage } from '../pages/liste-article/liste-article';

@NgModule({

  declarations: [
    MyApp,
    HomePage,
    AccueilComptagePage,
    InventaireComptagePage,
    ParametresComptagePage,
    ParametresGlobauxPage,
    ListeArticlePage,
    NouveauComptagePage,
    NouveauArticlePage
  ],
  imports: [BrowserModule, HttpModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AccueilComptagePage,
    InventaireComptagePage,
    ParametresComptagePage,
    ParametresGlobauxPage,
    ListeArticlePage,
    NouveauComptagePage,
    NouveauArticlePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})


export class AppModule {
	
}









