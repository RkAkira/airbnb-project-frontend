import { CategoryService } from './category.service';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Category, CategoryName } from './category.model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-category',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent {
    categoryService = inject(CategoryService);

    categories: Category[] | undefined;

    currentActiveCategory: Category  =  this.categoryService.getCategoryByDefault();

    isHome = false;
    router = inject(Router);
    activatedRoute = inject(ActivatedRoute);
    

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.listenRouter();
      this.currentActiveCategory.activated = false;
      this.fetchCategories();
    }

    private fetchCategories() {
      this.categories = this.categoryService.getCategories();
    }

    private listenRouter() {
      this.router.events.pipe(
        filter((evt): evt is NavigationEnd => evt instanceof NavigationEnd)
      )
        .subscribe({
          next: (evt: NavigationEnd) => {
            this.isHome = evt.url.split("?")[0] === "/";
            if (this.isHome && evt.url.indexOf("?") === -1) {
              const categoryByTechnicalName = this.categoryService.getCategoryByTechnicalName("ALL");
              this.categoryService.changeCategory(categoryByTechnicalName!);
            }
          },
        });
  
      this.activatedRoute.queryParams
        .pipe(
          map((params:any) => params["category"])
        )
        .subscribe({
          next: (categoryName: CategoryName) => {
            const category = this.categoryService.getCategoryByTechnicalName(categoryName);
            if (category) {
              this.activateCategory(category);
              this.categoryService.changeCategory(category);
            }
          }
        })
    }

      private activateCategory(category: Category) {
        this.currentActiveCategory.activated = false;
        this.currentActiveCategory = category;
        this.currentActiveCategory.activated = true;
      }

      onChangeCategory(category: Category) {
        this.activateCategory(category);
        this.router.navigate([], { queryParams: { "category": category.technicalName},
        relativeTo: this.activatedRoute });
      } 

}
