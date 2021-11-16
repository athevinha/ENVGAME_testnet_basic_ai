let outputWidth;
let outputHeight;

let faceTracker; 
let videoInput;

let imgSpidermanMask; 
let imgDogEarRight, imgDogEarLeft, imgDogNose; 

let selected = -1; 


function preload()
{
  imgSpidermanMask = loadImage("https://res.cloudinary.com/envgame/image/upload/v1637054825/download_sfkxsu.png");
  imgDogEarRight = loadImage("https://res.cloudinary.com/envgame/image/upload/v1637054412/489969_1_bzmnc6.png");
  imgDogEarLeft = loadImage("https://res.cloudinary.com/envgame/image/upload/v1637054412/489969_1_bzmnc6.png");
  imgDogNose = loadImage("https://res.cloudinary.com/envgame/image/upload/v1637054514/315274_1_ncderg.png");
}
function setup()
{
  const maxWidth = Math.min(windowWidth, windowHeight);
  pixelDensity(1);
  outputWidth = maxWidth;
  outputHeight = maxWidth * 0.75;

  createCanvas(outputWidth, outputHeight);


  videoInput = createCapture(VIDEO);
  videoInput.size(outputWidth, outputHeight);
  videoInput.hide();

  
  const sel = createSelect();
  const selectList = ['Envgame Filter']; 
  sel.option('Tree Filter', -1); 
  for (let i = 0; i < selectList.length; i++)
  {
    sel.option(selectList[i], i);
  }
  sel.changed(applyFilter);


  faceTracker = new clm.tracker();
  faceTracker.init();
  faceTracker.start(videoInput.elt);
}


function applyFilter()
{
  selected = this.selected(); 
}


function draw()
{
  image(videoInput, 0, 0, outputWidth, outputHeight); // render video from webcam
if(selected == 0){
    drawSpidermanMask()
}
else{
    drawDogFace();
}
}


function drawSpidermanMask()
{
  const positions = faceTracker.getCurrentPosition();
  if (positions !== false)
  {
    push();
    const wx = Math.abs(positions[13][0] - positions[1][0]) * 1.2; // The width is given by the face width, based on the geometry
    const wy = Math.abs(positions[7][1] - Math.min(positions[16][1], positions[20][1])) * 1.2; // The height is given by the distance from nose to chin, times 2
    translate(-wx/2, -wy/2);
    image(imgSpidermanMask, positions[62][0], positions[62][1], wx, wy); // Show the mask at the center of the face
    pop();
  }
}


function drawDogFace()
{
  const positions = faceTracker.getCurrentPosition();
  if (positions !== false)
  {
    if (positions.length >= 20) {
      push();
      translate(-100, -150);
      image(imgDogEarRight, positions[20][0] -50 , positions[20][1]);
      pop();
    }

    if (positions.length >= 16) {
      push();
      translate(-20, -150); 
      image(imgDogEarLeft, positions[16][0] -50 , positions[16][1]);
      pop();
    }

    if (positions.length >= 62) {
      push();
      translate(-57, -20);
      image(imgDogNose, positions[62][0], positions[62][1]);
      pop();
    }
  }
}

function windowResized()
{
  const maxWidth = Math.min(windowWidth, windowHeight);
  pixelDensity(1);
  outputWidth = maxWidth;
  outputHeight = maxWidth * 0.75; 
  resizeCanvas(outputWidth, outputHeight);
}