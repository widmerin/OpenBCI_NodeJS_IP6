const mathFunctions = require('../functions/mathFunctions');
const p300 = require('./p300');

module.exports = {
    getVEP: detectP300
};

var settings;
var third = 50;
var counter = 0;
var init = true;
var filter = true;
var vppx = {
    play: 0,
    pause: 0,
    next: 0,
    prev: 0,
    volup: 0,
    voldown: 0
};
var nrOfCommands = Object.keys(vppx).length;

function detectP300(volts, command) {

    //skip init phase after first values are in
    if (init) {
        if(counter===0){
            //get Settings only once
            settings = p300.getSettings();
            third = Math.floor(Number(volts.length / 3));
        }
        if(counter===nrOfCommands){
            init = false;
        }
    }

    if(filter) {
        const spawn = require('child_process').spawn;
        const ls = spawn('python', ['src/mnepy/bandpassfilter.py', volts]);

        ls.stdout.on('data', (data) => {
          console.log(`py stdout: ${data}`);
        });

        ls.stderr.on('data', (data) => {
          console.log(`py stderr: ${data}`);
        });

        ls.on('close', (code) => {
          //console.log(`child process exited with code ${code}`);
        });
    }


    // volts is 600ms; for min use 200-600ms "L2"; for max use 400-600ms "L1"
    let voltsL1 = volts.slice(third * 2);
    let voltsL2 = volts.slice(third);

    let max = mathFunctions.getMaxValue(voltsL1);
    let min = mathFunctions.getMinValue(voltsL2);

    let vpp = max - min;

    // add value to dict prop command
    vppx[command] = vpp;
    counter++;

    //after all vppx are newly set again evaluate getCommand()
    if (!init  &&  counter % nrOfCommands === 0 ) {
       counter = 0;
       getCommand();
    }
}

function getCommand() {
    var command = "?";
    var maxVppx = mathFunctions.getMaxValue(Object.values(vppx));
    var median = mathFunctions.getMedian(Object.values(vppx));
    console.log("Object.values(vppx): " + Object.values(vppx));

    if (Number(maxVppx) > (median * settings.threshold)) {

        command = Object.keys(vppx).find(key => vppx[key] === maxVppx);

        if (settings.debug) {
            console.log("command: " + command +
                        "\t median: " + median +
                        "\t maxVppx: " + maxVppx +
                        "\t vppx[maxVppx]: " + Object.keys(vppx).find(key => vppx[key] === maxVppx));
        }
        console.log("p300: \t value: " + maxVppx.toFixed(2) + " on command: " + command + "\t at " + new Date());
    }
}