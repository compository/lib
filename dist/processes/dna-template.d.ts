import { CompositoryService } from '../services/compository-service';
import { Hashed, ZomeDef } from '../types/dnas';
export declare function createDnaTemplate(compositoryService: CompositoryService, dnaTemplateName: string, zomeDefs: Array<Hashed<ZomeDef>>): Promise<string>;
