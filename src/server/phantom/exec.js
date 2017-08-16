var page = require('webpage').create();
var system = require('system');
var url;

page.settings.loadImages = false;
page.settings.resourceTimeout = 100000; // 10s
page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.106 Safari/537.36';

// if (system.args.length === 1) { // invalid args count
//   console.log('phantomjs: invalid args count: ' + system.args.length);
//   phantom.exit(1);
// }

url = 'https://kazemai.github.io/fgo-vz/servant.html';
// url = 'about:blank';

page.onError = function(msg, trace) {
  // lots of warning like 'TypeError' are all promoted here, so do not phantom.exit here
  var msgStack = ['ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
    });
  }
  //console.error(msgStack); // FIXME no idea why parent process cannot got message from stderr, disabled it for now
};

page.onResourceTimeout = function(request) {
  console.log('ERROR: timeout (#' + request.id + '): ' + JSON.stringify(request));
  phantom.exit(1);
};

page.open(url, function(status) {
  if (status !== 'success') {
    console.log('PhantomJs: failed to open url: ' + url);
    phantom.exit(1);
  } else {
    page.evaluate(function() {
      console.log(JSON.stringify(master));
    });
    phantom.exit(0);
  }
});

page.onConsoleMessage = function(msg) {
  console.log(msg);
};