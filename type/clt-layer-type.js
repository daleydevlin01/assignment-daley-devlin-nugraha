class CLTLayerType {
    constructor(grade, thickness, orientation) {
        this.grade = grade;
        this.thickness = thickness;
        this.orientation = orientation;
    }

    getMaterialProperties() {
        return MaterialGrade.getGrade(this.grade);
    }

    getE() {
        const props = this.getMaterialProperties();
        if (!props) return 0;
        return this.orientation === 0 ? props.E : props.E_90;
    }

    getG() {
        const props = this.getMaterialProperties();
        if (!props) return 0;
        return this.orientation === 0 ? props.G : props.G_90;
    }
}
