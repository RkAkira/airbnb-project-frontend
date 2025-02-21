import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CardListing } from '../landlord/model/listing.model';
import { State } from '../core/model/state.model';
import { createPaginationOption, Page, Pagination } from '../core/model/request.model';
import { CategoryName } from '../layout/navbar/category/category.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TenantListingService {

  http = inject(HttpClient);
  
  private getAllByCategory$: WritableSignal<State<Page<CardListing>>> 
  = signal(State.Builder<Page<CardListing>>().forInit());
  getAllByCategorySig = computed(() => this.getAllByCategory$());
 
  getAllByCategory(category: CategoryName, pageRequest: Pagination ) {
    let params = createPaginationOption(pageRequest);
    this.http.get<Page<CardListing>>(`${environment.API_URL}/tenant-listing/get-all-by-category`, {params})
    .subscribe({
      next: displayListingCards => 
        this.getAllByCategory$.set(State.Builder<Page<CardListing>>().forSuccess(displayListingCards)),
      error: error =>
        this.getAllByCategory$.set(State.Builder<Page<CardListing>>().forError(error))
    })
  }

  resetGetAllByCategory() {
    this.getAllByCategory$.set(State.Builder<Page<CardListing>>().forInit());
  }
}
