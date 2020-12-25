import { DnaFile } from 'bundle-dna';
import { CompositoryService } from '../services/compository-service';
export declare function generateDna(compositoryService: CompositoryService, dnaTemplateHash: string, uuid: string, properties: any): Promise<DnaFile>;
