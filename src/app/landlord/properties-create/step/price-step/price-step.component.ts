import { Component, EventEmitter, input, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { InputTextModule } from 'primeng/inputtext';
import { PriceVO } from '../../../model/listing-vo.model';

@Component({
  selector: 'app-price-step',
  imports: [FormsModule, InputTextModule, FontAwesomeModule],
  templateUrl: './price-step.component.html',
  styleUrl: './price-step.component.scss'
})
export class PriceStepComponent {

  price = input.required<PriceVO>()

  @Output()
  priceChange = new EventEmitter<PriceVO>();

  @Output()
  stepValidityChange = new EventEmitter<boolean>();

  @ViewChild("formPrice")
  formPrice: NgForm | undefined;

  onPriceChange(newPrice: number){
    this.priceChange.emit({value: newPrice});
    this.stepValidityChange.emit(this.validateForm());
  }

  validateForm(): boolean | undefined {
    if(this.formPrice){
      return this.formPrice?.valid!;
    } else {
      return false;
    }
  }

}
