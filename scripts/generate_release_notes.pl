#!/bin/perl

my $isHtml = 0;
my $latest = 0;

for my $param (@ARGV) {
  if ($param eq "--html") {
    $isHtml = 1;
  }
  if ($param eq "--latest") {
    $latest = 1;
  }
}

my $features=`git log \$(git tag --sort=version:refname | tail -n2 | head -n1)..HEAD --no-merges --oneline | grep -Eo "feat:.*" | uniq`;
my $fixes=`git log \$(git tag --sort=version:refname | tail -n2 | head -n1)..HEAD --no-merges --oneline | grep -Eo "fix:.*" | uniq`;
my $other=`git log \$(git tag --sort=version:refname | tail -n2 | head -n1)..HEAD --no-merges --oneline | grep -Eo "(other|chore|impr):.*" | uniq`;

if ($latest) {
  $features=`git log \$(git tag --sort=version:refname | tail -n1)..HEAD --no-merges --oneline | grep -Eo "feat:.*" | uniq`;
  $fixes=`git log \$(git tag --sort=version:refname | tail -n1)..HEAD --no-merges --oneline | grep -Eo "fix:.*" | uniq`;
  $other=`git log \$(git tag --sort=version:refname | tail -n1)..HEAD --no-merges --oneline | grep -Eo "(other|chore|impr):.*" | uniq`;
}

my $hasFeatures=`printf "$features" | wc -l | tr -d '\n'`;
my $hasFixes=`printf "$fixes" | wc -l | tr -d '\n'`;
my $hasOther=`printf "$other" | wc -l | tr -d '\n'`;
my @featureList = split /\n/, $features;
my @fixList = split /\n/, $fixes;
my @otherList = split /\n/, $other;
my $baseUrl = "https://github.com/Figma-Linux/figma-linux/issues";
my $release_note_file_path = "./release_notes";

`echo '' > $release_note_file_path`;

sub generate {
  my $title = $_[0];
  my @list = @{$_[1]};

  `echo "$title" >> $release_note_file_path`;

  for my $msg (@list) {
    my $issue = `echo "$msg" | grep -Eo "#.*" | tr -d '\n'`;
    $msg =~ s/^(feat|other|fix|chore|impr): //gi;

    if ($issue ne "") {
      my $issueId = substr $issue, 1;
      $msg =~ s/ ?(Close|#).*$//gi;

      if ($isHtml) {
        `echo '<li>$msg <a href="$baseUrl/$issueId" target="_blank">$issue</a></li>' >> $release_note_file_path`;
      } else {
        `echo "* $msg [$issue]($baseUrl/$issueId)" >> $release_note_file_path`;
      }
    } else {
      if ($isHtml) {
        `echo "<li>$msg</li>" >> $release_note_file_path`;
      } else {
        `echo "* $msg" >> $release_note_file_path`;
      }
    }
  }

  if ($isHtml) {
    `echo "<li></li>" >> $release_note_file_path`;
  }
}

if ($hasFeatures > 0) {
  if ($isHtml) {
    generate("<li>Features:</li>", \@featureList);
  } else {
    generate("## Features:", \@featureList);
  }

  if ($hasFixes > 0) {
    `echo '' >> $release_note_file_path`;
  }
}

if ($hasFixes > 0) {
  if ($isHtml) {
    generate("<li>Bug Fixes:</li>", \@fixList);
  } else {
    generate("## Bug Fixes:", \@fixList);
  }

  if ($hasOther > 0) {
    `echo '' >> $release_note_file_path`;
  }
}

if ($hasOther > 0) {
  if ($isHtml) {
    generate("<li>Other Changes:</li>", \@otherList);
  } else {
    generate("## Other Changes:", \@otherList);
  }
}
