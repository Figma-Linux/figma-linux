#!/bin/perl

my $version = "$ARGV[0]";
my $rev = "$ARGV[1]";

if ($version eq "") {
  print "Need pass version.\n";
  exit 1;
}
if ($rev eq "") {
  print "Need pass revision number.\n";
  exit 1;
}

printf("Version: %s, revision number: %s.\n", $version, $rev);

system("rm -rf /tmp/tmp_changelog");
system("touch /tmp/tmp_changelog");
system("echo \"figma-linux (${version}-1ubuntu${rev}) devel; urgency=medium\" >> /tmp/tmp_changelog");
system("echo \"\" >> /tmp/tmp_changelog");
system("echo \"  * Bump revision number for ${version} version\" >> /tmp/tmp_changelog");
system("echo \"\" >> /tmp/tmp_changelog");
system("echo \" -- Chugunov Roman <Zebs-BMK\@yandex.ru>  \$(date -R)\" >> /tmp/tmp_changelog");
system("echo \"\" >> /tmp/tmp_changelog");

system("echo \"\$(cat /tmp/tmp_changelog ./scripts/debian/changelog)\" > ./scripts/debian/changelog");

system("rm -rf /tmp/tmp_changelog");
