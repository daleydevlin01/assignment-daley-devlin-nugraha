class CLTLayupType {
    constructor(layers, beff, length) {
        this.layers = layers;
        this.beff = beff;
        this.length = length;
    }

    getLayers() {
        return this.layers;
    }

    isSymmetric() {
        const n = this.layers.length;
        for (let i = 0; i < Math.floor(n / 2); i++) {
            const kiri = this.layers[i];
            const kanan = this.layers[n - 1 - i];
            if (kiri.thickness !== kanan.thickness ||
                kiri.orientation !== kanan.orientation ||
                kiri.grade !== kanan.grade) {
                return false;
            }
        }
        return true;
    }
}
