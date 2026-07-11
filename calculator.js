document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('panelForm');
    const methodSelect = document.getElementById('method');
    const numInput = document.getElementById('numLayers');

    function batasiLayer() {
        const method = methodSelect.value;
        let val = parseInt(numInput.value) || 3;
        if (method === 'Gamma') {
            numInput.max = 5;
            numInput.step = 2;
            if (val > 5) numInput.value = 5;
            if (val % 2 === 0) numInput.value = val - 1;
            if (val < 3) numInput.value = 3;
        } else {
            numInput.max = 9;
            numInput.step = 2;
            if (val > 9) numInput.value = 9;
            if (val % 2 === 0) numInput.value = val - 1;
            if (val < 3) numInput.value = 3;
        }
    }

    methodSelect.addEventListener('change', batasiLayer);
    numInput.addEventListener('change', batasiLayer);

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const method = methodSelect.value;
        const grade = document.getElementById('grade').value;
        const numLayers = parseInt(numInput.value);
        const thickness = parseFloat(document.getElementById('thickness').value);
        const beff = parseFloat(document.getElementById('beff').value);
        const length = parseFloat(document.getElementById('length').value);

        if (method === 'ShearAnalogy') {
            if (numLayers < 3 || numLayers > 9 || numLayers % 2 === 0) {
                alert('Shear Analogy: jumlah layer harus ganjil 3-9.');
                return;
            }
        } else if (method === 'Gamma') {
            if (numLayers !== 3 && numLayers !== 5) {
                alert('Gamma method: hanya 3 atau 5 layer.');
                return;
            }
        }

        const layers = [];
        for (let i = 0; i < numLayers; i++) {
            const orient = (i % 2 === 0) ? 0 : 90;
            layers.push(new CLTLayerType(grade, thickness, orient));
        }

        const cltLayup = new CLTLayupType(layers, beff, length);

        try {
            const panel = new PanelProperties();
            const hasil = panel.calculate(cltLayup, method);
            renderHasil(hasil);
        } catch (err) {
            alert('Error: ' + err.message);
        }
    });

    function renderHasil(result) {
        const container = document.getElementById('resultContainer');
        let html = `<div class="card"><div class="card-header bg-primary text-white fw-bold">${result.method}</div><div class="card-body">`;
        html += `<p><strong>EI eff:</strong> ${result.EI_eff.toFixed(2)} N-mm²/m</p>`;
        html += `<p><strong>Total Tebal:</strong> ${result.totalThickness.toFixed(1)} mm</p>`;
        html += `<p><strong>Lebar Efektif:</strong> ${result.beff} mm</p>`;
        html += `<p><strong>Panjang:</strong> ${result.length} mm</p>`;
        html += `<h5 class="mt-3">Detail Layer</h5><div class="table-responsive"><table class="table table-bordered table-striped">`;
        html += `<thead class="table-dark"><tr><th>#</th><th>Grade</th><th>Tebal</th><th>Orientasi</th><th>E</th><th>G</th>`;
        if (result.method === 'Gamma') html += `<th>γ</th>`;
        html += `<th>d (ke NA)</th><th>Kontribusi</th></tr></thead><tbody>`;

        result.layerDetails.forEach(d => {
            html += `<tr><td>${d.index}</td><td>${d.grade}</td><td>${d.thickness}</td><td>${d.orientation}</td><td>${d.E.toFixed(2)}</td><td>${d.G.toFixed(2)}</td>`;
            if (result.method === 'Gamma') {
                html += `<td>${d.gamma ? d.gamma.toFixed(4) : '-'}</td>`;
            }
            html += `<td>${d.d.toFixed(2)}</td><td>${d.contribution.toFixed(2)}</td></tr>`;
        });

        html += `</tbody></table></div></div></div>`;
        container.innerHTML = html;
    }
});
