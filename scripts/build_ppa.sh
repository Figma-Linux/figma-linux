#!/bin/bash

if [ ! -d "./build/installers" ]; then
  echo "First need build artefacts"
  exit 1;
fi

version=$(cat ./build/installers/version);

# sed -i "1s/^/figma-linux (${version}-1ubuntu0) devel; urgency=medium\n\n    * Publish ${version} version\n\n -- Chugunov Roman <Zebs-BMK@yandex.ru>  $(date -R)\n\n/" ./scripts/debian/changelog

docker build -t figma-linux-ppa -f Build_ppa .

# docker image rm figma-linux-ppa

