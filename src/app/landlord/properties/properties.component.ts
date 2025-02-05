import { Toast } from 'primeng/toast';
import { LandlordListingService } from './../landlord-listing.service';
import { Component, effect, inject } from '@angular/core';
import { ToastService } from '../../layout/toast.service';
import { CardListing } from '../model/listing.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CardListingComponent } from "../../shared/card-listing/card-listing.component";

@Component({
  selector: 'app-properties',
  imports: [FaIconComponent, CardListingComponent],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.scss'
})
export class PropertiesComponent {

  landlordListingService = inject(LandlordListingService);
  toastService = inject(ToastService);

  listings: Array<CardListing> | undefined = [];
  loadingDeletion = false;
  loadingFetchAll = false;

  constructor(){
    this.listenFetchAll();
    this.listenDeleteByPublicId();
  }

  private listenFetchAll(){
    effect(()=>{
      const allListingState = this.landlordListingService.getAllSig();
      if(allListingState.status === "OK" && allListingState.value){
        this.loadingFetchAll = false;
        this.listings = allListingState.value;
      } else if (allListingState.status === "ERROR"){
        this.toastService.send({
          severity: "error", summary: "Error", detail: "Error when fetching the Listing"
        });
      }
    });
  }

  private listenDeleteByPublicId(){
    effect(()=>{
      const deleteState = this.landlordListingService.deleteSig();
      if(deleteState.status === "OK" && deleteState.value){
        const listingToDeleteIndex = this.listings?.findIndex(listing => listing.publicId === deleteState.value);
        this.listings?.splice(listingToDeleteIndex!,1);
        this.toastService.send({
          severity: "success", summary: "Deleted successfully", detail: "Listing deleted Successfully"
        });
      } else if (deleteState.status === "ERROR"){
        const listingToDeleteIndex = this.listings?.findIndex(listing => listing.publicId === deleteState.value);
        this.listings![listingToDeleteIndex!].loading = false;
        this.toastService.send({
          severity: "error", summary: "Error", detail: "Error when Deleting the Listing"
        });
      }
        this.loadingDeletion = false
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
  }

  ngOnInit(): void {
    this.fetchListings()
  }

   onDeleteListing(listing: CardListing){
      listing.loading = true;
      this.landlordListingService.delete(listing.publicId);
  }

  private fetchListings() {
    this.loadingFetchAll = true;
    this.landlordListingService.getAll()
  }

}
