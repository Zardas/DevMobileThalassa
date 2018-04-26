import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Database } from './databaseProvider';

@NgModule({
  declarations: [
    Database,
  ],
  imports: [
    IonicPageModule.forChild(Database),
  ],
})
export class databaseProviderPageModule {}