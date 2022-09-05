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

const sliderRange = 7;
const steps = 100;
const stringWeight = 1;
const stringGap = 8;
const stringSize = 0.7;

let phase = 0;
let wobble = 0;
const wobbleInc = 0.018;
const phaseInc = 0.0001;
const zoffInc = 0.001;

const paperWidth = 450;
const paperHeight = 297;
const sizeFactor = 3.7714285714;
const circleNumber = 200;
const fileName = `a set of ${circleNumber} uncertain circles`;

new p5((p5) => {
  p5.setup = () => {
    // make an A3 page
    // p5.createCanvas(800, 600, p5.SVG);
    // p5.createCanvas(paperWidth * sizeFactor, paperHeight * sizeFactor);
    p5.createCanvas(p5.windowWidth, p5.windowHeight);
    // p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.SVG);
    // console.log("getpos", p5.getItem("sliderPosition"));
    // const sliderPos =
    //   p5.getItem("sliderPosition") != undefined
    //     ? p5.getItem("sliderPosition")
    //     : p5.storeItem("sliderPosition", Math.floor(p5.random() * sliderRange));

    // console.log("pos", sliderPos);
    // slider = p5.createSlider(0, sliderRange, sliderPos, sliderRange / steps);
    // slider.addClass("slider");

    // slider.input(() => {
    //   p5.clear();
    //   p5.redraw();
    //   p5.storeItem("sliderPosition", slider.value());
    // });

    // setInitialValues();

    desiredLength = Math.min(p5.width, p5.height) * 2;

    // p5.noLoop();
  };
  p5.draw = () => {
    p5.clear();
    p5.background(255);
    wobble = 0;
    for (let x = 0; x < circleNumber; x++) {
      // phase = Math.random() * p5.TWO_PI;
      makeCircle(p5.width / 2, p5.height / 2, wobble, true);
      wobble += wobbleInc;
    }
    phase += phaseInc;
    zoff += zoffInc;
  };

  const makeCircle = (x, y, wobble, close = false) => {
    const gap = close ? 0 : stringGap;

    p5.push();
    // p5.fill(p5.random(255), 0, 0);
    // p5.rect(x, y, gridWidth, gridHeight);
    circumference = 0;
    let prevX, prevY;
    // p5.translate(p5.width / 2, p5.height / 2 - 50);
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

      //perlin
      // let r = p5.map(
      //   p5.noise(xoff, yoff, zoff),
      //   0,
      //   1,
      //   p5.width / 4,
      //   p5.width / 2
      // );

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

  // p5.mousePressed = (event) => {
  //   if (event.target.className === "slider") return;
  //   animate = !animate;
  //   if (animate) {
  //     p5.loop();
  //   } else {
  //     p5.noLoop();
  //   }
  // };

  p5.windowResized = () => {
    reloadPage();
  };

  // trigger png save
  p5.mouseClicked = () => {
    p5.saveCanvas(`${fileName} #${Date.now()}`, "png");
  };

  // save svg
  // function downloadSvg() {
  //   let svgElement = document.getElementsByTagName("svg")[0];
  //   let svg = svgElement.outerHTML;
  //   let file = new Blob([svg], { type: "plain/text" });
  //   let a = document.createElement("a"),
  //     url = URL.createObjectURL(file);

  //   a.href = url;
  //   a.download = fileName + " #" + Date.now() + ".svg";
  //   document.body.appendChild(a);
  //   a.click();

  //   setTimeout(function () {
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  //   }, 0);
  // }

  //function setInitialValues() {
  // desiredLength = Math.min(p5.width, p5.height) * p5.PI * stringSize;
  // slider.position(10, p5.height - 30);
  // slider.style("width", p5.width - 25 + "px");
  //}
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
