import { Component } from '@angular/core';
import { BaseModalComponent } from '../../../../../core/components/base-modal/base-modal.component';
import { ModalPayload } from '../../../../../core/models/modal/modal-payload';
import { OfflineGain } from '../../../models/game';

@Component({
  selector: 'app-offline-gains-modal',
  templateUrl: './offline-gains-modal.component.html',
  styleUrls: ['./offline-gains-modal.component.scss'],
})
export class OfflineGainsModalComponent extends BaseModalComponent<OfflineGain> {
  constructor() {
    super();
  }

  handleClose(event: ModalPayload) {
    this.onClose(event);
  }
}
