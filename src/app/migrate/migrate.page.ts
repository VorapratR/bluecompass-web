import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { LocationStrategy } from '@angular/common';
import { BluecompassService } from '../services/bluecompass.service';
import { __await } from 'tslib';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-migrate',
  templateUrl: './migrate.page.html',
  styleUrls: ['./migrate.page.scss'],
})
export class MigratePage implements OnInit {

  constructor(public menuCtrl: MenuController, private https: HttpClient, private bluecompassService: BluecompassService) { }

  jsonData: any;
  baramee: any[] = [];
  main: any[] = [];

  input: Location[] = [];

  ngOnInit() {
    this.jsonData = this.https.get('../../assets/map.json');
    this.jsonData.forEach(async (data: { locations: string | any[]; }) => {
      // console.log(data.locations);
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0 ; i < data.locations.length; i++) {
        let neighborList = '';
        const nodeList = Object.entries(data.locations[i].neighbor);
        for (let neighbor of nodeList) {
          // console.log(j);
          neighborList += neighbor[0] + ':' + neighbor[1] + ',';
        }
        // console.log(neighborList);
        data.locations[i].neighborList = neighborList;
        // console.log(data.locations[i].neighborList);
        // console.log(data.locations[i]);
        // console.log('====');
        // console.log(nodeList);
        if (data.locations[i].id.includes('baramee')) {
          this.baramee.push(data.locations[i]);
        } else {
          this.main.push(data.locations[i]);
        }
      }
      await this.sleep(500);
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  async migrateData() {
    this.baramee.forEach(b => {
      if (b.id) {
        this.bluecompassService.addLocation(b).then(() => {
          console.log('Location added');
        }, err => {
          console.log('There was a problem adding your location:(');
        });
      } else {
        console.log('No location');
      }
    });
    await this.sleep(1000);
    for (let main of this.main) {
      if (main.id) {
        this.bluecompassService.addLocation(main).then(() => {
          console.log('Location added');
        }, err => {
          console.log('There was a problem adding your location:(');
        });
      } else {
        console.log('No location');
      }
    }
  }

  sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
