import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { TaxonomyEditorComponent } from './taxonomy-editor.component'
import { ReactiveFormsModule } from '@angular/forms'
import { TaxonomyEditorRoutingModule } from './taxonomy-editor-routing.module'

import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material'
import { MatIconModule } from '@angular/material/icon'
import {MatCardModule} from '@angular/material/card';

import { DashboardComponent } from './containers/dashboard/dashboard.component'
import { FrameworkService } from './services/framework.service'
import { CreateCategoriesComponent } from './components/create-categories/create-categories.component'
import { ConfigFrameworkComponent } from './containers/config-framework/config-framework.component'
import { TaxonomyViewComponent } from './components/taxonomy-view/taxonomy-view.component'
import { TermCardComponent } from './components/term-card/term-card.component'

@NgModule({
  declarations: [
    TaxonomyEditorComponent,
    DashboardComponent,
    ConfigFrameworkComponent,
    CreateCategoriesComponent,
    ConfigFrameworkComponent,
    TaxonomyViewComponent,
    TermCardComponent,
  ],
  imports: [
    BrowserModule,
    TaxonomyEditorRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatCardModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    FrameworkService,
  ],
  exports: [
    TaxonomyEditorComponent,
    CreateCategoriesComponent,
    ConfigFrameworkComponent,
    TaxonomyViewComponent,
    TermCardComponent,
  ]
})
export class TaxonomyEditorModule { }
