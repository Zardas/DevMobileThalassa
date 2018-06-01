import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListeArticlePage } from './liste-article';

@NgModule({
  declarations: [
    ListeArticlePage,
  ],
  imports: [
    IonicPageModule.forChild(ListeArticlePage),
  ],
})
export class ListeArticlePageModule {}
