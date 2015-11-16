OPTS = --watch --host=0.0.0.0
DRAFTS = $(OPTS) --drafts
JEKYLL_CMD = jekyll serve
SITE = ./_site

all: run

run:
	$(JEKYLL_CMD) $(OPTS)

drafts:
	$(JEKYLL_CMD) $(DRAFTS)

clean:
	rm -rf $(SITE)
