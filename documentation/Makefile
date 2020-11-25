FILENAME:=  $(wildcard *.doc.md)

all:$(FILENAME) cleanOutput
	@cat $(FILENAME) >> ./doc.md
	@cp ./doc.md ../lib/

cleanOutput: ./doc.md
	@echo '' > ./doc.md

%.doc.md:
	@echo $< @
