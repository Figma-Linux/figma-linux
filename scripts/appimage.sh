#!/bin/bash

APP_DIR="./build/installers/linux-unpacked";

ARCH=`uname -m | tr -d '\n'`;
VER=`cat build/installers/version`;

echo "ARCH: $ARCH, VER: $VER";

if [ $ARCH == "aarch64" ]; then
  APP_DIR="./build/installers/linux-arm64-unpacked";
fi

echo "APP_DIR: $APP_DIR";

if [ ! -d "$APP_DIR" ]; then
  echo "ERROR: It need run after electron-builder";
  exit 1;
fi

echo "$DESKTOP_FILE" > "$APP_DIR/figma-linux.desktop";
cat "./resources/figma-linux-appimage.desktop" > "$APP_DIR/figma-linux.desktop";
cp -rf "./resources/AppRun" "$APP_DIR/AppRun";
cp -rf "./resources/icons/256x256.png" "$APP_DIR/figma-linux.png";
cp -rf "./resources/icons" "$APP_DIR/";

cd "$APP_DIR";

appimagetool ./ ../figma-linux-${VER}_${ARCH}.AppImage --appimage-extract-and-run

