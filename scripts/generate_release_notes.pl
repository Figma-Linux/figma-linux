#!/bin/perl

my $features=`git log --oneline \$(git describe --tags --abbrev=0 @^)..@ | grep -Eo "feat:.*" | uniq`;
my $fixes=`git log --oneline \$(git describe --tags --abbrev=0 @^)..@ | grep -Eo "fix:.*" | uniq`;
my $hasFeatures=`printf "$features" | wc -l | tr -d '\n'`;
my $hasFixes=`printf "$fixes" | wc -l | tr -d '\n'`;
my @featureList = split /\n/, $features;
my @fixList = split /\n/, $fixes;
my $baseUrl = "https://github.com/Figma-Linux/figma-linux/issues";
my $release_note_file_path = "./release_notes";

`echo '' > $release_note_file_path`;

if ($hasFeatures > 0) {
  `echo '## Features:' >> $release_note_file_path`;

  for my $msg (@featureList) {
    my $issue = `echo "$msg" | grep -Eo "#.*" | tr -d '\n'`;

    if ($issue ne "") {
      my $issueId = substr $issue, 1;
      $msg =~ s/ ?(Close|#).*$//gi;

      `echo "* $msg [$issue]($baseUrl/$issueId)" >> $release_note_file_path`;
    } else {
      `echo "* $msg" >> $release_note_file_path`;
    }

  }

  if ($hasFixes > 0) {
    `echo '' >> $release_note_file_path`;
  }
}

if ($hasFixes > 0) {
  `echo '## Bug Fixes:' >> $release_note_file_path`;

  for my $msg (@fixList) {
    my $issue = `echo "$msg" | grep -Eo "#.*" | tr -d '\n'`;

    if ($issue ne "") {
      my $issueId = substr $issue, 1;
      $msg =~ s/ ?(Close|#).*//gi;

      `echo "* $msg [$issue]($baseUrl/$issueId)" >> $release_note_file_path`;
    } else {
      `echo "* $msg" >> $release_note_file_path`;
    }
  }
}
