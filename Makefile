test:
	@node node_modules/lab/bin/lab -r threshold -t 100 -m 3000
test-no-cov: 
	@node node_modules/lab/bin/lab
test-cov-html:
	@node node_modules/lab/bin/lab -r html -o coverage.html
complexity:
	@node node_modules/complexity-report/src/cli.js -o complexity.md -f markdown lib

.PHONY: test test-no-cov test-cov-html complexity

