import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InventaireComptagePage } from './inventaire-comptage';

@NgModule({
  declarations: [
    InventaireComptagePage,
  ],
  imports: [
    IonicPageModule.forChild(InventaireComptagePage),
  ],
})
export class InventaireComptagePageModule {}
