import { Routes } from '@angular/router';
import { TopicsComponent } from './topics.component';
import { TopicDetailComponent } from './topic-detail.component';

export const TOPICS_ROUTES: Routes = [
  { path: '', component: TopicsComponent },
  { path: ':slug', component: TopicDetailComponent },
];
