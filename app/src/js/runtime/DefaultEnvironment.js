let Environment = require('./Environment'),
    MathFeatures = require('./features/MathFeatures'),
    OutputFeatures = require('./features/OutputFeatures'),
    LanguageFeatures = require('./features/LanguageFeatures'),
    InspectionFeatures = require('./features/InspectionFeatures'),
    ComparisonFeatures = require('./features/ComparisonFeatures');

/**
 * Provides an environment with built-in names and functionality
 */
class DefaultEnvironment extends Environment {
    constructor() {
        super();

        new MathFeatures().install(this);
        new OutputFeatures().install(this);
        new LanguageFeatures().install(this);
        new InspectionFeatures().install(this);
        new ComparisonFeatures().install(this);
    }
}

module.exports = DefaultEnvironment;