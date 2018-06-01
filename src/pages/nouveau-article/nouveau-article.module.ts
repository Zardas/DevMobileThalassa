import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NouveauArticlePage } from './nouveau-article';

@NgModule({
  declarations: [
    NouveauArticlePage,
  ],
  imports: [
    IonicPageModule.forChild(NouveauArticlePage),
  ],
})
export class NouveauArticlePageModule {}
