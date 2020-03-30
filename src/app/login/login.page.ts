import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NavController, MenuController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    public menuCtrl: MenuController,
    private navCtrl: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

  validationsForm: FormGroup;
  errorMsg = '';

  validationMessages = {
    email: [
      { type: 'required', message: 'โปรดระบุ email' },
      { type: 'pattern', message: 'โปรดระบุ email ให้ถูกต้อง' }
    ],
    password: [
      { type: 'required', message: 'โปรดระบุรหัสผ่าน' },
      { type: 'minlength', message: 'ตรวจสอบรหัสผ่านอีกครั้ง' }
    ]
  };

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  loginUser(value) {
    this.authService.loginUser(value)
      .then(res => {
        // console.log(res.displayName);
        this.errorMsg = '';
        this.navCtrl.navigateForward('/main');
        this.validationsForm.controls.email.reset();
        this.validationsForm.controls.password.reset();
      }, err => {
        this.errorMsg = 'Email หรือรหัสผ่านไม่ถูกต้อง';
      });
  }

  goToRegisterPage() {
    this.validationsForm.controls.email.reset();
    this.validationsForm.controls.password.reset();
    this.navCtrl.navigateForward('/register');
  }
}
