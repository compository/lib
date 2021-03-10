import { Dictionary } from '@holochain-open-dev/core-types';
import { CellId } from '@holochain/conductor-api';
import { LitElement } from 'lit-element';
import { Card } from 'scoped-material-components/mwc-card';
import { CircularProgress } from 'scoped-material-components/mwc-circular-progress';
import { List } from 'scoped-material-components/mwc-list';
import { ListItem } from 'scoped-material-components/mwc-list-item';
import { CompositoryService } from '../services/compository-service';
declare const InstalledCells_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost> & typeof import("@open-wc/scoped-elements/types/src/types").ScopedElementsHost;
export declare abstract class InstalledCells extends InstalledCells_base {
    _installedCellIds: Array<CellId>;
    _dnaTemplateNames: Dictionary<string>;
    firstUpdated(): void;
    abstract get _compositoryService(): CompositoryService;
    get compositoryDnaHash(): string;
    loadCellsIds(): Promise<void>;
    fetchDnaTemplateNames(instantiatedDnaHashes: string[]): Promise<Dictionary<string>>;
    getNonCompositoryCellIds(): CellId[];
    render(): import("lit-element").TemplateResult;
    static get styles(): import("lit-element").CSSResult;
    static get scopedElements(): {
        'mwc-list': typeof List;
        'mwc-list-item': typeof ListItem;
        'mwc-card': typeof Card;
        'mwc-circular-progress': typeof CircularProgress;
    };
}
export {};
