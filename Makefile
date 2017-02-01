.PHONY: integration

restore:
	yarn install

integration:
	# INTEGRATION_SMTP_CONNECTION and INTEGRATION_EMAIL_ADDRESS should be exporede before this point
	npm run integration

patch:
	npm version patch
	git push
	npm publish

minor:
	npm version minor
	git push
	npm publish

major:
	npm version major
	git push
	npm publish