import { Component, OnInit } from '@angular/core';
import {  MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public userName: string;
  public password: string;
  public statusLogin: boolean;

  constructor(public menuCtrl: MenuController, private router: Router) {
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  onMainPage() {
    // this.statusLogin = false;
    // this.router.navigateByUrl(`/main`);
    if (this.userName === '@dmin@test.com' && this.password === '@dmmin2525') {
      this.statusLogin = false;
      this.router.navigateByUrl(`/main`);
    } else {
      this.statusLogin = true;
    }
  }

}
