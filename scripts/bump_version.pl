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

system("perl scripts/generate_release_notes.pl --latest");

my $notes=`cat ./release_notes`;

system("rm -rf /tmp/tmp_changelog");
system("touch /tmp/tmp_changelog");
system("echo \"figma-linux (${version}-1ubuntu0) devel; urgency=medium\" >> /tmp/tmp_changelog");
system("echo \"\" >> /tmp/tmp_changelog");
system("echo \"  * Publish ${version} version\" >> /tmp/tmp_changelog");
system("echo \"${notes}\" >> /tmp/tmp_changelog");
system("echo \" -- Chugunov Roman <Zebs-BMK\@yandex.ru>  \$(date -R)\" >> /tmp/tmp_changelog");
system("echo \"\" >> /tmp/tmp_changelog");

system("sed -i \"s/^[*#]/  &/gm\" /tmp/tmp_changelog");

system("echo \"\$(cat /tmp/tmp_changelog ./scripts/debian/changelog)\" > ./scripts/debian/changelog");

system("rm -rf ./release_notes");
system("rm -rf /tmp/tmp_changelog");

system("git add .");
system("git commit -m 'Release v$version'");
system("git tag -a v$version -m 'Publish v$version release'");
