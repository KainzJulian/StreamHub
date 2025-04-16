import { Component, OnInit } from '@angular/core';
import { HomeTemplate } from '../../templates/home-template/home-template';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'video-page',
  standalone: true,
  imports: [HomeTemplate],
  templateUrl: './video-page.html',
  styleUrl: './video-page.scss',
})
export class VideoPage implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const videoID = this.route.snapshot.paramMap.get('videoID');

    console.log('The Video ID', videoID);
  }
}
