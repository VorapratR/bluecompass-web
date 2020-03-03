import { Observable } from 'rxjs';
import { BluecompassService, Location, Image } from './../services/bluecompass.service';
import { Component, OnInit } from '@angular/core';
import {  MenuController } from '@ionic/angular';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  public locations: Observable<Location[]>;
  public imgs: Observable<Image[]>;
  constructor(
    public menuCtrl: MenuController,
    private bluecompassService: BluecompassService
  ) { }

  ngOnInit() {
    this.locations = this.bluecompassService.getAllLocations();
    this.imgs = this.bluecompassService.getAllImage();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

}
