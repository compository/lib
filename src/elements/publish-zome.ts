import { html, LitElement, property, PropertyValues, query } from 'lit-element';
import { CompositoryScope } from './compository-scope';
import { CompositoryService } from '../services/compository-service';
import { CircularProgress } from 'scoped-material-components/mwc-circular-progress';
import { ScopedElementsMixin as Scoped } from '@open-wc/scoped-elements';
import { importModuleFromFile } from '../processes/import-module-from-file';
import { sharedStyles } from './sharedStyles';
import { TextField } from 'scoped-material-components/mwc-textfield';
import { UploadFiles } from '@holochain-open-dev/file-storage';
import { BaseElement } from '@holochain-open-dev/common';
import { Card } from 'scoped-material-components/mwc-card';
import { Button } from 'scoped-material-components/mwc-button';

export abstract class PublishZome extends BaseElement {
  @query('#zome-name')
  _nameField!: TextField;

  abstract get _compositoryService(): CompositoryService;

  @property({ type: String })
  _zomeWasmHash: string | undefined = undefined;
  _uiBundleHash: string | undefined = undefined;

  get publishDisabled() {
    return !this._zomeWasmHash || !this._nameField || !this._nameField.value;
  }

  async publishZome() {
    if (this._zomeWasmHash) {
      const result = await this._compositoryService.publishZome({
        name: this._nameField.value,
        components_bundle_file: this._uiBundleHash,
        entry_defs: [],
        wasm_file: this._zomeWasmHash,
        wasm_hash: undefined,
        required_membrane_proof: false,
        required_properties: [],
      });
      this.dispatchEvent(
        new CustomEvent('zome-published', {
          detail: {
            zomeDefHash: result,
          },
        })
      );
    }
  }

  render() {
    return html`
      <mwc-card style="width: auto;">
        <div class="column" style="padding: 16px;">
          <span class="title" style="margin-bottom: 16px;">Publish Zome</span>
          <mwc-textfield
            id="zome-name"
            label="Name"
            required
            @input=${() => this.requestUpdate()}
            style="margin-bottom: 16px;"
          ></mwc-textfield>
          <span style="margin-bottom: 8px;">Zome Wasm File</span>
          <upload-files
            one-file
            accepted-files=".wasm"
            @file-uploaded=${(e: CustomEvent) =>
              (this._zomeWasmHash = e.detail.hash)}
          ></upload-files>
          <span style="margin-bottom: 8px; margin-top: 16px;"
            >UI Bundle File</span
          >
          <upload-files
            one-file
            accepted-files=".js"
            @file-uploaded=${(e: CustomEvent) =>
              (this._zomeWasmHash = e.detail.hash)}
          ></upload-files>
          <mwc-button
            style="margin-top: 16px;"
            label="PUBLISH"
            raised
            @click=${() => this.publishZome()}
            .disabled=${this.publishDisabled}
          ></mwc-button>
        </div>
      </mwc-card>
    `;
  }

  getScopedElements() {
    const compositoryService = this._compositoryService;
    return {
      'mwc-textfield': TextField,
      'mwc-button': Button,
      'mwc-card': Card,
      'upload-files': class extends UploadFiles {
        get _fileStorageService() {
          return compositoryService;
        }
      } as any,
    };
  }

  static get styles() {
    return sharedStyles;
  }
}
