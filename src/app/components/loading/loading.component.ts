import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, tap } from 'rxjs';
import { LoadingService } from './providers/loading.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'loading',
  standalone: true,
  imports: [
    MatProgressSpinnerModule,
    AsyncPipe,
    NgIf,
    NgTemplateOutlet
  ],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.sass'
})
export class LoadingComponent implements OnInit{
  loading$: Observable<boolean>;

  @Input()
  detectRouteTransitions = false;

  @ContentChild("loading")
  customLoadingIndicator: TemplateRef<any> | null = null;

  constructor(
    private loadingService: LoadingService,
    private router: Router
  ){
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    if(this.detectRouteTransitions){
      this.router.events.pipe(
        tap((event)=>{
          if(event instanceof NavigationStart){
            this.loadingService.loadingOn();
          }else if(event instanceof NavigationEnd){
            this.loadingService.loadingOff();
          }
        })
      ).subscribe();
    }
  }

}
