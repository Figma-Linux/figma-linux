#!/bin/bash

if [[ ! "$1" == "local" && ! "$1" == "repo" ]]; then
  echo "Invalid arg: "$1". Pass 'local' or 'repo' value"
  exit 1
fi

from="$1"

docker build -t figma-linux-artefacts -f "./Build_artefacts_$from" .

rm -rf ./build/installers

# copy artefacts from image
docker run -v $PWD/build:/opt/mount --rm -ti figma-linux-artefacts:latest bash -c "cp -r /usr/src/figma-linux/build/installers /opt/mount && chown 1000:1000 /opt/mount -R"

docker image rm figma-linux-artefacts

