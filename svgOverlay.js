"use strict";

// All SVGs from
// https://svg-edit.github.io/svgedit !

var fs = require('fs');
var spawnSync = require('child_process').spawnSync;
var path = require('path');

function svgpathToSvgNodes(filepath) {
  var svg = fs.readFileSync(filepath, 'utf8');
  return svg.match(/((?:<rect|<ellipse|<circle)[^>]+>)/g);
}

function htmlToTag(html) { return html.slice(1).split(/\s+/)[0]; }

function findAttr(needles, haystack) {
  for (var needle of needles) {
    var re = new RegExp(` ${needle}="([^\\"]+)"`);
    var match = haystack.match(re);
    if (match) {
      return match[1];
    }
  }
  return null;
}
if (0) {
  var nodes = svgpathToSvgNodes('daycin.svg');
  nodes.map(s => findAttr('id'.split(','), s));
  findAttr('transform'.split(','), nodes[1]).match(/[0-9.]+/g)
  nodes[1].replace(/transform="[^\"]+"/, 'qwe')
}

var nodeIdToText = {
  wolf : "Wolf",
  museum : "Museum",
  madriver : "Mad R.",
  greatmiami0 : "Great Miami R.",
  stillwater : "Stillwater R.",
  riverside : "Riverside",
  woodland : "Woodland",
  wrightview : "Wright View",
  watershed : "Watershed",
  fairbornBeavercreek : "Fairborn, Beavercreek",
  greatmiami : "Great Miami R.",

  tokyo : "Tokyo",
  nagoya : "Nagoya",
  osaka : "Osaka, Kobe",
  lakebiwa : "Lake Biwa",
  fujisan : "Mt. Fuji",

  hudson : "Hudson R.",
  white : "White Mts.",
  green : "Green Mts.",
  ridgevalley : "Ridge & Valley Appalachians",

  cairo : "Cairo, Nile Delta",
  deadsea : "Dead Sea",
  transjordan : "Israel, West Bank, Amman (Jordan)",
  hijaz : "Hijaz Mts.",

  seine : "Seine R.",
  rhine : "Rhine R. & Valley",
  po : "Po Valley",
  carpathian : "Carpathian Mts.",
  transylvanian : "Transylvanian Mts.",
  irongate : "Iron Gates",
  danube : "Danube R.",
  balkan : "Balkan Mts.",
};

function cleanSvgNode(str) {
  var tag = htmlToTag(str);
  var id = findAttr('id'.split(','), str);

  var x = +findAttr('x,cx'.split(','), str);
  var y = +findAttr('y,cy'.split(','), str);
  if (tag === 'rect') {
    x += (+findAttr([ 'width' ], str)) / 2;
  }

  var offset = +findAttr('r,ry,height'.split(','), str);
  var finalY = y + offset + 10;

  var fixedStr = str.replace(/stroke-width="[0-9.]+"/, 'stroke-width="10"')
                     .replace(/stroke="[^\"]+"/, '')
                     .replace(/fill="[^\"]+"/, '')
                     .replace('stroke-linecap="null"', '')
                     .replace('stroke-linejoin="null"', '')
                     .replace('stroke-dasharray="null"', '');

  var text = nodeIdToText[id] || id;
  var textParams =
      'dominant-baseline="hanging" font-size="60" text-anchor="middle"';
  return `
  <g filter="url(#dropShadow)" stroke="#ddd" fill="#ddd">
    ${fixedStr}
    <text ${textParams} x="${x}" y="${finalY}">${text}</text>
  </g>`;
}

function mkImgSvgContainer(imagepath, alt, svgNodes, fsImagePath) {
  fsImagePath = fsImagePath || imagepath;

  var small = fsImagePath.replace('.jpg', '-small.jpg')
                  ? imagepath.replace('.jpg', '-small.jpg')
                  : imagepath;

  var size = imageToSize(fsImagePath);
  var nodes = svgNodes.map(cleanSvgNode).join('\n\n');
  var svgparams =
      'class="overlay" preserveAspectRatio="xMinYMin" width="100%" height="100%"';
  return `
  <div class="img-svg">
    <a href="${imagepath}">
      <img src="${small}" alt="${alt}" />
      <svg ${svgparams} viewbox="0 0 ${size[0]} ${size[1]}">
        <filter id="dropShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
          <feOffset dx="2" dy="4" />
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        ${nodes}
      </svg>
    </a>
  </div>`;
}

/*
Just create an SVG with the same pixel dimension as the JPG,
add the JPG to it as a background, create your annotations
IN THE SVG, delete the JPG background, and save the SVG as an overlay.
*/
function mkImgSvgContainerSimple(imagepath, alt, svgContents, fsImagePath) {
  fsImagePath = fsImagePath || imagepath;

  var small = fsImagePath.replace('.jpg', '-small.jpg')
                  ? imagepath.replace('.jpg', '-small.jpg')
                  : imagepath;
  return `
  <div class="img-svg">
    <a href="${imagepath}">
      <img src="${small}" alt="${alt}" />
      ${svgContents}
    </a>
  </div>`;
}

function imageToSize(imagepath) {
  return spawnSync('identify', [ imagepath ],
                   {input : undefined, encoding : 'utf8'})
      .stdout.split(/\s+/)[2]
      .split('x');
}

function wrapFigure(contents, alt, url, hoverurl, links = undefined) {
  if (links === undefined) {
    links = ` (<a href="${url}">JPG</a>, <a href="${hoverurl}">SVG</a>)`;
  }
  return `<figure>
  ${contents}
  <figcaption>${alt}${links}</figcaption>
</figure>`;
}

function unindentHtml(str) {
  return str.replace(/\n\s+/g, '\n').replace(/\n+/g, '\n');
}

function markdownToHtml(md, parentpath) {
  parentpath = parentpath || '';
  return md.replace(
      /\n!\[([^\]]+)\]\(([^\)]+)\)\s*HOVEROVERLAY\(([^\)]+)\)(.*)\n/g,
      (match, alt, url, hoverurl, rest) => {
        const simple = rest.includes('simple');
        var fsHoverURL = path.join(parentpath, hoverurl);
        var fsURL = path.join(parentpath, url);
        return '\n' +
               unindentHtml(wrapFigure(
                   simple ? mkImgSvgContainerSimple(
                                url, alt, fs.readFileSync(fsHoverURL), fsURL)
                          : mkImgSvgContainer(
                                url, alt, svgpathToSvgNodes(fsHoverURL), fsURL),
                   alt, url, hoverurl, simple ? "" : undefined)) +
               '\n';
      });
}

if (0) {
  var testmd =
      `hi\n![alt](post/texshade/europe-from-east.jpg) HOVEROVERLAY(post/texshade/europe-from-east.svg)\n\nWow!`;
  console.log(markdownToHtml(testmd));

  console.log(unindentHtml(mkImgSvgContainer('daycin.jpg', 'yowup',
                                             svgpathToSvgNodes('daycin.svg'))))
}

module.exports = {markdownToHtml};
