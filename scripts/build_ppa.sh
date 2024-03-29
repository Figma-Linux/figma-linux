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

rm -rf /tmp/tmp_changelog
touch /tmp/tmp_changelog
echo "figma-linux (${version}-${rev}ubuntu0) devel; urgency=medium" >> /tmp/tmp_changelog
echo "" >> /tmp/tmp_changelog
echo "  * Publish ${version} version" >> /tmp/tmp_changelog
echo "${notes}" >> /tmp/tmp_changelog
echo " -- Chugunov Roman <Zebs-BMK@yandex.ru>  $(date -R)" >> /tmp/tmp_changelog
echo "" >> /tmp/tmp_changelog
echo "$(cat /tmp/tmp_changelog ./scripts/debian/changelog)" > ./scripts/debian/changelog
rm -rf /tmp/tmp_changelog

cp -rf ./scripts/debian $workdir;
cp -rf ${linux_unpacked}/* $workdir;
cp -rf ${linux_unpacked}/icons/* $workdir/resources/icon;
cp -rf ./resources/figma-linux.desktop $workdir/resources;

docker build -t 4tqrgqe5yrgfd/figma-linux-ppa --build-arg FIGMA_LINUX_VERSION=${version} --build-arg FIGMA_LINUX_REV=${rev} -f ./docker/Build_ppa .
