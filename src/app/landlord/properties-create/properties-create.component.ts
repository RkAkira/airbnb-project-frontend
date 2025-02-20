import { Location } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { LandlordListingService } from '../landlord-listing.service';
import { ToastService } from '../../layout/toast.service';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { Step } from './step.model';
import { CreatedListing, NewListing } from '../model/listing.model';
import { NewListingPicture } from '../model/picture.model';
import { HttpErrorResponse } from '@angular/common/http';
import { State } from '../../core/model/state.model';
import { CategoryName } from '../../layout/navbar/category/category.model';
import { CategoryStepComponent } from "./category-step/category-step.component";
import { FooterStepComponent } from '../../shared/footer-step/footer-step.component';

@Component({
  selector: 'app-properties-create',
  imports: [CategoryStepComponent, FooterStepComponent],
  templateUrl: './properties-create.component.html',
  styleUrl: './properties-create.component.scss'
})
export class PropertiesCreateComponent {

  CATEGORY: string = "Category";
  LOCATION: string = "Location";
  INFO: string = "Info";
  PRICE: string = "Price";
  DESCRITPTION: string = "Description";
  PHOTO: string = "Photo";

  dialogDynamicRef = inject(DynamicDialogRef);
  listingService = inject(LandlordListingService);
  toastService = inject(ToastService);
  userService = inject(AuthService);
  router = inject(Router);

  steps: Step[] = [
    {
      id: this.CATEGORY,
      idNext: this.LOCATION,
      idPrevious: null,
      isValid: false,
    },
    {
      id: this.LOCATION,
      idNext: this.INFO,
      idPrevious: this.CATEGORY,
      isValid: false,
    },
    {
      id: this.INFO,
      idNext: this.DESCRITPTION,
      idPrevious: this.LOCATION,
      isValid: false,
    },
    {
      id: this.DESCRITPTION,
      idNext: this.PRICE,
      idPrevious: this.INFO,
      isValid: false,
    },
    {
      id: this.PRICE,
      idNext: this.PHOTO,
      idPrevious: this.DESCRITPTION,
      isValid: false,
    },
  
    {
      id: this.PHOTO,
      idNext: null,
      idPrevious: this.PRICE,
      isValid: false,
    }
  ];

  currentStep: Step = this.steps[0];

  newListing: NewListing = {
    category:"AMAZING_VIEWS",
    infos: {
      guests: {value:0},
      bedrooms: {value:0},
      beds: {value:0},
      baths: {value:0},
    },
    location: "",
    pictures: new Array<NewListingPicture>(),
    description: {
      title: {value: ""},
      description: {value: ""},
    },
    price: {value: 0}
  }

  loadingCreation: boolean = false;

  constructor() {
    this.listenListingCreation();
    this.listenFetchUser();
  }

  createListing(): void{
    this.loadingCreation = true;
    this.listingService.create(this.newListing);
  }

  ngOnDestroy(): void {
    this.listingService.resetListingCreation();
  }

  listenFetchUser(): void {
    effect(() => {
      if(this.userService.fetchUser().status === 'OK' 
      && this.listingService.createSig()().status === 'OK'){
        this.router.navigate(['landlord', 'properties']);
      }
    });
  }
  
  listenListingCreation(): void {
    effect(() => {
      let createdListingState = this.listingService.createSig();
      if(createdListingState().status === 'OK'){
        this.onCreateOK(createdListingState);
      }else if(createdListingState().status === 'ERROR'){
        this.onCreateError();
      }
    });
  }

  onCreateOK(createdListingState: any): void {
    this.loadingCreation = false;
    this.toastService.send({
      severity: 'success', summary: 'Success', detail: 'Your listing has been created'
    })
    this.dialogDynamicRef.close(createdListingState.value?.publicId);
    this.userService.fetch(true);
  }

  private onCreateError(): void {
    this.loadingCreation = false;
    this.toastService.send({
      severity: 'error', summary: 'Error', detail: 'Could not create your listing, please try again'
    })
  }

  nextStep(): void {
    if(this.currentStep.idNext !==null ){
      this.currentStep = this.steps.filter((step:Step) => step.id === this.currentStep.idNext)[0];
    }
  }

  previousStep(): void {
    if(this.currentStep.idNext !==null ){
      this.currentStep = this.steps.filter((step:Step) => step.id === this.currentStep.idPrevious)[0];
    }
  }

  isAllStepsValid(): boolean {
    return this.steps.filter((step:Step) => step.isValid).length === this.steps.length;
  }

  onCategoryChange(newCategory: CategoryName): void {
    this.newListing.category = newCategory;
  }

  onValidityChange(validity: boolean): void {
    this.currentStep.isValid = validity;
  }


}
