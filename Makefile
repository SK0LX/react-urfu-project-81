.PHONY: install build lint lint-fix typecheck test test-watch test-coverage check

install:
	npm ci

build:
	npm run build

lint:
	npm run lint

lint-fix:
	npm run lint-fix

typecheck:
	npm run typecheck

test:
	npm test

test-watch:
	npm run test:watch

test-coverage:
	npm run test-coverage

check:
	$(MAKE) lint
	$(MAKE) typecheck
	$(MAKE) test-coverage
	$(MAKE) build
