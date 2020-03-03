import { Observable } from 'rxjs';
import { BluecompassService, Location, Image } from './../services/bluecompass.service';
import { Component, OnInit } from '@angular/core';
import {  MenuController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  public staticNodeList = false;
  public staticImageList = false;
  public neighor = [];
  public locations: Observable<Location[]>;
  public imgs: Observable<Image[]>;
  constructor(
    public menuCtrl: MenuController,
    private bluecompassService: BluecompassService,
    public loadingController: LoadingController
  ) {
    this.staticNodeList = true;
    if (!this.locations || !this.imgs) {
      this.presentLoading();
    }
  }
   async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }
  ngOnInit() {
    this.locations = this.bluecompassService.getAllLocations();
    this.locations.subscribe(location => {
      location.forEach(element => {
        this.neighor = Object.keys(element.neighbor);
      });
    });
    console.log(this.neighor);
    this.imgs = this.bluecompassService.getAllImage();
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  onNodeList() {
    this.staticNodeList = true;
    this.staticImageList = false;
  }

  onImage() {
    this.staticNodeList = false;
    this.staticImageList = true;
  }
}
