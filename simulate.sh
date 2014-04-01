#!/bin/sh
cd $HOME/projects/mobile/flight-monitoring-mobile
cordova platform remove android
cordova platform add android
ripple emulate

exit 1
