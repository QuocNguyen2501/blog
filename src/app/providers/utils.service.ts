import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  public convertToSlug(input: string): string {
    let output = input.toLowerCase();
    output = output.replace(/[^a-zA-Z0-9\s\-–—]/g, '');
    output = output.replace(/[\s\–—]+/g, '-');
    return output;
  }

  public getShortContent(content: string): string {
    const maxLength = 200; 
    const cleanedContent = content.replace(/<img[^>]*>(.*?)<\/img>/g, '');
    let shortContent = cleanedContent.replace(/(<([^>]+)>)/gi, ""); 
    if (shortContent.length > maxLength) {
      shortContent = shortContent.substring(0, maxLength) + '...';
    }
    return shortContent;
  }

  public getFirstImage(content: string): string {
    const imgRegex = /<img.*?src="(.*?)".*?>/i;
    const match = imgRegex.exec(content);
    return match ? match[1] : '';
  }
}
