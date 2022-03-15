const { readdirSync, rmSync, writeFileSync } = require("fs");

const dir = "./sources/favicons";
readdirSync(dir).forEach((file) => rmSync(`${dir}/${file}`));

const favicons = require("favicons"),
  source = "./sources/assets/logo.png", // Source image(s). `string`, `buffer` or array of `string`
  configuration = {
    path: "assets/", // Path for overriding default icons path. `string`
    appName: "Fotoblog Grzegorz Tomicki", // Your application's name. `string`
    appShortName: "Fotoblog GT", // Your application's short_name. `string`. Optional. If not set, appName will be used
    appDescription:
      "Blog fotograficzny, ciekawe nietuzinkowe zdjęcia, niezapomniane chwile", // Your application's description. `string`
    // developerName: null, // Your (or your developer's) name. `string`
    // developerURL: null, // Your (or your developer's) URL. `string`
    dir: "auto", // Primary text direction for name, short_name, and description
    lang: "PL", // Primary language for name and short_name
    background: "#fff", // Background colour for flattened icons. `string`
    theme_color: "#fff", // Theme color user for example in Android's task switcher. `string`
    appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
    display: "standalone", // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
    orientation: "portrait", // Default orientation: "any", "natural", "portrait" or "landscape". `string`
    scope: "/", // set of URLs that the browser considers within your app
    start_url: "/?source=pwa", // Start URL when launching the application from a device. `string`
    // preferRelatedApplications: false, // Should the browser prompt the user to install the native companion app. `boolean`
    // relatedApplications: undefined, // Information about the native companion apps. This will only be used if `preferRelatedApplications` is `true`. `Array<{ id: string, url: string, platform: string }>`
    // version: "1.0", // Your application's version string. `string`
    // logging: false, // Print logs to console? `boolean`
    // pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
    // loadManifestWithCredentials: false, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
    // manifestMaskable: false, // Maskable source image(s) for manifest.json. "true" to use default source. More information at https://web.dev/maskable-icon/. `boolean`, `string`, `buffer` or array of `string`
    icons: {
      // Platform Options:
      // - offset - offset in percentage
      // - background:
      //   * false - use default
      //   * true - force use default, e.g. set background for Android icons
      //   * color - set background for the specified icons
      //
      android: true, // Create Android homescreen icon. `boolean` or `{ offset, background }` or an array of sources
      appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset, background }` or an array of sources
      favicons: true, // Create regular favicons. `boolean` or `{ offset, background }` or an array of sources
      windows: false, // Create Windows 8 tile icons. `boolean` or `{ offset, background }` or an array of sources
      appleStartup: false, // Create Apple startup images. `boolean` or `{ offset, background }` or an array of sources
      yandex: false, // Create Yandex browser icon. `boolean` or `{ offset, background }` or an array of sources
    },
    // shortcuts: [
    //   // Your applications's Shortcuts (see: https://developer.mozilla.org/docs/Web/Manifest/shortcuts)
    //   // Array of shortcut objects:
    //   {
    //     name: "View your Inbox", // The name of the shortcut. `string`
    //     short_name: "inbox", // optionally, falls back to name. `string`
    //     description: "View your inbox messages", // optionally, not used in any implemention yet. `string`
    //     url: "/inbox", // The URL this shortcut should lead to. `string`
    //     icon: "test/inbox_shortcut.png", // source image(s) for that shortcut. `string`, `buffer` or array of `string`
    //   },
    // ],
    // more shortcuts objects
  },
  callback = function (error, response) {
    if (error) {
      console.log(error.message); // Error description e.g. "An unknown error has occurred"
      return;
    }
    // console.log(response.images); // Array of { name: string, contents: <buffer> }
    // console.log(response.files); // Array of { name: string, contents: <string> }
    // console.log(response.html); // Array of strings (html elements)

    response.images.map((image) => {
      writeFileSync(`${dir}/${image.name}`, image.contents);
    });

    response.files.map((file) => {
      writeFileSync(
        `${dir}/${file.name}`,
        file.contents.replace(/assets\//g, "")
      );
    });

    response.html.map((html) => {
      writeFileSync(`${dir}/head.txt`, html, { flag: "a+" }, (err) => {});
    });
  };

favicons(source, configuration, callback);
