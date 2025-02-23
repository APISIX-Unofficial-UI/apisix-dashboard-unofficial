PWD=$(shell pwd)

.PHONY: all
all: typescript-axios

.PHONY: typescript-axios
typescript-axios:
	docker run --rm -v "${PWD}:/local" openapitools/openapi-generator-cli:v7.11.0 generate \
		-i /local/apisix-control-3.11.0.yaml \
		-g typescript-axios \
		-o /local/typescript-axios \
		-c /local/typescript-axios.yaml \
		--skip-validate-spec \
		--inline-schema-options RESOLVE_INLINE_ENUMS=true

.PHONY: clean
clean:
	rm -rf ./typescript-axios
