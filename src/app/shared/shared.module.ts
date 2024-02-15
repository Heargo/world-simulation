import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './components/modal/modal.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MutationObserverDirective } from './directives/mutation-observer.directive';

@NgModule({
  declarations: [
    ModalComponent,
    ConfirmModalComponent,
    MutationObserverDirective,
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    ModalComponent,
    ConfirmModalComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MutationObserverDirective,
  ],
})
export class SharedModule {}
