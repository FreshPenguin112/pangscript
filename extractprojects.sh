#!/bin/bash

for file in *.pmp; do
    # Remove the .pmp extension to get the folder name
    folder="${file%.pmp}"
    # Unzip the file into the respective folder
    unzip -o "$file" -d "$folder"
done
