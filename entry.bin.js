#!/bin/sh

export NODE_PRESERVE_SYMLINKS=1
node --preserve-symlinks -e "require('fusion-build/lib/entry.js');" $@

#- #!/usr/bin/env node --preserve-symlinks
#- require('fusion-build/lib/entry')