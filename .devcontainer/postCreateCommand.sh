#!/bin/zsh

sudo chown -R $(whoami):$(whoami) .astro
sudo chown -R $(whoami):$(whoami) dist
sudo chown -R $(whoami):$(whoami) node_modules
bun install --frozen-lockfile
bunx --bun biome migrate --write
