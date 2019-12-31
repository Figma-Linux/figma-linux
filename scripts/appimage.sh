#!/bin/bash

APP_DIR="./build/installers/linux-unpacked";

if [ ! -d "$APP_DIR" ]; then
  echo "ERROR: It need run after electron-builder";
  exit 1;
fi

echo "$DESKTOP_FILE" > "$APP_DIR/figma-linux.desktop";
cat "./resources/figma-linux-appimage.desktop" | sed "s/0.6.1/$1/g" > "$APP_DIR/figma-linux.desktop";
cp -rf "./resources/AppRun" "$APP_DIR/AppRun";
cp -rf "./resources/icons/256x256.png" "$APP_DIR/figma-linux.png";
cp -rf "./resources/icons" "$APP_DIR/";

cd "$APP_DIR";

appimagetool ./ ../figma-linux-$1.AppImage

