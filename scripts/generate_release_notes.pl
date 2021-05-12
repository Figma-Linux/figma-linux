#!/bin/perl

my $isHtml = "$ARGV[0]";
my $features=`git log \$(git tag | tail -n2 | head -n1)..HEAD --no-merges --oneline | grep -Eo "feat:.*" | uniq`;
my $fixes=`git log \$(git tag | tail -n2 | head -n1)..HEAD --no-merges --oneline | grep -Eo "fix:.*" | uniq`;
my $other=`git log \$(git tag | tail -n2 | head -n1)..HEAD --no-merges --oneline | grep -Eo "other:.*" | uniq`;
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

  if ($isHtml ne "") {
    `echo "<ul>" >> $release_note_file_path`;
  }

  for my $msg (@list) {
    my $issue = `echo "$msg" | grep -Eo "#.*" | tr -d '\n'`;
    $msg =~ s/^(feat|other|fix): //gi;

    if ($issue ne "") {
      my $issueId = substr $issue, 1;
      $msg =~ s/ ?(Close|#).*$//gi;

      if ($isHtml eq "") {
        `echo "* $msg [$issue]($baseUrl/$issueId)" >> $release_note_file_path`;
      } else {
        `echo '<li>$msg <a href="$baseUrl/$issueId" target="_blank">$issue</a></li>' >> $release_note_file_path`;
      }
    } else {
      if ($isHtml eq "") {
        `echo "* $msg" >> $release_note_file_path`;
      } else {
        `echo "<li>$msg</li>" >> $release_note_file_path`;
      }
    }
  }

  if ($isHtml ne "") {
    `echo "</ul>" >> $release_note_file_path`;
  }
}

if ($hasFeatures > 0) {
  if ($isHtml eq "") {
    generate("## Features:", \@featureList);
  } else {
    generate("<li>Features:</li>", \@featureList);
  }

  if ($hasFixes > 0) {
    `echo '' >> $release_note_file_path`;
  }
}

if ($hasFixes > 0) {
  if ($isHtml eq "") {
    generate("## Bug Fixes:", \@fixList);
  } else {
    generate("<li>Bug Fixes:</li>", \@fixList);
  }

  if ($hasOther > 0) {
    `echo '' >> $release_note_file_path`;
  }
}

if ($hasOther > 0) {
  if ($isHtml eq "") {
    generate("## Other Changes:", \@otherList);
  } else {
    generate("<li>Other Changes:</li>", \@otherList);
  }
}
