in-its-right-place
==================

magically puts files in their right place.

[![Build Status](https://travis-ci.org/iamdoron/in-its-right-place.png?Branch=master)](https://travis-ci.org/iamdoron/in-its-right-place)

## What
it *continuesly* takes files from a source folder (flat, no directories) and organize them according to the folders within a given destination.

for example, if you have some files called: 'beach party 2013 01.jpeg', 'beach party 2013 02.jpeg', 'beach party 2013 03.jpeg' in the source folder
and a folder in the specifed destination called 'beach party', it will put the files in it. If you also have 'beach party 2013' folder, it will prefer to put the files in it.

it works also for dots and other seperators ('_', '-'): 

`source/Abra.Kadabra.s02e12.mkv -> destination/abra kadabra/Abra.Kadabra.s02e12.mkv`

note that you must have a folder named 'abra kadabra' in the destination folder beforehand, it's a 'lazy' configuration.

## How
```
$ sudo npm install -g in-its-right-place
$ in-its-right-place <source-dir> <destination-dir>
```
## Test
```sh
$ npm install && make test
```

## Other Notes
I tested it mostly on mac, but it passes travis on a linux machine. I still haven't tested in on a winodws machine.
