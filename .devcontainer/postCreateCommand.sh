#!/bin/zsh

# GPG_TTYを設定
echo 'export GPG_TTY=$(tty)' >> /home/vscode/.zshrc

sudo chown -R vscode:vscode node_modules
sudo chown -R vscode:vscode .astro
sudo chown -R vscode:vscode dist
bun install --frozen-lockfile
