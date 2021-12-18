"use strict";

var jsdom = require("jsdom");
var {JSDOM} = jsdom;

var Promise = require("bluebird");

var path = require('path');
var yaml = require('js-yaml');
var Feed = require('feed');
var find = require('find');
var flatten = require('lodash.flatten');
var fs = Promise.promisifyAll(require('fs'));
var child_process = Promise.promisifyAll(require('child_process'));
var spawnAsync = child_process.spawnAsync;
var spawn = child_process.spawn;
var readFileAsync = fs.readFileAsync;
var writeFileAsync = fs.writeFileAsync;
var appendFileAsync = fs.appendFileAsync;
var spawnPromise = require('./spawn-promise.js');

var svgOverlay = require('./svgOverlay');

var URL = 'https://fasiha.github.io';
var PREPATH = ''; // i.e., if site lives at foo.edu/~me, RELPATH='~me'.
function filepathToAbspath(filepath) {
  return path.resolve('/', PREPATH, filepath).replace(/index.html$/, '');
}
function filepathToURL(filepath) { return URL + filepathToAbspath(filepath); }

var css =
    '<style>' + fs.readFileSync('assets/modest.css', 'utf8') + '</style>\n';

var plotlyPreamble =
    `<script src="${
                    filepathToAbspath('assets/plotly-basic-1.27.1.min.js')
                  }" charset="utf-8"></script>\n`;

var mathjaxPreamble = `<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  TeX: { equationNumbers: { autoNumber: "AMS" } },
});
</script>
<script type="text/javascript" async charset="utf-8"
  src="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML">
</script>
`;

var hl = fs.readFileSync('assets/highlight.pack.js', 'utf8');
var hlcss = '<style>' +
            fs.readFileSync('assets/tomorrow-night-eighties.css', 'utf8') +
            '</style>\n';

var defaultMeta = {
  title : 'Insight≠Numbers',
  description : 'A blog by Ahmed Fasih',
  date : new Date(),
  dateUpdated : null,
  banner : 'glen-helen.jpg',
  socialBanner : '',
  tags : [],
  author : 'Ahmed Fasih',
  plotly : false,
  mathjax : false,
};

var articles = new Map([]);

function gatherIntel(filepath) {
  var meta = fileToMeta(filepath);
  articles.set(filepath, meta);
}

function build() {
  find.file(/\.md$/, '.', md => {
    md = md.filter(s => s.indexOf('node_modules') !== 0);
    md.forEach(gatherIntel);
    var metas = Array.from(articles.values())
                    .sort((a, b) => -((a.dateUpdated || a.date) -
                                      (b.dateUpdated || b.date)));

    var postMetas = metas.filter(meta => meta.filepath.indexOf('post/') === 0);
    var nonpostMetas =
        metas.filter(meta => meta.filepath.indexOf('post/') !== 0);

    var allTags =
        Array.from(new Set(flatten(postMetas.map(meta => meta.tags)))).sort();

    postMetas.forEach((meta, midx) => {
      buildOneMarkdown(meta, postMetas[midx + 1], postMetas[midx - 1],
                       postMetas);
    });
    nonpostMetas.forEach(
        (meta, midx) => { buildOneMarkdown(meta, null, null, postMetas); });

    // Atom feed!
    var feed = new Feed({
      title : defaultMeta.title,
      description : defaultMeta.description,
      id : filepathToURL(''),
      link : filepathToURL(''),
      image : filepathToURL(defaultMeta.banner),
      copyright :
          'Unless otherwise noted, released into the public domain under CC0.',
      updated : new Date(postMetas[0].dateUpdated || postMetas[0].date),
      author : {name : defaultMeta.author, link : filepathToURL(`#contact`)}
    });
    postMetas.forEach(post => {
      feed.addItem({
        title : post.title,
        id : filepathToURL(post.outfile),
        link : filepathToURL(post.outfile),
        description : post.description,
        author : [
          {name : post.author, link : `${filepathToURL('')}/#contact`},
        ],
        contributor : [],
        date : post.dateUpdated || post.date,
        image : post.socialBanner || post.banner
      });
    });
    allTags.forEach(tag => feed.addCategory(tag));
    fs.writeFileSync('atom.xml', feed.atom1());
  });
}

function preprocessMarkdown(markdown, meta) {
  var dir = meta.filepath.split('/').slice(0, -1).join('/');
  return svgOverlay.markdownToHtml(markdown, dir);
}

