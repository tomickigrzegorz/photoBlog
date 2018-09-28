;(function () {

    'use strict';

    // Global object
    let App = {};
    let discusContent = document.getElementById("disqus_thread");
    // Create button
    App.commentsButton = document.createElement('button');
    App.commentsButton.setAttribute('class', 'comments-button');
    App.commentsButton.setAttribute('data-js', 'comments-button');
    App.commentsButton.innerHTML = 'dodaj / pokaż komentarze';

    // Append button to body
    if(discusContent) {
        discusContent.appendChild(App.commentsButton);
    }

    // Click event handler
    App.commentsButton.onclick = function () {

        // Remove button on click
        this.parentNode.removeChild(this);

        // Create comments container
        App.disqusContainer = document.createElement('div');
        App.disqusContainer.setAttribute('id', 'disqus_thread');

        // Append container to body
        document.body.appendChild(App.disqusContainer);

        // Your Disqus shortname
        App.disqus_shortname = 'bloggrzegorztomickipl';

        // Embed Disqus
        let dsq = document.createElement('script');

        dsq.type = 'text/javascript';
        dsq.async = true;
        dsq.src = '//' + App.disqus_shortname + '.disqus.com/embed.js';

        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

    };

})();