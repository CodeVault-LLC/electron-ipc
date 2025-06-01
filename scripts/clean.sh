#!/bin/bash

find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
find . -name "pnpm-lock.yaml" -type f -exec rm -f '{}' +
find . -name "package-lock.json" -type f -exec rm -f '{}' +
find . -name "yarn.lock" -type f -exec rm -f '{}' +
