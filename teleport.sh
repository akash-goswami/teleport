#!/bin/bash

function teleport () {
    wd=`pwd`
    param="$(node src/tp $@ --cwd $wd)"
    echo "$param"
    set +f # enable wild card expansion again
}

alias tp='set -f;teleport'
