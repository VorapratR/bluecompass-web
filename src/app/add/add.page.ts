import { Component, OnInit} from '@angular/core';
@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  nodes = [];
  neighborNode = [];
  buildingID: string;
  buildingFloor: number;
  buildingName: string;

  nodeName = [];
  nodeXpoint = [];
  nodeYpoint = [];
  nodeID = [];
  nodeNeighbor = [];

  base64Image = '';

  fileData: File = null;
  previewUrl: any = null;
  fileUploadProgress: string = null;

  constructor() {}

  ngOnInit() {
  }

  addNode() {
    this.nodes.push({
      id: '',
      name: '',
      xpoint: '',
      ypoint: '',
      neighbor: '',
      img: ''
    });
  }

  submitForm() {
    const neighborBuffter = {};
    this.nodes.forEach((element, index) => {
      this.nodeNeighbor[index].split(',').forEach( (ele, i) => {
       neighborBuffter[ele] = 1;
      });
      element.id = `${this.buildingID}_${this.buildingID}-${index}`;
      element.name = this.nodeName[index];
      element.xpoint = this.nodeXpoint[index];
      element.ypoint = this.nodeYpoint[index];
      element.neighbor = neighborBuffter;
      element.img = this.previewUrl;
    });
    console.log(this.nodes);

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

}
