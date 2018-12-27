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
            with: this.options.input.withTransform || [],
            without: this.options.input.withoutTransform || []
        };

        if (!this.manifest.with.length && !this.manifest.without.length) {
            throw new Error('files not found');
        }

        this.manifest.with = this.manifest.with.map(item => {
            if (!item) return;

            return {
                file: require(item.file),
                path: item.path || '',
                transform: item.transform
            };
        });

        this.manifest.without = this.manifest.without.map(file => {
            if (!file) return;
            return require(file);
        });
    }

    transform() {
        this.manifest.with.forEach(item => {
            Object.keys(item.file).forEach(key => {
                item.file[key] = `${item.path}${item.file[key]}`;
            });
        });

        this.manifest.with.forEach(item => {
            item.transform(item.file);
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