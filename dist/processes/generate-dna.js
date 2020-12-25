import { serializeHash } from '@holochain-open-dev/common';
import init, { bundle_dna } from 'bundle_dna';
export async function generateDna(wasmUrl, compositoryService, dnaTemplateHash, uuid, properties) {
    await init(wasmUrl);
    // Get the dna template
    const dnaTemplate = await compositoryService.getDnaTemplate(dnaTemplateHash);
    // Fetch all zomes for that template
    const promises = dnaTemplate.zome_defs.map(async (zome_def) => fetchZome(compositoryService, zome_def.zome_def_hash));
    const zomes = await Promise.all(promises);
    // Prepare the arguments
    const argZomes = zomes.map(zome => [
        zome.zomeDef.name,
        { wasm_hash: Array.from(zome.zomeDef.wasm_hash) },
    ]);
    const codesPromises = zomes.map(zome => zome.file.arrayBuffer());
    const codes = await Promise.all(codesPromises);
    // Bundle the dna
    const dnaFile = await bundle_dna(dnaTemplate.name, uuid, properties, argZomes, codes.map(code => ({ code: Array.from(new Uint8Array(code)) })));
    await compositoryService.publishInstantiatedDna({
        dna_template_hash: dnaTemplateHash,
        instantiated_dna_hash: serializeHash(new Uint8Array(dnaFile.dna.hash)),
        properties,
        uuid,
    });
    debugger;
    return dnaFile;
    // Return the contents
    /* return new File([new Uint8Array([]).buffer], 'generated.dna.gz', {
      type: 'application/octet-stream',
    }); */
}
async function fetchZome(compositoryService, zomeDefHash) {
    const zomeDef = await compositoryService.getZomeDef(zomeDefHash);
    const file = await compositoryService.downloadFile(zomeDef.wasm_file);
    return { zomeDef, file };
}
//# sourceMappingURL=generate-dna.js.map