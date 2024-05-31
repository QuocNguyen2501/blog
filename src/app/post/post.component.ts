import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MediumService } from '../providers/medium.service';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, take } from 'rxjs';
import { PostModel } from '../models/post.model';
import { CommonModule, Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.sass',
  encapsulation: ViewEncapsulation.None
})
export class PostComponent implements OnInit{

  
  public post: PostModel | undefined;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private mediumService: MediumService,
    private location: Location, 
    private titleService: Title,
    private metaService: Meta,
  ) {
    
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      take(1),
      map((p)=>{
        return p['path'];
      }),
      switchMap((path:string)=>{
        return this.mediumService.getPostFromRSS(path);
      }))
      .subscribe(post=>{
        if(post){
          this.post = post;
          this.titleService.setTitle(this.post.title);
          this.metaService.updateTag({ name: 'description', content: this.post.description })
          this.metaService.updateTag({ name: 'keywords', content: this.post.title })
          this.metaService.updateTag({ name: 'robots', content: 'index, follow' })
          this.metaService.updateTag({ property: 'og:title', content: this.post.title })
          this.metaService.updateTag({ property: 'og:description', content: this.post.description })
          this.metaService.updateTag({ property: 'og:type', content: 'profile' })
        }
    });
  }

  back() {
    this.location.back();
  }
}
