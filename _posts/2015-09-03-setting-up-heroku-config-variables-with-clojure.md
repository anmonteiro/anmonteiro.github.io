---
layout: post
title: Setting up Heroku config variables with Clojure
tags: clojure heroku
---

Configuration or environment variables are really useful whether you want to externally affect the way your apps run or if you simply want to keep private, sensitive data out of your version control system. The other day I ran into some trouble having [Heroku](https://www.heroku.com/) read the config variables of a Clojure app of mine. So here's how to get it working.

<!--more-->

### 1. Add the variables to Heroku

In your Heroku app dashboard, go into settings and click "Reveal Config Vars". If you haven't added any configuration variables yet, it should look something like this:

![No configuration variables][link-empty]
[link-empty]: {{ site.baseurl }}{{ site.data.vars.img_path }}/config_vars_empty.png "No configuration variables"

Go ahead, then, and click "Edit" to add the configuration variables you want to add. The next image shows what you should now be seeing. Type in the key and the value for each one.

![Add configuration variables][link-add]
[link-add]: {{ site.baseurl }}{{ site.data.vars.img_path }}/config_vars_add.png "Add configuration variables"

### 2. Reference your variables in your Clojure code

Now for the trickier part. You might be tempted to simply write something like the following (which was actually what I was doing):

```Clojure
(def MY-VAR (System/getenv "MY-VAR"))
```
However, as per [Heroku's documentation](https://devcenter.heroku.com/articles/getting-started-with-clojure#define-config-vars), only *"at runtime, config vars are exposed as environment variables to the application"*, and since `def` calls are bound at compile time, the above code would not work.

<h4 style="text-shadow: 1px 0 #000;letter-spacing: 1px;"> So, what's the solution?</h4>

Well, the solution is to bind your variables at runtime, inside a function call which executes when the app is started.

**- But you shouldn't declare vars inside functions, or [change them](https://github.com/bbatsov/clojure-style-guide#alter-var) using `def` calls!** - the attentive reader argues; correctly. The code that follows doesn't do either.

```Clojure
;;;;;;;;;;;;;;
;; option A ;;
;;;;;;;;;;;;;;

;; 1) declare a nil atom
(def MY-VAR (atom nil))

;; 2) "reset!" it in a function that is called when the app starts
(defn init-config []
  (reset! MY-VAR (System/getenv "MY-VAR")))


;;;;;;;;;;;;;;
;; option B ;;
;;;;;;;;;;;;;;

;; 1. declare an unbound var (can also be bound,
;;  but its value will change)
(def MY-VAR)

;; 2. "alter-var-root" it in a function that's called when the app starts
(defn init-config []
  (alter-var-root MY-VAR (constantly (System/getenv "MY-VAR"))))
```

Either option will work in Heroku, as long as reading the environment is done at runtime. A third alternative can be accomplished by using the [Environ](https://github.com/weavejester/environ) library. It allows for a more programatic approach and encompasses a handful of other features that you might find useful. Refer to its GitHub page for more information.

If you liked this post or have any questions / suggestions, be sure to [drop me a line](mailto:{{ site.author.email }}) or reach me on [Twitter](https://twitter.com/{{ site.author.twitter_username }}). Happy hacking!
