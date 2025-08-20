.PHONY: build
build:
	act -j deploy --container-architecture=linux/amd64 -P ubuntu-24.04=catthehacker/ubuntu:act-22.04 --secret-file .secrets
