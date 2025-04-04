import { CountryService } from './../../landlord/properties-create/step/location-step/country.service';
import { CategoryService } from './../../layout/navbar/category/category.service';
import { ToastService } from './../../layout/toast.service';
import { ActivatedRoute } from '@angular/router';
import { TenantListingService } from './../tenant-listing.service';
import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { DisplayPicture, Listing } from '../../landlord/model/listing.model';
import { Category } from '../../layout/navbar/category/category.model';
import { count, map } from 'rxjs';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AvatarComponent } from "../../layout/navbar/avatar/avatar.component";
import { NgClass } from '@angular/common';
import { BookDateComponent } from "../book-date/book-date.component";

@Component({
  selector: 'app-display-listing',
  imports: [FaIconComponent, AvatarComponent, NgClass, BookDateComponent],
  templateUrl: './display-listing.component.html',
  styleUrl: './display-listing.component.scss'
})
export class DisplayListingComponent implements OnInit, OnDestroy {
  
  

  tenantListingService = inject(TenantListingService);
  activatedRoute = inject(ActivatedRoute);
  toastService = inject(ToastService);
  categoryService = inject(CategoryService);
  countryService = inject(CountryService);

  listing: Listing | undefined;
  category: Category | undefined;
  currentPublicId = "";
  loading = true;

  constructor() { 
    this.listenToFetchListing();
  }


  ngOnInit(): void {
   this.extractIdParamFromRouter();
  }
  
  ngOnDestroy(): void {
    this.tenantListingService.resetGetOneByPublicId();
  }
  
  private extractIdParamFromRouter() {
    this.activatedRoute.queryParams.pipe(
      map(params => params['id'])
    ).subscribe({
      next: publicId => this.fetchListing(publicId),
    });   
  }

  private fetchListing(publicId: string) {
    this.loading = true;
    this.currentPublicId = publicId;
    this.tenantListingService.getOneByPublicId(publicId);
  }

  private listenToFetchListing() {
    effect(()=>{
      const listingByPublicIdState = this.tenantListingService.getOneByPublicIdSig();
      if(listingByPublicIdState.status === "OK"){
        this.loading = false;
        this.listing = listingByPublicIdState.value;
        if(this.listing){
          this.listing.pictures = this.putCoverPictureFirst(this.listing.pictures);
          this.category = this.categoryService.getCategoryByTechnicalName(this.listing.category);
          this.countryService.getCountryByCode(this.listing.location)
          .subscribe({
            next: country => {
              if(this.listing){
                this.listing.location = country.region+ ", " + country.name.common;
              }
            }
          });
        } 
      } else if(listingByPublicIdState.status === "ERROR"){
        this.loading = false;
        this.toastService.send({
          severity: "error", summary :"Error", detail: listingByPublicIdState.error?.message}); 
      }
    })
  }

  private putCoverPictureFirst(pictures: Array<DisplayPicture>) {
    const cover = pictures.find(picture => picture.isCover);
    if(cover){
      const index = pictures.indexOf(cover);
      pictures.splice(index, 1);
      pictures.unshift(cover);
    }
    return pictures;
  }

}
