install:
	npm install -d

test:
mocha --recursive	

publish:
ifndef VERSION
	$(error VERSION is undefined for NPM release)
endif
	npm install
	npm version --no-git-tag-version $(VERSION)
	npm publish
