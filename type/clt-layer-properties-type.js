class CLTLayerPropertiesType {
    constructor(data) {
        this.index = data.index;
        this.thickness = data.thickness;
        this.orientation = data.orientation;
        this.grade = data.grade;
        this.E = data.E;
        this.G = data.G;
        this.y_ci = data.y_ci;
        this.d = data.d;
        this.I = data.I;
        this.A = data.A;
        this.contribution = data.contribution;
        this.gamma = data.gamma || null;
    }
}