function buildOneMarkdown(meta, prevMeta, nextMeta, metas) {
  var filepath = meta.filepath;
  var outfile = meta.outfile;
  var ispost = prevMeta || nextMeta;

  var pandocParams = [
    '--filter', 'filter.js', '--no-highlight', '-t', 'html5', '-f',
    'markdown_github-hard_line_breaks+yaml_metadata_block+markdown_in_html_blocks+auto_identifiers'
  ];
  var htmlPromise = spawnPromise(spawn('pandoc', pandocParams),
                                 preprocessMarkdown(meta.contents, meta));

  var headHtmlPromise = htmlPromise.then(html => {
    if (meta.mathjax) {
      html = html.replace(/\\&amp;/g, '&');
    }
    var tohighlight = html.search(/<pre[^<]*<code/) >= 0;
    if (tohighlight) {
      let window = (new JSDOM(html, {runScripts : "outside-only"})).window;
      window.eval(hl);
      window.eval(`hljs.initHighlighting();`)
      html = window.document.body.innerHTML;
    }

    var head = '<!doctype html>\n<head><meta charset="utf-8" />\n';
    head += `<title>${meta.title}</title>\n`;
    head += `<link href="${
                           filepathToAbspath('atom.xml')
                         }" type="application/atom+xml" rel="alternate" />\n`;
    head += social(outfile, meta.title, meta.description,
                   meta.socialBanner || meta.banner, meta.outfile);
    head += css;
    if (tohighlight) {
      head += hlcss;
    }

    if (meta.plotly) {
      head += plotlyPreamble;
    }

    if (meta.mathjax) {
      head += mathjaxPreamble;
    }

    head += '\n</head>\n';

    head += meta.banner ? banner(meta.banner) : '';

    if (ispost) {
      head += topnav();
    }

    head += headline(meta.title);

    if (ispost) {
      head += subline(meta);
    }

    return [ head, html ];
  });

  var postIndexP = filepath === 'index.md' ? metasTopostIndexPromise(metas)
                                           : Promise.resolve('');
  var footPromise = prevNextToFootPromise(prevMeta, nextMeta);

  Promise.all([ headHtmlPromise, postIndexP, footPromise ])
      .then(([ [ head, html ], postIndex, foothtml ]) => {
        console.log('done '+ outfile);
        writeFileAsync(outfile, '')
            .then(() => appendFileAsync(outfile, head))
            .then(() => appendFileAsync(outfile, postIndex))
            .then(() => appendFileAsync(outfile, html))
            .then(() => appendFileAsync(outfile, foothtml));
      });
}

function prevNextToFootPromise(prevMeta, nextMeta) {
  if (prevMeta || nextMeta) {
    var foot = `<p><small>`;
    if (prevMeta) {
      foot += `Previous: [${
                            prevMeta.title
                          }](${filepathToAbspath(prevMeta.outfile)})<br>`;
    }
    if (nextMeta) {
      foot +=
          `Next: [${nextMeta.title}](${filepathToAbspath(nextMeta.outfile)})`;
    }
    foot += '</small></p>'
    return spawnPromise(
        spawn('pandoc',
              [
                '-t', 'html5', '-f',
                'markdown_github-hard_line_breaks+markdown_in_html_blocks'
              ]),
        foot);
  }
  return Promise.resolve('');
}

function shortDate(d) {
  return `${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
}
function metasTopostIndexPromise(metas) {
  var md =
      '## All posts\n' +
      metas
          .map(meta => `- [${meta.title}](${
                                            filepathToAbspath(meta.outfile)
                                          }) (${
                                                shortDate(meta.date)
                                              }, ${meta.tags.join('/')})\n`)
          .join('');
  md += `\n(<a href="${filepathToAbspath('atom.xml')}">Feed</a>)`
  return spawnPromise(
      spawn('pandoc',
            [
              '-f', 'markdown_github-hard_line_breaks+markdown_in_html_blocks+auto_identifiers',
              '-t', 'html5'
            ]),
      md);
}

function fileToMeta(filepath) {
  var contents = fs.readFileSync(filepath, 'utf8');
  var outfile = filepath.replace(/md$/, 'html');
  var meta = Object.assign({}, defaultMeta, {filepath, outfile});
  meta.contents = contents;
  if (contents.indexOf('---\n') === 0) {
    meta = Object.assign(
        {}, meta,
        yaml.safeLoad(contents.substring(4, contents.indexOf('\n---\n', 4))));
    if (meta.date) {
      meta.date = new Date(meta.date);
    }
    if (meta.dateUpdated) {
      meta.dateUpdated = new Date(meta.dateUpdated);
    }
  }
  return meta;
}

function topnav() {
  return `  <ul class="top-nav">
    <li><a href="${filepathToAbspath('')}">Blog</a></li>
    <li><a href="${filepathToAbspath('#contact')}">Contact</a></li>
    <li><a href="${filepathToAbspath('atom.xml')}">Feed</a></li>
  </ul>`;
};

function subline(meta) {
  var t = filepathToAbspath('');
  var text = ``;
  var tagtext = meta.tags.map(s => `‘${s}’`).join('—');
  if (meta.date && (meta.tags && meta.tags.length)) {
    text += `Updated on ${meta.date.toUTCString()}, tagged with ${tagtext}.`;
  } else if (meta.date) {
    text += `Updated on ${meta.date.toUTCString()}.`;
  } else if (meta.tags && meta.tags.length) {
    text += `Tagged with ${tagtext}.`
  }
  return `<p><em>${text}</em></p>`;
}

function banner(url) {
  return `<figure class="full-width no-top"><img src="${url}"></figure>`;
}

function headline(title) { return `<h1>${title}</h1>`; }

function social(url, title, description, banner, outfile) {
  return `<meta name="description" content="${description}" />
<meta name="twitter:card" value="summary">
<meta property="og:title" content="${title}" />
<meta property="og:type" content="article" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${filepathToURL(outfile)}${banner}" />
<meta property="og:description" content="${description}" />\n`;
}

if (require.main === module) {
  build();
}
