/**
 * @fileOverview server socket.io to connect GUI musicplayer with neode.js eeg data processing backend
 *
 */

module.exports = {
    sendCmd,
    doBlinkCmd,
    doP300Cmd,
    doMindCmd,
    streamData,
    startSocketServer,
    closeSocketServer,
    subscribeToP300Cmds,
    subscribeToTrainingCmds
};

const http = require("http");
const port = 3001;
let io;
let app;

/**
 * create socket server on port 3001
 *
 */
function startSocketServer() {
    app = http.createServer();
    io = require("socket.io").listen(app);
    io.set("origins", "http://localhost:*");

    app.listen(port, function () {
        console.log("listening on *:" + port);
    });

    app.on("error", function (e) {
        console.log("error " + e);
    });
}

/**
 * get P300 control flash commands with timestamp into node P300 control
 *
 */
function subscribeToP300Cmds(callbackP300commandCmd) {
    io.on("connection", function (socket) {
        socket.on("P300command", (P300command) => callbackP300commandCmd(P300command));
    });
}

/**
 * mind control training command init
 *
 */
function subscribeToTrainingCmds(callbackTrainingCmd) {
    io.on("connection", function (socket) {
        socket.on("training", (trainingCmd) => callbackTrainingCmd(trainingCmd));
    });
}

/**
 * close server
 *
 */
function closeSocketServer() {
    if(app !== undefined){
        app.close();
    }
}

/**
 * flash command in blink control gui
 *
 */
function sendCmd(command) {
    //emmit command event for each
    io.emit("command", {command: command});
}

/**
 * send execute command for Blink control
 *
 */
function doBlinkCmd(doBlinkcommand) {
    //emmit command event to execute after its detection
    io.emit("doBlinkcommand", {doBlinkcommand: doBlinkcommand});
}

/**
 * send execute command for P300 control
 *
 */
function doP300Cmd(doP300command) {
    //emmit command event to execute after its detection
    io.emit("doP300command", {doP300command: doP300command});
}

/**
 * send execute command for mind control
 *
 */
function doMindCmd(doMindcommand) {
    //emmit command event to execute after its detection
    io.emit("doMindcommand", {doMindcommand: doMindcommand});
}

/**
 * stream eeg data via sockets (used to plot)
 *
 */
function streamData(sample) {
    //stream bci data to client
    io.emit("sample", {sample: sample});
}
