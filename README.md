<p>
	<img src="https://raw.githubusercontent.com/ChugunovRoman/figma-linux/master/images/screenshot1.png">
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


# <img src="https://raw.githubusercontent.com/ChugunovRoman/figma-linux/master/resources/icon/128x128.png" width="32"> Figma electron app (unofficial)

Figma-linux it's unofficial desktop application for Linux for the [Figma web application](https://figma.com). <br>
This app based on the [Electron](http://electron.atom.io)

<br>

# Dependences
On Debian-based distros You need install the libgconf2-4 library


# Repositories
For now, there are have repository for [deb package on Launchpad](https://launchpad.net/~chrdevs/+archive/ubuntu/figma). <br>
To add repository, execute command below:
```bash
sudo add-apt-repository ppa:chrdevs/figma
```
If You have **NO_PUBKEY** error while on **apt update**, then You must add the key manualy:
```bash
sudo apt-key adv --recv-key --keyserver keyserver.ubuntu.com 70F3445E637983CC
```

# install
[Download](https://github.com/ChugunovRoman/figma-linux/releases) app package for You linux distribution. <br>
For debian-based linux distributions:
```
sudo dpkg -i figma-linux_0.4.0_amd64.deb
```

For RedHat-based linux distributions:
```
sudo yum install figma-linux-0.4.0.x86_64.rpm
```
or
```
sudo rpm -Uvh figma-linux-0.4.0.x86_64.rpm
```
or
```
sudo zypper install figma-linux-0.4.0.x86_64.rpm
```
or
```
sudo smart install figma-linux-0.4.0.x86_64.rpm
```

# Run

```
figma-linux
```

Or You can just download and run the AppImage.

```
./figma-linux-0.4.0-x86_64.AppImage
```

# Development

Steps to start development:

1. git clone git@github.com:ChugunovRoman/figma-linux.git
2. cd figma-linux
3. npm i


To start the app in dev mode:
```
npm run dev
```

To start the app in production mode:
```
npm run build; npm start
```

ATTENTION:
When You do changes in middleware component, You need to rebuild and restart the app each time.
Because the middleware execute only on run the app. Hot Reload doesn't work here.

## description of  npm scripts

 * **dev** - runs app in dev mode
 * **start** - runs already built app
 * **build** - only builds app from src
 * **builder** - packs the app into different linux packages (see ./config/builder.json)
 * **pack** - removes old packages from the installers dir, build the app and pack it

# Community

Join us in [telegram](https://t.me/figma_linux) and [spectrum.chat](https://spectrum.chat/figma-linux)
