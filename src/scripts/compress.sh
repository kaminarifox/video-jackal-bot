#!/bin/bash

compressLvl=$1
inFile=$2
outFile=$3

ffmpeg -i $inFile -vf "scale=trunc(iw/4)*2:trunc(ih/4)*2" -vcodec libx265 -acodec aac -crf 23 $outFile 1> /dev/null

echo $outFile

