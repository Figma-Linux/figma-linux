#!/bin/bash

if [ ! -d "./build/installers" ]; then
  echo "First need build artefacts";
  exit 1;
fi

rev="$1";
arch=`uname -m | tr -d '\n'`;
version=$(cat ./build/installers/version);
linux_unpacked="build/installers/linux-unpacked";

if [ $arch == "aarch64" ]; then
  linux_unpacked="build/installers/linux-arm64-unpacked";
fi

workdir="build/figma-linux-${version}";
mkdir -p $workdir;
mkdir -p $workdir/resources/icon;

echo "PWD: $(pwd)";

cp -rf ./scripts/debian $workdir;
cp -rf ${linux_unpacked}/* $workdir;
cp -rf ${linux_unpacked}/icons/* $workdir/resources/icon;
cp -rf ./resources/figma-linux.desktop $workdir/resources;

ls -lah ./ || echo '';
ls -lah $workdir || echo '';
ls -lah $workdir/installers || echo '';
ls -lah $workdir/installers/linux-unpacked || echo '';
ls -lah ${linux_unpacked} || echo '';

docker build -t 4tqrgqe5yrgfd/figma-linux-ppa --build-arg FIGMA_LINUX_VERSION=${version} --build-arg FIGMA_LINUX_REV=${rev} -f ./docker/Build_ppa .
