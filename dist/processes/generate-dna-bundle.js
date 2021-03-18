export async function generateDnaBundle(compositoryService, dnaTemplate, uuid, properties) {
    // Fetch all zomes for that template
    const promises = dnaTemplate.zome_defs.map(async (zome_def) => {
        try {
            return fetchZome(compositoryService, zome_def.zome_def_hash);
        }
        catch (e) {
            // TODO: if we get an error, it means that the Files have not yet gossiped.
            // Remove this when sharding is implemented
            return undefined;
        }
    });
    const maybeZomes = await Promise.all(promises);
    const zomes = maybeZomes.filter(z => !!z);
    // Prepare the arguments
    const codesPromises = zomes.map((zome) => zome.file.arrayBuffer());
    const codes = await Promise.all(codesPromises);
    const resources = codes.reduce((acc, next, i) => ({
        ...acc,
        [zomes[i].zomeDef.name]: Array.from(new Uint8Array(next)),
    }), {});
    // Create bundle
    const dnaBundle = {
        manifest: {
            manifest_version: '1',
            name: dnaTemplate.name,
            uuid,
            properties,
            zomes: zomes.map(zome => ({
                name: zome.zomeDef.name,
                hash: zome.zomeDef.wasm_hash,
                bundled: zome.zomeDef.name,
            })),
        },
        resources,
    };
    return dnaBundle;
}
async function fetchZome(compositoryService, zomeDefHash) {
    const zomeDef = await compositoryService.getZomeDef(zomeDefHash);
    const file = await compositoryService.downloadFile(zomeDef.wasm_file);
    return { zomeDef, file };
}
//# sourceMappingURL=generate-dna-bundle.js.map