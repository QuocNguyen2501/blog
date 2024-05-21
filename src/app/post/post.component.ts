import { Component, OnInit } from '@angular/core';
import { MediumService } from '../providers/medium.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, of, switchMap, take } from 'rxjs';
import { PostModel } from '../models/post.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './post.component.html',
  styleUrl: './post.component.sass'
})
export class PostComponent implements OnInit{
  
  public post: PostModel | undefined;

  constructor(
    private activatedRoute: ActivatedRoute, 
    private mediumService: MediumService,
  ) {
    
  }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      take(1),
      map((p)=>{
        return p['path'];
      }),
      switchMap((path:string)=>{
        return of(this.mediumService.getPost(path));
      }))
      .subscribe(post=>{
        this.post = post;
    });
  }
}
