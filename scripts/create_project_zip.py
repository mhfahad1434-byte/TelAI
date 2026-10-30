#!/usr/bin/env python3
import os
import zipfile
import sys

def make_zip(source_dirs, output_filename):
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for sdir in source_dirs:
            if os.path.isfile(sdir):
                zipf.write(sdir, arcname=sdir)
            elif os.path.isdir(sdir):
                for root, dirs, files in os.walk(sdir):
                    # Exclude build output or git directories
                    if 'build' in dirs:
                        dirs.remove('build')
                    if '.gradle' in dirs:
                        dirs.remove('.gradle')
                    for f in files:
                        full_path = os.path.join(root, f)
                        rel_path = os.path.relpath(full_path, start=os.getcwd())
                        zipf.write(full_path, arcname=rel_path)
    print(f"Created {output_filename} successfully ({os.path.getsize(output_filename)} bytes)")

if __name__ == '__main__':
    sources = ['android', '.github', 'docs', 'cloudflare', 'database', 'metadata.json']
    out_file = sys.argv[1] if len(sys.argv) > 1 else 'telai-android-project.zip'
    make_zip(sources, out_file)
