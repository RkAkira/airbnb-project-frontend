import { NewListingInfo } from './../../../model/listing.model';
import { Component, EventEmitter, input, Output } from '@angular/core';
import { InfoStepControlComponent } from "./info-step-control/info-step-control.component";

export type Control = "GUESTS" | "BEDROOMS" | "BEDS" | "BATHS"

@Component({
  selector: 'app-info-step',
  imports: [InfoStepControlComponent],
  templateUrl: './info-step.component.html',
  styleUrl: './info-step.component.scss'
})
export class InfoStepComponent {

  infos = input.required<NewListingInfo>();

  @Output()
  infoChange = new EventEmitter<NewListingInfo>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  onInfoChange(newValue:number, valueType: Control){
    switch (valueType){
      case "BATHS":
        this.infos().baths = {value: newValue}
        break;
      case "BEDROOMS":
        this.infos().bedrooms = {value: newValue}
        break;
      case "BEDS":
        this.infos().beds = {value: newValue}
        break;
      case 'GUESTS':
        this.infos().guests = {value: newValue}
        break;
      
    }

    this.infoChange.emit(this.infos());
    this.stepValidityChange.emit(this.validationRules());
  }

  validationRules(): boolean{
    return this.infos().guests.value >= 1;
  }

}
