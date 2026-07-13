# Makefile for ProTrain Standalone BI Dashboard
# Highly compatible with both Unix-like shells (Git Bash, WSL, macOS, Linux) and Windows CMD/PowerShell

.PHONY: all copy-typo clean help

all: copy-typo

copy-typo:
	@echo "Syncing Dashboard.html to Dashbaord.html..."
	@cp Dashboard.html Dashbaord.html 2>/dev/null || copy /y Dashboard.html Dashbaord.html
	@echo "Sync complete."

clean:
	@echo "Cleaning standalone dashboard files..."
	@rm -f Dashbaord.html Dashboard.html 2>/dev/null || (del /f /q Dashbaord.html Dashboard.html 2>nul || exit 0)
	@echo "Clean complete."

help:
	@echo "Available targets:"
	@echo "  all        - Default target. Syncs Dashboard.html to Dashbaord.html"
	@echo "  copy-typo  - Syncs Dashboard.html to Dashbaord.html"
	@echo "  clean      - Removes Dashboard.html and Dashbaord.html"
