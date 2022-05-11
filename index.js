const fs = require('fs')
const core = require('@actions/core')

async function main() {
    const file = core.getInput('coverage_file', { required: true, trimWhitespace: true })
    const rules = core.getInput('coverage_rules', { required: true, trimWhitespace: true })
    const coverage = core.getInput('coverage_threshold', { required: true, trimWhitespace: true })

    const lines = JSON.parse(fs.readFileSync(file, 'utf8'))
    const results = [
        [{data: 'Package', header: true}, {data: 'Coverage', header: true}, {data: 'Result', header: true}],
    ]

    for(const line of lines ){
        if(line.Output && line.Output.startsWith('coverage')){
            const coverage_value = parseFloat(line.Output.split(' ')[1].split('%')[0])
            if(coverage_value < coverage){
                core.setFailed(`Coverage is below ${coverage}%`)
                results.push([line.Package, line.Output.split(':')[1].trim(), '❌'])
            } else {
                results.push([line.Package, line.Output.split(':')[1].trim(), '✅'])
            }
        }
    }

    await core.summary
        .addHeading('Code Coverage Report')
        .addTable(results)
        .addLink('Code Coverage Guidelines', rules)
        .write()
}

main()
