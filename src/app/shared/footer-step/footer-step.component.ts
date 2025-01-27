import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Step } from '../../landlord/properties-create/step.model';

@Component({
  selector: 'app-footer-step',
  imports: [FontAwesomeModule],
  templateUrl: './footer-step.component.html',
  styleUrl: './footer-step.component.scss'
})
export class FooterStepComponent {

  currentStep = input.required<Step>();
  loading = input<boolean>(false);
  isAllStepsValid = input<boolean>(false);
  labelFinish = input<string>("Finish");

  @Output()
  finish = new EventEmitter<boolean>();

  @Output()
  previous = new EventEmitter<boolean>();

  @Output()
  next = new EventEmitter<boolean>();

  onFinish(): void {
    this.finish.emit(true);
  }

  onPrevious(): void {
    this.previous.emit(true);
  }

  onNext(): void {
    this.next.emit(true);
  }

  
}
