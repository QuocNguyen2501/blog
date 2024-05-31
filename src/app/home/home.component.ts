import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { description, title } from '../constant/content';
import { take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PostModel } from '../models/post.model';
import { MediumService } from '../providers/medium.service';



@Component({
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.sass'
})
export class HomeComponent implements OnInit {
  public posts: PostModel[] = [];

  
  constructor(
    private metaService: Meta,
    private router: Router, 
    private titleService: Title,
    private mediumService: MediumService,
  ){

  }

  ngOnInit(): void {
    this.setTitleAndMetaTags();
    this.mediumService.getPostsFromMedium().pipe(take(1)).subscribe(data=>{
      this.posts = data;
    })
  }

  public read(path: string) {
    this.router.navigateByUrl(`/post/${path}`);
  }
  
  private setTitleAndMetaTags(){
    this.titleService.setTitle(title);
    
    this.metaService.updateTag({ name: 'description', content: description })
    this.metaService.updateTag({ name: 'keywords', content: 'Quoc Nguyen, Freelance Developer, Software Developer, Full Stack Developer, Angular, Ionic, .NET Maui, Blazor, Asp.net MVC, .NET Core, Web API, Azure, Programming, Freelance' })
    this.metaService.updateTag( { name: 'robots', content: 'index, follow' })
    this.metaService.updateTag( { property: 'og:title', content: title })
    this.metaService.updateTag( { property: 'og:description', content: description })
    this.metaService.updateTag( { property: 'og:type', content: 'profile' })
  }



  
}
