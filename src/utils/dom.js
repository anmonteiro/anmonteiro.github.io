import React from 'react';

export function useScriptTag(content) {
  const tagRef = React.useRef(null);

  React.useEffect(() => {
    const body = document.body;
    if (tagRef.current == null) {
      const scriptElement = document.createElement('script');
      scriptElement.innerHTML = content;
      tagRef.current = scriptElement;
      body.appendChild(scriptElement);
    }

    return () => {
      const scriptElement = tagRef.current;
      if (scriptElement != null) {
        try {
          body.removeChild(scriptElement);
        } catch (_) {}
      }
    };
  });
}

export function useGoogleAnalytics() {
  useScriptTag(`
  if (window.location.hostname !== 'localhost') {
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-20102574-2', 'auto');
    ga('send', 'pageview');
  }
      `);
}
