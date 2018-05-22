import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocalDataPage } from './local-data';

@NgModule({
  declarations: [
    LocalDataPage,
  ],
  imports: [
    IonicPageModule.forChild(LocalDataPage),
  ],
})
export class LocalDataPageModule {}
