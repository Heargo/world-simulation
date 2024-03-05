import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseAppComponent } from '../base-app/base-app.component';
import { ModalPayload } from '../../models/modal/modal-payload';
import {
  DEFAULT_MODAL_OPTIONS,
  ModalOptions,
} from '../../models/modal/modal-options';

@Component({
  template: '',
})
export class BaseModalComponent<T> extends BaseAppComponent {
  @Input() options: ModalOptions<T> = DEFAULT_MODAL_OPTIONS;

  @Output() closeEvent = new EventEmitter<ModalPayload>();

  constructor() {
    super();
  }

  onClose(event: ModalPayload) {
    this.closeEvent.emit(event);
  }
}
