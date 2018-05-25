import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccueilComptagePage } from './accueil-comptage';

@NgModule({
  declarations: [
    AccueilComptagePage,
  ],
  imports: [
    IonicPageModule.forChild(AccueilComptagePage),
  ],
})
export class AccueilComptagePageModule {}


