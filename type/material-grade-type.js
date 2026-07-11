const MATERIAL_GRADES = {
    'MGP10': { E: 1100, E_90: 110, G: 687.5, G_90: 62.5 },
    'MGP12': { E: 1100, E_90: 110, G: 687.5, G_90: 62.5 },
};

class MaterialGrade {
    static getGrade(gradeName) {
        return MATERIAL_GRADES[gradeName] || null;
    }
}
