import { createNoise3D } from "./simplex-noise.js";
const noise3D = createNoise3D();

let zoff = 0;
let circumference;
let desiredLength;

const radDivisions = 14;
const stringWidth = 0.7;
const stringGap = 8;

let phase = 0;
let wobble = 0;
const wobbleInc = 0.019;
const phaseInc = 0.0001;
const zoffInc = 0.0006;
const circleNumber = 200;

let circleGroup;

let text;
let prevTime = 0;

let width;
let height;

// info and download buttons for the html
let closeButton;
let downloadButton;
let initialInfoButtonHtml;
let initialDownloadButtonHtml;
let infoHtml;
let hideInfoHtml = true;

// let
//  taken from paper.js docs http://paperjs.org/tutorials/getting-started/using-javascript-directly/
paper.install(window);
window.onload = function () {
  // info and download button
  infoHtml = document.getElementById("info-inner");
  closeButton = document.getElementById("close-button");
  initialInfoButtonHtml = closeButton.innerHTML;

  downloadButton = document.getElementById("download");
  initialDownloadButtonHtml = downloadButton.innerHTML;
  closeButton.addEventListener("click", hideInfo);
  downloadButton.addEventListener("click", saveImage);

  //paper setup
  paper.setup("myCanvas");
  width = paper.view.size.width;
  height = paper.view.size.height;

  let rect = new Path.Rectangle({
    point: [0, 0],
    size: [width, height],
    strokeColor: "white",
  });
  rect.sendToBack();
  rect.fillColor = "#ffffff";

  desiredLength = Math.min(width, height) * 2.2;

  circleGroup = new paper.Group();
  circleGroup.applyMatrix = false;

  // text = new PointText(new Point(200, 50));
  // text.justification = "center";
  // text.fillColor = "black";
  // text.content = "framerate";

  view.onFrame = function (event) {
    if (event.count % 2 === 0) {
      // text.content = "framerate = " + Math.floor(1 / (event.time - prevTime));
      prevTime = event.time;

      circleGroup.removeChildren();
      wobble = 0;
      for (let x = 0; x < circleNumber; x++) {
        makeCircle(width, height, wobble, true);
        wobble += wobbleInc;
      }
      phase += phaseInc;
      zoff += zoffInc;
    }
  };
  // if not doing animation then use this to draw
  //view.draw();

  view.onResize = function (event) {
    width = paper.view.size.width;
    height = paper.view.size.height;
    desiredLength = Math.min(width, height) * 2.2;
  };
};

const makeCircle = (width, height, wobble, close = false) => {
  const gap = close ? 0 : stringGap;

  circumference = 0;
  let prevX, prevY;
  // p5.stroke(0);
  // p5.noFill();
  // p5.strokeWeight((stringWeight * p5.width) / 1580);
  // p5.strokeWeight(stringWeight);
  // p5.strokeCap(p5.ROUND);
  // p5.noFill();

  // shift shapes across by radius
  const add = desiredLength / Math.PI;
  // p5.translate(x, y);

  let shapeArray = [];

  let noiseMax = wobble;
  for (
    let a = phase;
    a < Math.PI * 2 + phase - Math.radians(gap);
    a += Math.radians(radDivisions)
  ) {
    let xoff = mapRange(Math.cos(a + phase), -1, 1, 0, noiseMax);
    let yoff = mapRange(Math.sin(a + phase), -1, 1, 0, noiseMax);

    //   simplex;
    let r = mapRange(noise3D(xoff, yoff, zoff), -1, 1, width / 4, width / 2);

    let x = r * Math.cos(a);
    let y = r * Math.sin(a);

    shapeArray.push([x, y]);

    if (prevX && prevY) {
      circumference += dist(prevX, prevY, x, y);
    }

    prevX = x;
    prevY = y;
  }
  var myPath = new paper.Path();
  myPath.parent = circleGroup;
  myPath.strokeColor = "black";
  myPath.strokeWidth = stringWidth;

  // p5.scale(desiredLength / circumference);
  // p5.beginShape();
  shapeArray.forEach((point) =>
    myPath.add(new Point(point[0] + width / 2, point[1] + height / 2))
  );

  myPath.closed = true;
  myPath.smooth();
  // myPath.fullySelected = true;
  myPath.scale(desiredLength / circumference);
  // close ? p5.endShape(p5.CLOSE) : p5.endShape();
};

// Helper functions for radians and degrees.
Math.radians = function (degrees) {
  return (degrees * Math.PI) / 180;
};

Math.degrees = function (radians) {
  return (radians * 180) / Math.PI;
};

// linearly maps value from the range (a..b) to (c..d)
function mapRange(value, a, b, c, d) {
  // first map value from (a..b) to (0..1)
  value = (value - a) / (b - a);
  // then map it from (0..1) to (c..d) and return it
  return c + value * (d - c);
}

function dist(x1, y1, x2, y2) {
  let dx = x2 - x1;
  let dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

function hideInfo(e) {
  if (hideInfoHtml) {
    infoHtml.classList.remove("hidden");
    closeButton.innerHTML = "&darr; close";
  } else {
    infoHtml.classList.add("hidden");
    closeButton.innerHTML = initialInfoButtonHtml;
  }
  hideInfoHtml = !hideInfoHtml;
}
function saveImage(e) {
  downloadAsPNG();
}

function downloadAsPNG() {
  // if (!fileName) {
  let fileName = `Standard Strings #${Date.now()}.png`;
  // }

  // var url =
  //   "data:image/svg+xml;utf8," +
  //   encodeURIComponent(
  //     paper.project.exportSVG({ bounds: "view", asString: true })
  //   );

  // var link = document.createElement("a");
  // link.download = fileName;
  // link.href = url;
  // link.click();

  view.element.toBlob((blob) => {
    // ...and get it as a URL.
    const url = URL.createObjectURL(blob);
    // Open it in a new tab.
    // window.open(url, "_blank");

    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
  });
}
