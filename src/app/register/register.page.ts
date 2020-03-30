import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NewAccount } from '../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  validationsForm: FormGroup;
  errorMessage = '';
  successMessage = '';

  validationMessages = {
    email: [
      { type: 'required', message: '' },
      { type: 'pattern', message: '' }
    ],
    password: [
      { type: 'required', message: '' },
      { type: 'minlength', message: 'รหัสผ่านอย่างน้อย 5 อักขระ' }
    ],
    name: [
      { type: 'required', message: '' },
      { type: 'minlength', message: 'ชื่ออย่างน้อย 3 อักขระ' }
    ]
  };

  constructor(
    public menuCtrl: MenuController,
    private navCtrl: NavController,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }

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
      name: new FormControl('', Validators.compose([
        Validators.minLength(3),
        Validators.required,
        // Validators.pattern('^[a-zA-Z0-9_.+-]')
      ]))
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  tryRegister(value: NewAccount) {
    console.log('in func');
    this.authService.registerUser(value)
      .then(res => {
        this.errorMessage = '';
        this.successMessage = 'Your account has been created. Please log in.';
        this.goLoginPage();
      }, err => {
        this.errorMessage = err.message;
        this.successMessage = '';
      });
  }

  goLoginPage() {
    this.validationsForm.controls.email.reset();
    this.validationsForm.controls.password.reset();
    this.validationsForm.controls.name.reset();
    this.navCtrl.navigateBack('/login');
  }
}
