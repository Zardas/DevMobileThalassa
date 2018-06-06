import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListeMagasinPage } from './liste-magasin';

@NgModule({
  declarations: [
    ListeMagasinPage,
  ],
  imports: [
    IonicPageModule.forChild(ListeMagasinPage),
  ],
})
export class ListeMagasinPageModule {}
