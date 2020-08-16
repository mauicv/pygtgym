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
		python3 -m venv venv; \
		pip install -upgrade pip; \
		pip install -r requirements.txt; \
		cd src/js; \
		npm install; \
	)


test:
	@( \
		. venv/bin/activate; \
		python tests/setup.py; \
		python tests/gui.py; \
	)
