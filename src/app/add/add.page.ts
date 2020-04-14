import { async } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { BluecompassService, Location, Image } from './../services/bluecompass.service';
import { Component, OnInit , OnDestroy} from '@angular/core';
import { ToastController, NavController, AlertController } from '@ionic/angular';
@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit, OnDestroy {
  nodes = [];
  neighborNode = [];

  buildingID: string;
  buildingFloor: number;
  buildingName: string;
  uid: string;
  imgUID: string;
  countNode: number;
  nodeNameBuffer: string[] = [];
  nodeXpointBuffer: number[] = [];
  nodeYpointBuffer: number[] = [];
  nodeIDBuffer: string[] = [];
  nodeNeighborBuffer: string[] = [];
  weightNeighbor: number[] = [];

  base64Image = '';
  fileData: File = null;
  previewUrl: any = null;
  fileDataEditMode: File = null;
  fileUploadProgress: string = null;

  location: Location = {
    id: '',
    name: '',
    x_point: 0,
    y_point: 0,
    floor: 0,
    neighbor: {},
    neighborList: ''
  };

  locationEditMode: Location = {
    id: '',
    name: '',
    x_point: 0,
    y_point: 0,
    floor: 0,
    neighbor: {},
    neighborList: ''
  };

  imageEditMode: Image = {
    data: '',
    name: '',
    tag: ''
  };

  locations: Location[] = [];
  img: Image;
  submitPost = {
    countLocation: 0,
    img: false
  };

  tmpLocation;
  tmp;
  editStage = {
    add: true,
    location: false,
    img: false
  };
  constructor(
    private bluecompassService: BluecompassService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public toastController: ToastController,
    private navCtrl: NavController,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.uid = this.activatedRoute.snapshot.paramMap.get('id');
      this.getNodeById(this.activatedRoute.snapshot.paramMap.get('id'));
    }
    if (this.activatedRoute.snapshot.paramMap.get('imgID')) {
      this.imgUID = this.activatedRoute.snapshot.paramMap.get('imgID');
      this.getImgById(this.activatedRoute.snapshot.paramMap.get('imgID'));
    }
  }

  checkAndClearCountNode(data: number) {
    if (data) {
      this.locations = [];
    }
  }

  ionViewWillEnter() {
    // this.url_id = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log(this.url_id);
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.editStage.location = true;
      this.editStage.add = false;
      this.editStage.img = false;
    } else if (this.activatedRoute.snapshot.paramMap.get('imgID')) {
      this.editStage.img = true;
      this.editStage.location = false;
      this.editStage.add = false;
    } else {
      this.editStage.add = true;
      this.editStage.img = false;
      this.editStage.location = false;
    }
  }
  addNode(length: number) {
    for (let index = 0; index < length; index++) {
      this.locations.push(this.location);
      this.nodeNameBuffer.push();
      this.nodeXpointBuffer.push();
      this.nodeYpointBuffer.push();
      this.nodeNeighborBuffer.push();
    }
  }
  addOneNode() {
    this.locations.push(this.location);
    this.nodeNameBuffer.push();
    this.nodeXpointBuffer.push();
    this.nodeYpointBuffer.push();
    this.nodeNeighborBuffer.push();
  }
  delNode() {
    this.locations.pop();
    this.nodeNeighborBuffer.pop();
  }

  getImgById(id: string) {
    // tslint:disable-next-line:max-line-length
    const imageData = this.bluecompassService.getImageById(id);
    imageData.forEach(img => {
      console.log(img);
      this.imageEditMode.data = img.data;
      this.imageEditMode.name = img.name;
      this.imageEditMode.tag = img.tag;
    });
  }

  getNodeById(id: string) {
    // console.log('in get node id');
    this.tmpLocation = this.bluecompassService.getLocationByID(id);
    // console.log(this.tmpLocation);
    this.tmpLocation.forEach(location => {
      (location.id) ? this.locationEditMode.id = location.id : this.locationEditMode.id = '';
      (location.name) ? this.locationEditMode.name = location.name : this.locationEditMode.name = location.name = '';
      // (location.neighbor) ? this.locationEditMode.neighbor = location.neighbor : this.locationEditMode.neighbor = '';
      // tslint:disable-next-line:max-line-length
      (location.neighborList) ? this.locationEditMode.neighborList = location.neighborList : this.locationEditMode.neighborList = '';
      this.locationEditMode.x_point = location.x_point;
      this.locationEditMode.y_point = location.y_point;
      this.locationEditMode.floor = location.floor;
    });
  }
  
  async missData() {
    const alert = await this.alertController.create({
      header: 'พบข้อผิดพลาด',
      subHeader: 'กรุณากรองข้อมูลในรบ',
      buttons: ['ฉันเข้าใจแล้ว']
    });
    await alert.present();
  }

  submitForm() {
    this.successToast();
    if (this.locations && this.previewUrl && this.nodeNeighborBuffer) {
      this.locations.map((node, i) => {
        node.id = `${this.buildingID}${this.buildingFloor}_${i}`;
        node.name = this.nodeNameBuffer[i];
        node.x_point = this.nodeXpointBuffer[i];
        node.y_point = this.nodeYpointBuffer[i];
        node.floor = this.buildingFloor;
        if (this.nodeNeighborBuffer) {
          const perNeighbor = {};
          this.nodeNeighborBuffer[i].split(',').forEach(neighbor => {
            neighbor.split(':').forEach((weightNeighbor) => {
              const nodeData = neighbor.split(':');
              // tslint:disable-next-line:radix
              if (parseInt(nodeData[1])) {
                const name = nodeData[0];
                perNeighbor[name.trim()] = parseInt(nodeData[1]);
              }
            });
          });
          node.neighbor = perNeighbor;
          let list = '';
          for (const [key, value] of Object.entries(perNeighbor)) {
            list += `${key}:${value},`;
          }
          node.neighborList = list;
        } else {
          node.neighbor = {};
          node.neighborList = '';
        }
        this.postLocation(node);
        return node;
      });
      this.img = {
        data : this.previewUrl,
        name : this.buildingName,
        tag: this.buildingID + this.buildingFloor,
      };
      this.postImg(this.img);
      this.router.navigateByUrl(`/main`);
    } else {
      this.missData();
    }
    this.checkStatus();
  }

  postLocation(data: Location) {
    this.bluecompassService.addLocation(data).then(() => {
      this.submitPost.countLocation += 1;
      return true;
    }, err => {
      console.log('There was a problem adding your location:(');
    });
  }

  postImg(data: Image) {
    this.bluecompassService.addImg(this.img).then(() => {
      this.submitPost.img = true;
    }, err => {
      console.log('There was a problem adding your Img:(');
    });
  }

  checkStatus() {
    if (this.locations.length === this.submitPost.countLocation && this.submitPost.img) {
      this.clearData();
      this.router.navigateByUrl(`/main`);
    } else {
      this.missingToast();
    }
  }

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0];
    this.preview();
  }

  fileProgressEditMode(fileInput: any) {
    this.fileDataEditMode = fileInput.target.files[0];
    this.previewEdit();
  }

  preview() {
    const mimeType = this.fileData.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileData);
    reader.onload = (event) => {
      this.previewUrl = reader.result;
    };
  }

  previewEdit() {
    const mimeType = this.fileDataEditMode.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.fileDataEditMode);
    reader.onload = (event) => {
      this.imageEditMode.data = reader.result.toString();
    };
  }

  addLocationImage() {
    const dataStatus = {
      location: false,
      img: false
    };
    // console.log(this.img);
    this.locations.forEach(location => {
      // console.log(location);
      if (location.id) {
        this.bluecompassService.addLocation(location).then(() => {
          console.log('Location added');
          dataStatus.location = true;
        }, err => {
          console.log('There was a problem adding your location:(');
        });
      } else {
        console.log('No location');
      }
    });
    if (this.img.data) {
      this.bluecompassService.addImg(this.img).then(() => {
          console.log('Img added');
          dataStatus.img = true;
        }, err => {
          console.log('There was a problem adding your Img:(');
        });
      } else {
        console.log('No Image');
    }
    if (dataStatus.img && dataStatus.location) {
      this.router.navigateByUrl(`/main`);
      // this.clearData();
    } else {
      this.missingToast();
    }
  }

  ngOnDestroy() {
    this.clearData();
  }
  clearData() {
    this.nodes = [];
    this.neighborNode = [];
    this.buildingID = '';
    this.buildingFloor = null;
    this.buildingName = '';

    this.nodeNameBuffer = [];
    this.nodeXpointBuffer = [];
    this.nodeYpointBuffer = [];
    this.nodeIDBuffer = [];
    this.nodeNeighborBuffer = [];
    this.weightNeighbor = [];

    this.base64Image = '';
    this.fileData = null;
    this.previewUrl = null;
    this.fileUploadProgress = null;
    this.locations = [];
  }

  async successToast() {
    const toast = await this.toastController.create({
      message: 'กรุณารอสักครู่...กำลังบันทึกข้อมูลเข้าสุดระบบ',
      duration: 2000
    });
    toast.present();
  }
  async missingToast() {
    const toast = await this.toastController.create({
      message: 'กรุณาใส่ข้อมูลในครบถ้วน',
      duration: 2000
    });
    toast.present();
  }

  deleteLocation(id: string) {
    this.bluecompassService.deletelocation(id);
    this.navCtrl.navigateForward('/main');
    // console.log(id);
  }

  updateLocation(location: Location, uid: string) {
    if (location.neighborList) {
      const perNeighbor = {};
      location.neighborList.split(',').forEach(neighbor => {
        // console.log(neighbor);
        let nodeData = neighbor.split(':');
        if (parseInt(nodeData[1])) {
          const name = nodeData[0];
          perNeighbor[name.trim()] = parseInt(nodeData[1]);
        }
      });
      location.neighbor = perNeighbor;
      // location.neighborList = Object.entries(perNeighbor).toString();
      // console.log(location.neighborList);
    } else {
      location.neighbor = {};
      location.neighborList = '';
    }
    // console.log(location, uid);
    this.bluecompassService.updateLocation(location, uid);
    this.navCtrl.navigateForward('/main');
  }

  deleteImg(id: string) {
    this.bluecompassService.deleteImg(id);
    this.navCtrl.navigateForward('/main');
  }

  updateImg(img: Image, id: string) {
    this.bluecompassService.updateImg(img, id);
    this.navCtrl.navigateForward('/main');
  }
}
