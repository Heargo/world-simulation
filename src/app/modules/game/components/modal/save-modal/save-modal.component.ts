import { Component } from '@angular/core';
import { BaseModalComponent } from '../../../../../core/components/base-modal/base-modal.component';
import { ModalPayload } from '../../../../../core/models/modal/modal-payload';

@Component({
  selector: 'app-save-modal',
  templateUrl: './save-modal.component.html',
  styleUrls: ['./save-modal.component.scss'],
})
export class SaveModalComponent extends BaseModalComponent {
  name: string = '';

  constructor() {
    super();
  }

  handleClose(event: ModalPayload) {
    const editedPayload = { ...event, data: this.name };
    this.onClose(editedPayload);
  }
}
