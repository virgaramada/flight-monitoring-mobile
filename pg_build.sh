#!/bin/sh

## build for phonegap build
rm -rf $HOME/Downloads/flight-monitoring-mobile
cp -R $HOME/projects/mobile/flight-monitoring-mobile $HOME/Downloads
$LIPS_WORKSPACE/svn-cleaner.sh $HOME/Downloads/flight-monitoring-mobile .svn
cd $HOME/Downloads/flight-monitoring-mobile

zip -r flight-monitoring-mobile.zip .
mv $HOME/Downloads/flight-monitoring-mobile/flight-monitoring-mobile.zip $HOME/Downloads
rm -rf $HOME/Downloads/flight-monitoring-mobile
exit 1
