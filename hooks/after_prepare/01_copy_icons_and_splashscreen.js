#!/usr/bin/env node

//
// This hook copies various resource files from our version control system directories into the appropriate platform specific location
//


// configure all the files to copy.  Key of object is the source file, value is the destination location.  It's fine to put all platforms' icons and splash screen files here, even if we don't build for all platforms on each developer's box.
var filestocopy = [{
    "www/img/logo_ga_96x96.png": "/platforms/android/res/drawable/icon.png"
}, {
    "www/img/logo_ga_96x96.png": "/platforms/android/res/drawable-hdpi/icon.png"
}, {
    "www/img/logo_ga_96x96.png": "/platforms/android/res/drawable-ldpi/icon.png"
}, {
    "/www/img/logo_ga_96x96.png": "/platforms/android/res/drawable-mdpi/icon.png"
}, {
    "/www/img/logo_ga_96x96.png": "/platforms/android/res/drawable-xhdpi/icon.png"
}, {
    "/www/img/logo_ga_200x200.png": "/platforms/android/res/drawable/splash.png"
}, {
    "/www/img/logo_ga_200x200.png": "/platforms/android/res/drawable-hdpi/splash.png"
}, {
    "/www/img/logo_ga_200x200.png": "/platforms/android/res/drawable-ldpi/splash.png"
}, {
    "/www/img/logo_ga_200x200.png": "/platforms/android/res/drawable-mdpi/splash.png"
}, {
    "/www/img/logo_ga_200x200.png": "/platforms/android/res/drawable-xhdpi/splash.png"
}, /**{
    "/www/img/logo_ga_96x96.png": "/platforms/ios/Flight\ Monitoring/Resources/icons/icon-72.png"
}, {
    "/www/img/logo_ga_96x96.png": "/platforms/ios/Flight\ Monitoring/Resources/icons/icon.png"
}, {
    "/www/img/logo_ga_96x96.png": "/platforms/ios/Flight\ Monitoring/Resources/icons/icon@2x.png"
}, {
    "/www/img/logo_ga_96x96.png": "/platforms/ios/Flight\ Monitoring/Resources/icons/icon-72@2x.png"
}, {
    "/www/img/logo_ga_200x200.png": "/platforms/ios/Flight\ Monitoring/Resources/splash/Default@2x~iphone.png"
}, {
    "/www/img/logo_ga_200x200.png": "/platforms/ios/Flight\ Monitoring/Resources/splash/Default-568h@2x~iphone.png"
}, {
    "/www/img/logo_ga_200x200.png": "/platforms/ios/Flight\ Monitoring/Resources/splash/Default~iphone.png"
}, {
    "/www/img/logo_ga_200x200.png": "/platforms/ios/Flight\ Monitoring/Resources/splash/Default-Portrait~ipad.png"
}, {
    "/www/img/logo_ga_200x200.png": "/platforms/ios/Flight\ Monitoring/Resources/splash/Default-Portrait@2x~ipad.png"
},*/ ];

var fs = require('fs');
var path = require('path');

// no need to configure below
var rootdir = process.argv[2];

filestocopy.forEach(function(obj) {
    Object.keys(obj).forEach(function(key) {
        var val = obj[key];
        var srcfile = path.join(rootdir, key);
        var destfile = path.join(rootdir, val);
        //console.log("copying "+srcfile+" to "+destfile);
        var destdir = path.dirname(destfile);
        if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
            fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
        }
    });
});
