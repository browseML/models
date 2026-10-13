#!/bin/sh
# SPDX-License-Identifier: MIT OR Apache-2.0
# The models here against SHA256SUMS, with the tools every system has (coreutils sha256sum or macOS shasum).
set -eu
cd "$(dirname "$0")"
if command -v sha256sum >/dev/null; then sha256sum -c SHA256SUMS; else shasum -a 256 -c SHA256SUMS; fi
