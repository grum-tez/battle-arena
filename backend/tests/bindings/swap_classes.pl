#!/usr/bin/perl

use strict;
use warnings;

sub extract_and_replace_class {
    my ($file, $class_name, $insert_file) = @_;

    # Check if the insert file exists
    if (!-f $insert_file) {
        die "Insert file '$insert_file' not found.\n";
    }

    # Read the content of the insert file
    open my $insert_fh, '<', $insert_file or die "Could not open '$insert_file': $!";
    my $insert_content = do { local $/; <$insert_fh> };
    close $insert_fh;

    # Read the content of the main file
    open my $file_fh, '<', $file or die "Could not open '$file': $!";
    my @lines = <$file_fh>;
    close $file_fh;

    # Find and remove the class definition
    my $start_line;
    my $end_line;
    for my $i (0 .. $#lines) {
        if ($lines[$i] =~ /export class $class_name/) {
            $start_line = $i;
            for my $j ($i .. $#lines) {
                if ($lines[$j] =~ /^\}/) {
                    $end_line = $j;
                    last;
                }
            }
            last;
        }
    }

    if (!defined $start_line || !defined $end_line) {
        die "Class '$class_name' not found in file '$file'.\n";
    }

    print "Class '$class_name' starts at line $start_line and ends at line $end_line.\n";

    # Remove the class definition
    splice @lines, $start_line, $end_line - $start_line + 1;

    # Insert the new content
    splice @lines, $start_line, 0, "$insert_content\n";

    # Write the modified content back to the file
    open $file_fh, '>', $file or die "Could not open '$file' for writing: $!";
    print $file_fh @lines;
    close $file_fh;

    print "Class '$class_name' has been replaced with the contents of '$insert_file' at line $start_line in '$file'.\n";
}

# Define the file paths and class names
my $file = 'battlemaster.ts';
my $class1 = 'new_challenger_registered';
my $insert_file1 = 'new_challenger_registered.ts';
my $class2 = 'new_fight_recorded';
my $insert_file2 = 'new_fight_recorded.ts';

# Define the third class and insert file
my $class3 = 'fight_record';
my $insert_file3 = 'fight_record.ts';

# Check if the main file exists
if (!-f $file) {
    die "File '$file' not found.\n";
}

# Process the first class replacement
# extract_and_replace_class($file, $class1, $insert_file1);

# Process the second class replacement
# extract_and_replace_class($file, $class2, $insert_file2);

# Process the third class replacement
# extract_and_replace_class($file, $class3, $insert_file3);
