#!/bin/perl

my $version = "$ARGV[0]";

if ($version eq "") {
  print "Need pass version.\n";
  exit 1;
}

my $prevVersion = `git tag | tail -n1 | tr -d 'v' | tr -d '\n'`;

printf("Bump %s to %s version.\n", $prevVersion, $version);

system("sed -i \"s/$prevVersion/$version/\" ./package.json");
system("sed -i \"s/$prevVersion/$version/\" ./src/package.json");
system("sed -i \"s/$prevVersion/$version/\" ./snap/snapcraft.yaml");
system("sed -i \"s/$prevVersion/$version/\" ./resources/figma-linux-appimage.desktop");

system("git add .");
system("git commit -m 'Release v$version'");
system("git tag -a v$version -m 'Publish v$version release'");
