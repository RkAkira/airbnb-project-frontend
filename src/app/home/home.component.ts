import { Pagination } from './../core/model/request.model';
import { CategoryService } from './../layout/navbar/category/category.service';
import { ToastService } from '../layout/toast.service';
import { TenantListingService } from './../tenant/tenant-listing.service';
import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardListing } from '../landlord/model/listing.model';
import { Subscription } from 'rxjs';
import { Category, CategoryName } from '../layout/navbar/category/category.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { CardListingComponent } from "../shared/card-listing/card-listing.component";

@Component({
  selector: 'app-home',
  imports: [FaIconComponent, CardListingComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  tenantListingService = inject(TenantListingService);
  toastService = inject(ToastService);
  categoryService = inject(CategoryService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  listings: Array<CardListing> | undefined;

  pageRequest : Pagination = {size:20, page:0, sort:[]};

  loading = false;

  categoryServiceSubscription : Subscription | undefined;

  ngOnDestroy(): void {
    this.tenantListingService.resetGetAllByCategory();
    if(this.categoryServiceSubscription){
      this.categoryServiceSubscription.unsubscribe();
    }
  }
  constructor() { 
    this.listenToGetAllCategory();
  }
  
  ngOnInit(): void {
    this.listenToChangeCategory();  
  }

  private listenToChangeCategory() {
    this.categoryServiceSubscription = this.categoryService.changeCategoryObs.subscribe({
      next: (category:Category) => {
        this.loading = true;
        this.tenantListingService.getAllByCategory(category.technicalName, this.pageRequest);
      }
    });
  }

  listenToGetAllCategory() {
    effect(() => {
      const categoryListingState = this.tenantListingService.getAllByCategorySig();
      if(categoryListingState.status === "OK"){
        this.listings = categoryListingState.value?.content;
        this.loading = false;
      } else if(categoryListingState.status === "ERROR"){
        this.toastService.send({
          severity: "error", summary :"Error", detail: categoryListingState.error?.message});
        this.loading = false;
      }
    });
  }
}
