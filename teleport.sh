#!/bin/bash

function teleport () {
    wd=`pwd`
    param="$(node src/tp $@ --cwd $wd)"
    echo "$param"
}

alias tp='teleport'
