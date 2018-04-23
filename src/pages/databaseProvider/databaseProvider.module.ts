import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DatabaseProvider } from './databaseProvider';

@NgModule({
  declarations: [
    DatabaseProvider,
  ],
  imports: [
    IonicPageModule.forChild(DatabaseProvider),
  ],
})
export class databaseProviderPageModule {}