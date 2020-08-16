PYTHON = python3
.DEFAULT_GOAL = help

# The @ makes sure that the command itself isn't echoed in the terminal
help:
	@echo "---------------HELP-----------------"
	@echo "setup:"
	@echo "	Creates virtual env and installs"
	@echo "	requirements and npm packages"
	@echo "test:"
	@echo "	runs tests"
	@echo "------------------------------------"


setup:
	@( \
		cd src/js; \
		npm install; \
	)


test:
	@( \
		python3 tests/setup.py; \
		python3 tests/gui.py; \
	)
