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

@NgModule({

  declarations: [MyApp, HomePage, AccueilComptagePage, InventaireComptagePage, ParametresComptagePage],
  imports: [BrowserModule, HttpModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, AccueilComptagePage, InventaireComptagePage, ParametresComptagePage],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})


export class AppModule {
	
}









