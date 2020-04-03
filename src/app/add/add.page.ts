import { Router, ActivatedRoute } from '@angular/router';
import { BluecompassService, Location, Image } from './../services/bluecompass.service';
import { Component, OnInit , OnDestroy} from '@angular/core';
import { ToastController } from '@ionic/angular';
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

  nodeNameBuffer: string[] = [];
  nodeXpointBuffer: number[] = [];
  nodeYpointBuffer: number[] = [];
  nodeIDBuffer: string[] = [];
  nodeNeighborBuffer: string[] = [];
  weightNeighbor: number[] = [];

  base64Image = '';
  fileData: File = null;
  previewUrl: any = null;
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
  locations: Location[] = [];
  img: Image;

  tmpLocation;
  tmp;
  editStage = false;

  constructor(
    private bluecompassService: BluecompassService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public toastController: ToastController
  ) {}

  ngOnInit() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.getNodeById(this.activatedRoute.snapshot.paramMap.get('id'));
    }
  }

  ionViewWillEnter() {
    // this.url_id = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log(this.url_id);
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.editStage = true;
    }
  }
  addNode() {
    this.locations.push(this.location);
  }
  delNode() {
    this.locations.pop();
  }

  getNodeById(id: string) {
    // console.log('in get node id');
    this.tmpLocation = this.bluecompassService.getLocationByID(id);
    console.log(this.tmpLocation);
    this.tmpLocation.forEach(location => {
      console.log(location);
    });

  }

  submitForm() {
    this.successToast();
    console.log(this.locations);
    console.log(this.nodeNeighborBuffer);
    this.locations.forEach((node, i) => {
      node.id = `${this.buildingID}${this.buildingFloor}_${i}`;
      node.name = this.nodeNameBuffer[i];
      node.x_point = this.nodeXpointBuffer[i];
      node.y_point = this.nodeYpointBuffer[i];
      node.floor = this.buildingFloor;
      if (this.nodeNeighborBuffer) {
        const perNeighbor = {};
        this.nodeNeighborBuffer[i].split(',').forEach(neighbor => {
          neighbor.split('*').forEach((weightNeighbor) => {
            // tslint:disable-next-line:radix
            if (parseInt(weightNeighbor)) {
              const name = neighbor.toString().slice(0, -2);
              // tslint:disable-next-line:radix
              perNeighbor[name] = parseInt(weightNeighbor);
            }
          });
        });
        node.neighbor = perNeighbor;
        node.neighborList = Object.keys(perNeighbor).toString();
      } else {
        node.neighbor = null;
        node.neighborList = '';
      }
    });
    // console.log(this.locations);
    this.img = {
      data : this.previewUrl,
      name : this.buildingName,
      tag: this.buildingID + this.buildingFloor,
    };
    if (this.locations.length && this.img.data) {
      this.addLocationImage();
      this.router.navigateByUrl(`/main`);
    } else {
      console.log('Dont Have Data');
    }
  }

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0];
    this.preview();
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

  addLocationImage() {
    const dataStatus = {
      location: false,
      img: false
    };
    console.log(this.img);
    this.locations.forEach(location => {
      console.log(location);
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
      this.clearData();
      this.router.navigateByUrl(`/main`);
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
  deleteIdea() {
    console.log('del');
  }

  updateIdea() {
    console.log('update');
  }
}
