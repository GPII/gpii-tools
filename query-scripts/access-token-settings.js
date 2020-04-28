/*

    Usage:

    node access-token-settings.js prd 34523-adf23-asdfa3454

    "prd" is one of the configs from the `configs` hash below.
    The second argument is your `gpiiKey`

    If you are connecting to a dev server without a fully signed cert
    you may need to use:
    ```bash
    NODE_TLS_REJECT_UNAUTHORIZED=0 node access-token-settings.js dev 34523-adf23-asdfa3454
    ```
    Don't use this for production data.

 */

var axios = require("axios"),
    fluid = require("infusion"),
    minimist = require("minimist");

var configs = {
    // An example for dev clusters. Change sgithens to your gcp name
    localhost: {
        serverUrl: "http://localhost:8081",
        clientId: "pilot-computer",
        clientSecret: "pilot-computer-secret",
        username: "alice"
    },
    dev: {
        serverUrl: "https://flowmanager.sgithens.dev.gcp.gpii.net",
        clientId: "pilot-computer",
        clientSecret: "pilot-computer-secret",
        username: "alice"
    },
    prd: {
        serverUrl: "https://flowmanager.prd.gcp.gpii.net",
        clientId: "pilot-computer",
        clientSecret: "pilot-computer-secret",
        username: "alice"
    },
    stg: {
        serverUrl: "https://flowmanager.stg.gcp.gpii.net",
        clientId: "pilot-computer",
        clientSecret: "pilot-computer-secret",
        username: "alice"
    }
}

function getAccessToken (configInfo) {
    var promTogo = fluid.promise();
    axios.post(configInfo.serverUrl + "/access_token", {
        grant_type: "password",
        client_id: configInfo.clientId,
        client_secret: configInfo.clientSecret,
        username: configInfo.username,
        password: "anystring"
    }).then(function (res) {
        promTogo.resolve(res.data.access_token);
    }, function (err) {
        promTogo.reject(err.response);
    });
    return promTogo;
};

var win32device = {"OS":{"id":"win32"}, "solutions": [
    { "id": "com.freedomscientific.magic" },
    { "id": "com.microsoft.windows.brightness" },
    { "id": "com.microsoft.windows.desktopBackground" },
    { "id": "com.freedomscientific.jaws" },
    { "id": "com.microsoft.windows.desktopBackgroundColor" },
    { "id": "com.microsoft.windows.mirrorScreen" },
    { "id": "com.microsoft.windows.cursors" },
    { "id": "com.microsoft.windows.filterKeys" },
    { "id": "com.microsoft.windows.highContrast" },
    { "id": "com.microsoft.windows.audioDescription" },
    { "id": "com.microsoft.windows.notificationDuration" },
    { "id": "com.microsoft.windows.language" },
    { "id": "com.microsoft.windows.toggleKeys" },
    { "id": "com.microsoft.windows.underlineMenuShortcuts" },
    { "id": "com.microsoft.windows.shortcutWarningMessage" },
    { "id": "com.microsoft.windows.shortcutWarningSound" },
    { "id": "com.microsoft.windows.magnifier" },
    { "id": "com.microsoft.windows.mouseKeys" },
    { "id": "com.microsoft.windows.mouseSettings" },
    { "id": "com.microsoft.windows.mouseTrailing" },
    { "id": "com.microsoft.windows.narrator" },
    { "id": "com.microsoft.windows.nightScreen" },
    { "id": "com.microsoft.windows.soundSentry" },
    { "id": "com.microsoft.windows.onscreenKeyboard" },
    { "id": "com.microsoft.windows.screenDPI" },
    { "id": "com.microsoft.windows.screenResolution" },
    { "id": "com.microsoft.windows.stickyKeys" },
    { "id": "com.microsoft.windows.touchPadSettings" },
    { "id": "com.microsoft.windows.typingEnhancement" },
    { "id": "com.microsoft.windows.volumeControl" },
    { "id": "com.office.windowsOneNoteLearningTools" },
    { "id": "com.office.windowsWordHome365LearningTools" },
    { "id": "com.office.windowsWordPro365LearningTools" },
    { "id": "com.texthelp.readWriteGold" },
    { "id": "net.gpii.test.speechControl" },
    { "id": "net.gpii.explode" },
    { "id": "net.gpii.uioPlus" },
    { "id": "org.nvda-project" },
    { "id": "com.microsoft.office" }
]};

