import "../operations-boxes/worksheet.scss"
import {getParams} from "../../lib/params.ts";
import {generateProblemSet} from "../../lib/single-digit-problems.ts"
import {renderContent} from "../operations-boxes/renderer.ts";

function getConfig() {
    const params = getParams(['operations', 'allowNegatives', 'blankPart', 'includeTenCarry', 'includeZero'])
    return {
        operations: params.operations ? params.operations.split(',') : [],
        allowNegatives: params.allowNegatives === 'true' || params.allowNegatives === '1',
        includeTenCarry: params.includeTenCarry === 'true' || params.includeTenCarry === '1',
        includeZero: params.includeZero === 'true' || params.includeZero === '1',
        problemCount: 8,
        blankPart: params.blankPart || 'answer'
    }
}

const config = getConfig()
const problemSet = generateProblemSet(config)

renderContent(config, problemSet)
