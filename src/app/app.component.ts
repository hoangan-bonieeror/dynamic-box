import { Component, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BoxComponent } from './box/box.component';

export interface IBox {
  name : string,
  checked : boolean,
  isIntermediate? : boolean
}

interface PairPro {
  [key : string] : string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'checkbox';
  data : IBox[];
  result : string;
  property : string;
  errorMsg : string;
  @ViewChild(BoxComponent) box : BoxComponent

  ngOnInit() : void {
    this.data = [{ name : 'All', checked : false, isIntermediate : false }]
    this.setProperty();
    this.errorMsg = '';
  }

  processCheck() {
      // Check all
      const isAllChecked = this.data.slice(1).every(row => row.checked)
      if(isAllChecked) {
        this.data[0].isIntermediate = !isAllChecked;
        this.data[0].checked = isAllChecked
      } else {
        const isSomeChecked = this.data.slice(1).some(row => row.checked);
        if(isSomeChecked) {
          this.data[0].isIntermediate = isSomeChecked
        } else {
          this.data[0].checked = isSomeChecked
          this.data[0].isIntermediate = isSomeChecked
        }
      } 
  }

  onChange(input : IBox) {
    if(input.name == 'All') {
      this.toggleAll();
    } else {
      this.processCheck();
    }
    this.updateResult();
  }

  remoteUpdateBox() {
    try {
      const listResults = JSON.parse(this.result);
      console.log(listResults)
      this.data.forEach(box => {
        box.checked = listResults.includes(box.name);
        this.processCheck();
      });
      this.updateResult();
    } catch (error) {
      console.log(error)
    }
  }

  updateResult() {
    this.result = JSON.stringify(this.data.slice(1).filter(box => box.checked).map(box => box.name))
  }

  toggleAll() {
    this.data = this.data.map(box => {
      return {...box, checked : this.data[0].checked}
    })
  }

  setProperty() {
    try {
      if(this.property) {
        // @ts-ignore
        let data = JSON.parse(this.property).map(pro => {
          if(typeof pro == 'object') {
            const valueOfPro = Object.values(pro)[0]
            const boxData = { name : valueOfPro, checked : false } as IBox
            return boxData;
          } else {
            throw new Error();
          }
        })

        if(data.length > 1) {
          const chooseIndex : number[] = [];
          //@ts-ignore
          data.forEach((pro, index) => {
            if(index > 0) {
              if(Object.values(pro)[0] !== Object.values(data[index - 1])[0]) {
                chooseIndex.push(index)
              }
            } else {
              if(index == 0) {
                chooseIndex.push(index);
              }
            }
          })

          // @ts-ignore
          data = data.filter((pro, index) => {
            // @ts-ignore
            if(chooseIndex.includes(index)) {
              return pro;
            }
          })
        }
        
        
        this.data = [
          ...this.data,
          ...data
        ]
        this.errorMsg = ''
      } else {
        if(this.property.length == 0) this.errorMsg = ''
      }
    } catch (error) {
      this.errorMsg = 'Can not parse JSON';
    }
  }
}
