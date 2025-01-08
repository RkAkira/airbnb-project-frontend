import { CategoryService } from './category.service';
import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Category } from './category.model';

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

    ngOnInit(): void {
      //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
      //Add 'implements OnInit' to the class.
      this.fetchCategories();
    }

    private fetchCategories() {
      this.categories = this.categoryService.getCategories();
    }

}
