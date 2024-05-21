import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './post/post.component';

export const routes: Routes = [
    { path: '', pathMatch : 'full', redirectTo: 'home' },
    { path: 'home', component: HomeComponent },
    { path: 'post/:path', component: PostComponent }
];
