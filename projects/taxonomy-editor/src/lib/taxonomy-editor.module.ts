import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { TaxonomyEditorComponent } from './taxonomy-editor.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { TaxonomyEditorRoutingModule } from './taxonomy-editor-routing.module'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatLegacyFormFieldModule as MatFormFieldModule, MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/legacy-form-field'
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button'
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyRadioButton as MatRadioButton, MatLegacyRadioGroup as MatRadioGroup, MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelect as MatSelect, MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatIconModule } from '@angular/material/icon'
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog'
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyTabsModule as MatTabsModule, MAT_LEGACY_TABS_CONFIG as MAT_TABS_CONFIG } from '@angular/material/legacy-tabs';
import { MatLegacySnackBarModule as MatSnackBarModule, MAT_LEGACY_SNACK_BAR_DEFAULT_OPTIONS as MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/legacy-snack-bar';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';


import { DashboardComponent } from './containers/dashboard/dashboard.component'
import { FrameworkService } from './services/framework.service'
import { CreateCategoriesComponent } from './components/create-categories/create-categories.component'
import { ConfigFrameworkComponent } from './containers/config-framework/config-framework.component'
import { TaxonomyViewComponent } from './components/taxonomy-view/taxonomy-view.component'
import { TermCardComponent } from './components/term-card/term-card.component'
import { CommonModule } from '@angular/common';
import { CategoriesPreviewComponent } from './components/categories-preview/categories-preview.component'
import { ConnectorService } from './services/connector.service'
import { CreateTermComponent } from './components/create-term/create-term.component';
import { TaxonomyColumnViewComponent } from './components/taxonomy-column-view/taxonomy-column-view.component'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { TokenInterceptorService } from './services/token-interceptor.service'
import { ConnectorComponent } from './components/connector/connector.component'
import { IConnection } from './models/connection.model'
import { LocalConnectionService } from './services/local-connection.service'
import { ENVIRONMENT } from './services/connection.service'
// export const LIB_OPTIONS = new InjectionToken<IConnection>('env')
import { ActionBarComponent } from './components/action-bar/action-bar.component'
import { IConnectionType } from './models/connection-type.model'
import { ApprovalComponent } from './components/approval/approval.component';
import { PendingApprovalComponent } from './components/pending-approval/pending-approval.component';
import { ApproveViewComponent } from './components/approve-view/approve-view.component';
import { OrderByPipe } from './pipes/order-by.pipe';
import { DatePipe } from './pipes/date.pipe';
import { CreateTermFromFrameworkComponent } from './components/create-term-from-framework/create-term-from-framework.component'
import { OdcsService } from './services/odcs.service';
import { ConforamtionPopupComponent } from './components/conforamtion-popup/conforamtion-popup.component'

@NgModule({
    declarations: [
        TaxonomyEditorComponent,
        DashboardComponent,
        ConfigFrameworkComponent,
        CreateCategoriesComponent,
        ConfigFrameworkComponent,
        TaxonomyViewComponent,
        TermCardComponent,
        TaxonomyColumnViewComponent,
        CategoriesPreviewComponent,
        CategoriesPreviewComponent,
        CreateTermComponent,
        ConnectorComponent,
        ActionBarComponent,
        ApprovalComponent,
        PendingApprovalComponent,
        ApproveViewComponent,
        OrderByPipe,
        DatePipe,
        ConforamtionPopupComponent,
        CreateTermFromFrameworkComponent,
    ],
    imports: [
        CommonModule,
        TaxonomyEditorRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatButtonModule,
        MatMenuModule,
        MatInputModule,
        MatIconModule,
        MatCardModule,
        MatDialogModule,
        DragDropModule,
        MatAutocompleteModule,
        MatSelectModule,
        HttpClientModule,
        MatTabsModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatChipsModule,
        MatTableModule,
        MatProgressSpinnerModule,
        MatExpansionModule,
        MatRadioModule,
    ],
    providers: [
        { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
        // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2000 } },
        { provide: MAT_TABS_CONFIG, useValue: { animationDuration: '0ms' } },
        FrameworkService,
        ConnectorService,
        LocalConnectionService,
        OdcsService,
    ],
    exports: [
        TaxonomyEditorComponent,
        CreateCategoriesComponent,
        ConfigFrameworkComponent,
        TaxonomyViewComponent,
        TermCardComponent,
        CategoriesPreviewComponent
    ]
})
export class TaxonomyEditorModule {
  static forRoot(config: IConnectionType): ModuleWithProviders<TaxonomyEditorModule> {
    return {
      ngModule: TaxonomyEditorModule,
      providers: [
        // LocalConnectionService,
        {
          provide: ENVIRONMENT,
          useValue: config
        }
      ]
    };
  }
}
