// Polar Perlin Noise Loop
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/136-polar-perlin-noise-loops.html
// https://youtu.be/ZI1dmHv3MeM
// https://editor.p5js.org/codingtrain/sketches/sy1p1vnQn

// https://github.com/jwagner/simplex-noise.js/blob/main/README.md
// import { createNoise3D } from "https://cdn.skypack.dev/simplex-noise@4.0.0";
import { createNoise3D } from "./simplex-noise.js";
const noise3D = createNoise3D();

let zoff = 0;
let slider;

// store previous values of shape to calculate distance

let circumference;

let desiredLength;

const stringWeight = 1;
const stringGap = 8;

let phase = 0;
let wobble = 0;
const wobbleInc = 0.018;
const phaseInc = 0.0001;
const zoffInc = 0.001;
const circleNumber = 200;
const fileName = `a set of ${circleNumber} uncertain circles`;

// info and download buttons
let closeButton;
let downloadButton;
let infoHtml;
let hideInfoHtml = true;

new p5((p5) => {
  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    desiredLength = Math.min(p5.width, p5.height) * 2.4;

    // info buttons
    infoHtml = p5.select("#info-inner");
    closeButton = p5.select("#close-button");
    downloadButton = p5.select("#download");

    document.getElementById("download").addEventListener("click", saveImage);
  };
  p5.draw = () => {
    p5.background(255);
    wobble = 0;
    for (let x = 0; x < circleNumber; x++) {
      makeCircle(p5.width / 2, p5.height / 2, wobble, true);
      wobble += wobbleInc;
    }
    phase += phaseInc;
    zoff += zoffInc;
  };

  const makeCircle = (x, y, wobble, close = false) => {
    const gap = close ? 0 : stringGap;
    p5.push();
    circumference = 0;
    let prevX, prevY;
    p5.stroke(0);
    p5.noFill();
    p5.strokeWeight((stringWeight * p5.width) / 1580);
    p5.strokeCap(p5.ROUND);
    p5.noFill();

    // shift shapes across by radius
    const add = desiredLength / p5.PI;
    p5.translate(x, y);

    let shapeArray = [];

    let noiseMax = wobble;
    for (
      let a = phase;
      a < p5.TWO_PI + phase - p5.radians(gap);
      a += p5.radians(1)
    ) {
      let xoff = p5.map(p5.cos(a + phase), -1, 1, 0, noiseMax);
      let yoff = p5.map(p5.sin(a + phase), -1, 1, 0, noiseMax);

      //   simplex;
      let r = p5.map(
        noise3D(xoff, yoff, zoff),
        -1,
        1,
        p5.width / 4,
        p5.width / 2
      );

      let x = r * p5.cos(a);
      let y = r * p5.sin(a);

      shapeArray.push([x, y]);

      if (prevX && prevY) {
        circumference += p5.dist(prevX, prevY, x, y);
      }

      prevX = x;
      prevY = y;
    }
    p5.scale(desiredLength / circumference);
    p5.beginShape();
    shapeArray.forEach((point) => p5.vertex(point[0], point[1]));
    close ? p5.endShape(p5.CLOSE) : p5.endShape();
    p5.pop();
  };

  p5.windowResized = () => {
    reloadPage();
  };

  // trigger png save
  const saveImage = () => {
    console.log("creating an image for you");
    p5.saveCanvas(`${fileName} #${Date.now()}`, "png");
    downloadButton.html("Downloading...");
    resetDownloadText();
  };

  const resetDownloadText = debounce(function () {
    downloadButton.html("Download image");
  }, 1000);
});

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const reloadPage = debounce(function () {
  location.reload();
}, 250);

const hideInfo = () => {
  console.log("hi");
  if (hideInfoHtml) {
    infoHtml.removeClass("hidden");
    closeButton.html("X close");
  } else {
    infoHtml.addClass("hidden");
    closeButton.html("info");
  }
  hideInfoHtml = !hideInfoHtml;
};

// html stuff
document.getElementById("close-button").addEventListener("click", hideInfo);
