import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { description, title } from '../constant/content';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';
import xml2js  from 'xml2js'
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface PostModel {
  path:string,
  title:string,
  description:string,
  content:string,
  img:string,
  link:string,
  pubDate:string
}

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

  private rssFeedUrl = 'https://medium.com/feed/@quocnguyen2501';
  constructor(
    private http: HttpClient,
    private metaService: Meta,
    private router: Router, 
    private titleService: Title){

  }

  ngOnInit(): void {
    this.setTitleAndMetaTags();
    this.getPostsFromMedium().pipe(take(1)).subscribe(data=>{
      this.posts = this.parseRSS(data);
    })
  }

  public read(path: string) {
    this.router.navigateByUrl(`/post/${path}`);
  }
  
  private setTitleAndMetaTags(){
    this.titleService.setTitle(title);
    this.metaService.addTags([
      { name: 'description', content: description },
      { name: 'keywords', content: 'Quoc Nguyen, Freelance Developer, Software Developer, Full Stack Developer, Angular, Ionic, .NET Maui, Blazor, Asp.net MVC, .NET Core, Web API, Azure, Programming, Freelance' },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'profile' },
    ]);
  }

  private getPostsFromMedium(){
    return this.http.get(this.rssFeedUrl,{ responseType: 'text' });
  }

  private parseRSS(rss:string): PostModel[]{
    let result: any;
    xml2js.parseString(rss, { trim: true, mergeAttrs: true }, (err, parsedResult) => {
      if (err) {
        throw new Error('Error parsing RSS feed');
      }
      result = parsedResult;
    });
    const items = result.rss.channel[0].item;
    return items.map((item:any)=> ({
      path: this.convertToSlug(item.title[0]),
      title: item.title[0],
      link: item.link[0],
      description: this.getShortContent(item['content:encoded'][0]),
      content: item['content:encoded'][0],
      img: this.getFirstImage(item['content:encoded'][0]),
      pubDate: item.pubDate[0],
    }));
  }

  private convertToSlug(input: string): string {
    let output = input.toLowerCase();
    output = output.replace(/[^a-zA-Z0-9\s\-–—]/g, '');
    output = output.replace(/[\s\–—]+/g, '-');
    return output;
  }

  private getShortContent(content: string): string {
    const maxLength = 200; 
    const cleanedContent = content.replace(/<img[^>]*>(.*?)<\/img>/g, '');
    let shortContent = cleanedContent.replace(/(<([^>]+)>)/gi, ""); 
    if (shortContent.length > maxLength) {
      shortContent = shortContent.substring(0, maxLength) + '...';
    }
    return shortContent;
  }

  private getFirstImage(content: string): string {
    const imgRegex = /<img.*?src="(.*?)".*?>/i;
    const match = imgRegex.exec(content);
    return match ? match[1] : '';
  }
}
