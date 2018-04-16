import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestPage2Page } from './test-page2';

@NgModule({
  declarations: [
    TestPage2Page,
  ],
  imports: [
    IonicPageModule.forChild(TestPage2Page),
  ],
})
export class TestPage2PageModule {}
