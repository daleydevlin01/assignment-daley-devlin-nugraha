class PanelProperties {
    calculate(cltLayup, method) {
        if (method === 'ShearAnalogy') {
            return new ShearAnalogyMethod().calculate(cltLayup);
        } else if (method === 'Gamma') {
            return new GammaMethod().calculate(cltLayup);
        }
        throw new Error('Metode tidak dikenal');
    }
}

class ShearAnalogyMethod extends PanelProperties {
    calculate(cltLayup) {
        const layers = cltLayup.getLayers();
        const beff = cltLayup.beff;
        const n = layers.length;

        if (n < 3 || n > 9 || n % 2 === 0) {
            throw new Error('Shear Analogy harus 3-9 layer (ganjil)');
        }
        if (!cltLayup.isSymmetric()) {
            throw new Error('Shear Analogy wajib simetris atas-bawah');
        }

        let y_ci = [];
        let totalTebal = 0;
        for (let i = 0; i < n; i++) {
            const t = layers[i].thickness;
            y_ci.push(totalTebal + t / 2);
            totalTebal += t;
        }

        const EA = layers.map(layer => layer.getE() * beff * layer.thickness);
        let sumEA = 0, sumEA_y = 0;
        for (let i = 0; i < n; i++) {
            sumEA += EA[i];
            sumEA_y += EA[i] * y_ci[i];
        }
        const y_bar = sumEA_y / sumEA;

        let EI_eff = 0;
        const details = [];
        for (let i = 0; i < n; i++) {
            const layer = layers[i];
            const t = layer.thickness;
            const E = layer.getE();
            const A = beff * t;
            const I = beff * Math.pow(t, 3) / 12;
            const d = y_ci[i] - y_bar;
            const contrib = E * (I + A * d * d);
            EI_eff += contrib;

            details.push(new CLTLayerPropertiesType({
                index: i + 1,
                thickness: t,
                orientation: layer.orientation,
                grade: layer.grade,
                E: E,
                G: layer.getG(),
                y_ci: y_ci[i],
                d: d,
                I: I,
                A: A,
                contribution: contrib
            }));
        }

        const result = new PanelPropertiesType();
        result.method = 'Shear Analogy';
        result.EI_eff = EI_eff;
        result.layerDetails = details;
        result.totalThickness = totalTebal;
        result.beff = beff;
        result.length = cltLayup.length;
        return result;
    }
}

class GammaMethod extends PanelProperties {
    calculate(cltLayup) {
        const layers = cltLayup.getLayers();
        const beff = cltLayup.beff;
        const L = cltLayup.length;
        const n = layers.length;

        if (n !== 3 && n !== 5) {
            throw new Error('Gamma method hanya bisa 3 atau 5 layer');
        }

        let y_ci = [];
        let totalTebal = 0;
        for (let i = 0; i < n; i++) {
            const t = layers[i].thickness;
            y_ci.push(totalTebal + t / 2);
            totalTebal += t;
        }

        const gamma = layers.map((layer) => {
            const E = layer.getE();
            const G = layer.getG();
            const t = layer.thickness;
            if (L === 0) throw new Error('Panjang tidak boleh 0');
            const denom = 1 + (Math.PI * Math.PI * E * t) / (G * L * L);
            return 1 / denom;
        });

        const EA_gamma = layers.map((layer, i) => {
            return layer.getE() * beff * layer.thickness * gamma[i];
        });

        let sumEA = 0, sumEA_y = 0;
        for (let i = 0; i < n; i++) {
            sumEA += EA_gamma[i];
            sumEA_y += EA_gamma[i] * y_ci[i];
        }
        const y_bar = sumEA_y / sumEA;

        let EI_eff = 0;
        const details = [];
        for (let i = 0; i < n; i++) {
            const layer = layers[i];
            const t = layer.thickness;
            const E = layer.getE();
            const A = beff * t;
            const I = beff * Math.pow(t, 3) / 12;
            const d = y_ci[i] - y_bar;
            const contrib = E * (I + gamma[i] * A * d * d);
            EI_eff += contrib;

            details.push(new CLTLayerPropertiesType({
                index: i + 1,
                thickness: t,
                orientation: layer.orientation,
                grade: layer.grade,
                E: E,
                G: layer.getG(),
                y_ci: y_ci[i],
                d: d,
                I: I,
                A: A,
                contribution: contrib,
                gamma: gamma[i]
            }));
        }

        const result = new PanelPropertiesType();
        result.method = 'Gamma';
        result.EI_eff = EI_eff;
        result.layerDetails = details;
        result.totalThickness = totalTebal;
        result.beff = beff;
        result.length = L;
        return result;
    }
}
