# <img src="https://raw.githubusercontent.com/ChugunovRoman/figma-linux/master/resources/icons/128x128.png" width="32"> Figma electron app (unofficial)


Figma-linux is an unofficial [Electron](http://electron.atom.io)-based  [Figma](https://figma.com) desktop app for Linux.

<p>
	<img src="https://raw.githubusercontent.com/ChugunovRoman/figma-linux/master/images/screenshot1.jpg">
</p>

<p>
	<img src="https://img.shields.io/github/downloads/ChugunovRoman/figma-linux/total.svg" />
    <a href="https://github.com/ChugunovRoman/figma-linux/releases/latest">
        <img src="https://img.shields.io/github/release/ChugunovRoman/figma-linux.svg?label=latest%20release">
	</a>
	<img src="https://img.shields.io/github/last-commit/ChugunovRoman/figma-linux.svg">
    <a href="https://github.com/ChugunovRoman/figma-linux/issues">
        <img src="https://img.shields.io/github/issues/ChugunovRoman/figma-linux.svg">
	</a>
    <a href="https://github.com/ChugunovRoman/figma-linux/issues?q=is%3Aissue+is%3Aclosed">
        <img src="https://img.shields.io/github/issues-closed/ChugunovRoman/figma-linux.svg">
	</a>
	<img src="https://img.shields.io/github/languages/code-size/ChugunovRoman/figma-linux.svg">
	<img src="https://img.shields.io/github/repo-size/ChugunovRoman/figma-linux.svg">
    <a href="https://github.com/ChugunovRoman/figma-linux/stargazers">
		<img src="https://img.shields.io/github/stars/ChugunovRoman/figma-linux.svg?style=social&label=Stars">
	</a>
</p>

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/d80ff1e7c3fe4da28e2e50a28d4ead7c)](https://www.codacy.com/manual/ChugunovRoman/figma-linux?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ChugunovRoman/figma-linux&amp;utm_campaign=Badge_Grade)
[![Snap](https://snapcraft.io/figma-linux/badge.svg)](https://snapcraft.io/figma-linux)

<p>
	<span class="badge-buymeacoffee"><a href="https://www.buymeacoffee.com/U5hnMuASy" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
	<span class="badge-paypal"><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4DNBUKPV6FBCY&source=url" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
</p>

## Installation
### Universal
You can install Figma-linux from Snap [here.](https://snapcraft.io/figma-linux)

Alternatively, type
```bash
sudo snap install figma-linux
```
in your terminal.

To use local fonts when using the snapd version create a symbolic link:

```
sudo ln -s $HOME/.local/share/fonts $HOME/snap/figma-linux/current/.local/share/
```

There is also an AppImage available.
Get it on our [Releases](https://github.com/Figma-Linux/figma-linux/releases) page, then make it executable and install using these terminal commands:
```bash
chmod +x figma-linux-*.AppImage
sudo ./figma-linux-*.AppImage -i
```
This is not a portable AppImage - it will install figma-linux on your system, after which you can run it from terminal or from your app list.
For more info, execute
```bash
./figma-linux-*.AppImage -h
```

### Debian-based Distros
Firstly, install `libgconf-2-4`:
```bash
sudo apt install libgconf-2-4
```
Download the .deb package from the [Releases](https://github.com/Figma-Linux/figma-linux/releases) page, and install it with `dpkg` or your favorite .deb installer.
```bash
sudo dpkg -i figma-linux_*_amd64.deb
```

### Ubuntu

On Ubuntu, you can use our PPA:
```bash
sudo add-apt-repository ppa:chrdevs/figma && sudo apt update && sudo apt install figma-linux -y
```

If you receive a `NO_PUBKEY` error while running `apt update`, then you must add the key manualy:
```bash
sudo apt-key adv --recv-key --keyserver keyserver.ubuntu.com 70F3445E637983CC
```


### Arch-based distros

Figma-linux is available on the [AUR](https://aur.archlinux.org/packages/figma-linux/).
You can use an AUR helper like `yay` to install it:
```bash
yay -S figma-linux
```
### RPM-based distros
Download the .rpm package from our [Releases](https://github.com/Figma-Linux/figma-linux/releases/latest) page, then install it:

```bash
sudo dnf install figma-linux-*.x86_64.rpm
```


## Building from source

1. Clone the repository:
```bash
git clone https://github.com/Figma-Linux/figma-linux
cd linux
```
2. Install Rust:
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```
3. Install prerequisites from npm:
```bash
npm i
```
To run Figma-linux from npm in dev mode execute this:
```bash
npm run dev
```
Aside from that, you can also run:

- ```npm run build``` to built the app for production
- ```npm run start``` to run the built version
- ```npm run builder``` to package the app for distribution.
- * The build targets are listed in ```./config/builder.json```. You can remove the ones you don't need or don't have dependencies for.
- ```npm run pack``` to remove old packages from the installer directory, then pack the app.
- * This depends on [AppImageTool](https://appimage.github.io/appimagetool/) being installed.


ATTENTION:
When you do changes in middleware component, You need to rebuild (`npm run build`) and restart the app each time, because the middleware execute only on run the app, Hot Reload won't work.



## Community

Join us on [Telegram](https://t.me/figma_linux) or [Spectrum](https://spectrum.chat/figma-linux).


## Become a Backer
You can contribute to figma-linux development by supporting us on Paypal or Buy me a Coffee:

<p>
	<span class="badge-buymeacoffee"><a href="https://www.buymeacoffee.com/U5hnMuASy" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a></span>
	<span class="badge-paypal"><a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=4DNBUKPV6FBCY&source=url" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>
</p>

Thanks to the supporters.
