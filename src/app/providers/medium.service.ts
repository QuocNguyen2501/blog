import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PostModel } from '../models/post.model';
import { UtilsService } from './utils.service';
import xml2js  from 'xml2js'
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediumService {
  private posts: PostModel[] = [];

  private readonly rssFeedUrl = 'https://medium.com/feed/@quocnguyen2501';

  constructor(
    private http: HttpClient,
    private utils: UtilsService,
  ) { 

  }


  public getPostsFromMedium():Observable<PostModel[]>{
    return this.http.get(this.rssFeedUrl,{ responseType: 'text' })
    .pipe(
      take(1),
      map(data=>{
        this.posts = this.parseRSS(data);
        return this.posts;
    }));
  }

  public getPost(path:string):PostModel|undefined{
    return this.posts.find(x=>x.path===path);
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
      path: this.utils.convertToSlug(item.title[0]),
      title: item.title[0],
      link: item.link[0],
      description: this.utils.getShortContent(item['content:encoded'][0]),
      content: item['content:encoded'][0],
      img: this.utils.getFirstImage(item['content:encoded'][0]),
      pubDate: item.pubDate[0],
    }));
  }
}
