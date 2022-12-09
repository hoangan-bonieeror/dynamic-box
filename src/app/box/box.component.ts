import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IBox } from '../app.component';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {
  @Input() data : IBox;
  @Output() dataChange = new EventEmitter<IBox>();
  constructor() { }

  ngOnInit(): void {
  }

  onClickHandle() {
    if(this.data.name == 'All') this.data.isIntermediate = false;
    this.data.checked = !this.data.checked;
    this.updateStatus();
  }

  updateStatus() {
    this.dataChange.emit(this.data);
  }
}