function getSettings (configInfo) {
    var promTogo = fluid.promise();

    var deviceInfo = encodeURI(JSON.stringify(win32device));

    axios.get(configInfo.serverUrl + "/" + configInfo.username + "/settings/" + deviceInfo, {
        headers: {
            "Authorization": "Bearer " + configInfo.accessToken
        }
    }).then(function (res) {
        promTogo.resolve(res.data.preferences);
        // console.log(JSON.stringify(res.data.preferences, null, 4));
    }, function (err) {
        promTogo.reject(err);
    });

    return promTogo;
};

function getAccessTokenAndSettings (configInfo) {
    var promTogo = fluid.promise();
    getAccessToken(configInfo).then(
        function (data) {
            configInfo.accessToken = data;
            getSettings(configInfo).then(
                function (prefsSettings) {
                    promTogo.resolve({
                        accessToken: configInfo.accessToken,
                        prefsSettings: prefsSettings
                    });
                },
                promTogo.reject
            )
        },
        promTogo.reject
    )

    return promTogo;
}

function main() {
    var args = minimist(process.argv.slice(2))["_"];
    var config = fluid.copy(configs[args[0]]);
    config.username = args[1];
    getAccessTokenAndSettings(config).then(function (data) {
    // getAccessToken(config).then(function (data) {
        console.log(JSON.stringify(data, null, 4))
    }, function (err) {
        console.log("Error: ", err);
    });
}

main();

// console.log(encodeURI(JSON.stringify(win32device)));

// %7B%22OS%22:%7B%22id%22:%22win32%22%7D,%22solutions%22:%5B%7B%22id%22:%22com.freedomscientific.magic%22%7D,%7B%22id%22:%22com.microsoft.windows.brightness%22%7D,%7B%22id%22:%22com.microsoft.windows.desktopBackground%22%7D,%7B%22id%22:%22com.freedomscientific.jaws%22%7D,%7B%22id%22:%22com.microsoft.windows.desktopBackgroundColor%22%7D,%7B%22id%22:%22com.microsoft.windows.mirrorScreen%22%7D,%7B%22id%22:%22com.microsoft.windows.cursors%22%7D,%7B%22id%22:%22com.microsoft.windows.filterKeys%22%7D,%7B%22id%22:%22com.microsoft.windows.highContrast%22%7D,%7B%22id%22:%22com.microsoft.windows.audioDescription%22%7D,%7B%22id%22:%22com.microsoft.windows.notificationDuration%22%7D,%7B%22id%22:%22com.microsoft.windows.language%22%7D,%7B%22id%22:%22com.microsoft.windows.toggleKeys%22%7D,%7B%22id%22:%22com.microsoft.windows.underlineMenuShortcuts%22%7D,%7B%22id%22:%22com.microsoft.windows.shortcutWarningMessage%22%7D,%7B%22id%22:%22com.microsoft.windows.shortcutWarningSound%22%7D,%7B%22id%22:%22com.microsoft.windows.magnifier%22%7D,%7B%22id%22:%22com.microsoft.windows.mouseKeys%22%7D,%7B%22id%22:%22com.microsoft.windows.mouseSettings%22%7D,%7B%22id%22:%22com.microsoft.windows.mouseTrailing%22%7D,%7B%22id%22:%22com.microsoft.windows.narrator%22%7D,%7B%22id%22:%22com.microsoft.windows.nightScreen%22%7D,%7B%22id%22:%22com.microsoft.windows.soundSentry%22%7D,%7B%22id%22:%22com.microsoft.windows.onscreenKeyboard%22%7D,%7B%22id%22:%22com.microsoft.windows.screenDPI%22%7D,%7B%22id%22:%22com.microsoft.windows.screenResolution%22%7D,%7B%22id%22:%22com.microsoft.windows.stickyKeys%22%7D,%7B%22id%22:%22com.microsoft.windows.touchPadSettings%22%7D,%7B%22id%22:%22com.microsoft.windows.typingEnhancement%22%7D,%7B%22id%22:%22com.microsoft.windows.volumeControl%22%7D,%7B%22id%22:%22com.office.windowsOneNoteLearningTools%22%7D,%7B%22id%22:%22com.office.windowsWordHome365LearningTools%22%7D,%7B%22id%22:%22com.office.windowsWordPro365LearningTools%22%7D,%7B%22id%22:%22com.texthelp.readWriteGold%22%7D,%7B%22id%22:%22net.gpii.test.speechControl%22%7D,%7B%22id%22:%22net.gpii.explode%22%7D,%7B%22id%22:%22net.gpii.uioPlus%22%7D,%7B%22id%22:%22org.nvda-project%22%7D,%7B%22id%22:%22com.microsoft.office%22%7D%5D%7D
