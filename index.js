const fs = require('fs');

class TransformManifestPlugin {
    constructor(options) {
        this.name = 'TransformManifestPlugin';
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tapPromise(this.name, this.handle.bind(this));
    }

    async handle() {
        this.getFiles();
        this.transform();
        this.writeFile();
    }

    getFiles() {
        this.manifest = {
            with: this.options.input.withTransform.map(item => {
                return {
                    file: require(item.file),
                    path: item.path
                };
            }),
            without: this.options.input.withoutTransform.map(path => require(path))
        };
    }

    transform() {
        this.manifest.with.forEach(item => {
            Object.keys(item.file).forEach(key => {
                item.file[key] = `${item.path}${item.file[key]}`;
            });
        });

        this.manifest.with = this.manifest.with.map(item => item.file);
    }

    concatObjectsFromArray(arr) {
        return arr.reduce((acc, cur) => ({ ...acc, ...cur }), {});
    }

    get result() {
        let result = {
            ...this.concatObjectsFromArray(this.manifest.with),
            ...this.concatObjectsFromArray(this.manifest.without)
        };

        return JSON.stringify(result, '', 2);
    }

    writeFile() {
        fs.writeFile(this.options.output, this.result, err => {
            if (err) throw err;
        });
    }
}

module.exports = TransformManifestPlugin;