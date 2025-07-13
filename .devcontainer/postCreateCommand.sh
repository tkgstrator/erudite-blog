#!/bin/zsh

sudo chown -R vscode:vscode node_modules
sudo chown -R vscode:vscode .astro
sudo chown -R vscode:vscode dist
bun install --frozen-lockfile
