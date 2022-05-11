const fs = require('fs');
const core = require('@actions/core');


async function main() {
    const input = core.getInput('coverage_file', { required: true, trimWhitespace: true });
    const coverage = core.getInput('coverage_threshold', { required: true, trimWhitespace: true });

    const lines = JSON.parse(fs.readFileSync(input, 'utf8'));
    const results = [
        [{data: 'Package', header: true}, {data: 'Coverage', header: true}]
    ]

    for(const line of lines ){
        if(line.Output && line.Output.startsWith('coverage')){
            const coverage_value = line.Output.split(' ')[1].split('%')[0];
            if(coverage_value < coverage){
                results.push([`<span style="color:darkred">${line.Package}</span>`, line.Output.split(':')[1].trim()])
            } else {
                results.push([`<span style="color:green">${line.Package}</span>`, line.Output.split(':')[1].trim()]);
            }
        }
    }

    await core.summary
        .addHeading('Code Coverage Report')
        .addTable(results)
        .addLink('Code Coverage Rules', 'https://github.com/actions/code-coverage-rules')
        .write();
}

main()
