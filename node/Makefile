default:
	cp ../squeak.js .
	cp ../vm.js .
	cp ../jit.js .
	mkdir plugins/
	cp ../plugins/*.js plugins/
	cp ../demo/squeakjs.image .
	cp ../demo/squeakjs.changes .
	npm install

clean:
	rm -rf localStorage/
	rm -rf node_modules/
	rm -rf plugins/
	rm -f squeak.js
	rm -f vm.js
	rm -f jit.js
	rm -f squeakjs.image
	rm -f squeakjs.changes
