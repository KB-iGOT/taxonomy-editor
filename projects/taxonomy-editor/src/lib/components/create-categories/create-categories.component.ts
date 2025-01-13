import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit, Input, Output , EventEmitter} from '@angular/core';
import { UntypedFormArray, FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { labels } from '../../labels/strings'


@Component({
  selector: 'lib-create-categories',
  templateUrl: './create-categories.component.html',
  styleUrls: ['./create-categories.component.scss']
})
export class CreateCategoriesComponent implements OnInit {
  @Input() taxonomyInfo:any
  @Output() updateCategory = new EventEmitter()
  @Output() removeCategories = new EventEmitter()
  @Output() changePosition = new EventEmitter()

  createCategoriesForm: UntypedFormGroup

  app_strings: any = labels;
  
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit() { 
   this.createCategoriesForm = this.fb.group({
      categories:this.fb.array([])
    })
    if(this.taxonomyInfo){
      this.initCategoryForm()
      } else {
      this.addCategory()
    }
  }
  categories(): UntypedFormArray {
    return this.createCategoriesForm.get('categories') as UntypedFormArray
  }

  newCategories(): UntypedFormGroup {  
    return this.fb.group({  
      name:'',  
    })  
  }  

  addCategory() {  
    this.categories().push(this.newCategories());  
  }  
     
  removeCategory(i:number) {  
    this.categories().removeAt(i);  
    this.removeCategories.emit(i)
  }  

  initCategoryForm(){
    for(var cat of this.taxonomyInfo){
      this.categories().push(
      this.fb.group({
          name:cat.name
        })
      );  
    }
  }

  saveForm() {
    this.updateCategory.emit(this.createCategoriesForm.value.categories)
  }

  emitCategory(event){
    this.updateCategory.emit(event.target.value)
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.changePosition.emit({cur:event.currentIndex, prev:event.previousIndex})
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
}
