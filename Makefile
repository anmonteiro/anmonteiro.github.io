DRAFTS = --drafts
OPTS = --watch --host=0.0.0.0
JEKYLL_CMD = jekyll serve
SITE = ./_site

all: run

run:
	$(JEKYLL_CMD) $(OPTS)

drafts:
	$(JEKYLL_CMD) $(OPTS) $(DRAFTS)

clean:
	rm -rf $(SITE)
