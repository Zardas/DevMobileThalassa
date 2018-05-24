import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NouveauComptagePage } from './nouveau-comptage';

@NgModule({
  declarations: [
    NouveauComptagePage,
  ],
  imports: [
    IonicPageModule.forChild(NouveauComptagePage),
  ],
})
export class NouveauComptagePageModule {}
