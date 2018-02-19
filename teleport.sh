#!/bin/bash

function teleport () {
    param="$(node src/index)"
    cd "$param"
}

alias tp='teleport'
