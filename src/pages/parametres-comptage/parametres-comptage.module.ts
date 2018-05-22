import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ParametresComptagePage } from './parametres-comptage';

@NgModule({
  declarations: [
    ParametresComptagePage,
  ],
  imports: [
    IonicPageModule.forChild(ParametresComptagePage),
  ],
})
export class ParametresComptagePageModule {}
