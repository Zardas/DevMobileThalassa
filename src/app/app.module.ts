import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { SQLite } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { InventaireComptagePage } from '../pages/inventaire-comptage/inventaire-comptage';

import { SQLiteMock } from './SQLiteMock';
import { SQLitePorterMock } from './SQLitePorterMock';


@NgModule({

  declarations: [MyApp, HomePage, InventaireComptagePage],
  imports: [BrowserModule, IonicModule.forRoot(MyApp)],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, HomePage, InventaireComptagePage],
  providers: [
    StatusBar,
    SplashScreen,,
    {provide: SQLite, useClass: SQLiteMock },
    {provide: SQLitePorter, useClass: SQLitePorterMock},
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})


export class AppModule {
	
}









