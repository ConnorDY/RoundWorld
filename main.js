var heightMap = new Array(
	1.0, 1.0, 1.0, 1.0,
	1.0, 1.5, 2.0, 2.0,
	0.5, 0.5, 1.5, 1.5,
	1.5
);

var FPS = 60;

var canvasWidth = 800;
var canvasHeight = 600;

var originX = canvasWidth / 2;
var originY = canvasHeight;

var sections = 4;
var worldScaleX = Math.PI / sections;
var worldScaleY = 150;

var stopCamera, cameraX, playerY, update;

function initGame()
{
	// Initial settings
	stopCamera = false;
	cameraX = 0;
	playerY = 1;

	// Set FPS
	update = setInterval(function() {
		updateGame();
		drawGame();
	}, 1000 / FPS);

	// Keypress Events
	$("body").keydown(handleInput);
}

function resetGame()
{
	// 
	$("body").off("keydown", handleInput);
	clearInterval(update);
	initGame();
}

function updateGame()
{
	// Get height of center
	var centerSegment = Math.floor(-cameraX + (sections / 2));
	var centerY = heightMap[centerSegment];

	if (playerY < centerY) resetGame();//playerY += .5;
}

function drawGame()
{
	// Clear the canvas
	var c = getCanvas();
	c.clearRect(0, 0, canvasWidth, canvasHeight);

	// Draw outer rectangle
	drawRectangle(1, 1, canvasWidth - 2, canvasHeight - 2, 2);

	// Draw the world
	var sX = Math.floor(-cameraX);
	if (sX < 0) sX = 0;

	for (var i = sX; i < sX + sections + 1 && i < heightMap.length; i++)
	{
		// Draw curve
		var as = Math.PI + ((i + cameraX) * worldScaleX);
		var ae = as + worldScaleX;

		var rad = heightMap[i] * worldScaleY;

		drawArc(originX, originY, as, ae, rad, 2);

		// Draw line between this curve and the last (if the radii are different)
		if (i > 0 && heightMap[i] != heightMap[i - 1])
		{
			var radL = heightMap[i - 1] * worldScaleY;

			var x1 = originX + (Math.cos(as) * rad);
			var y1 = originY + (Math.sin(as) * rad);

			var x2 = originX + (Math.cos(as) * radL);
			var y2 = originY + (Math.sin(as) * radL);

			drawLine(x1, y1, x2, y2, 2);
		}

		// Draw end of map
		if (i == heightMap.length - 1)
		{
			var x3 = originX + (Math.cos(ae) * rad);
			var y3 = originY + (Math.sin(ae) * rad);

			var x4 = originX + (Math.cos(ae) * canvasWidth * canvasHeight);
			var y4 = originY + (Math.sin(ae) * canvasWidth * canvasHeight);

			drawLine(x3, y3, x4, y4);

			if (linesIntersect(x3, y3, x4, y4, 0, 0, canvasWidth, 0)) stopCamera = true;
		}
	}

	// Draw player
	drawRectangleFilledColour((canvasWidth / 2) - 2, originY - (playerY * worldScaleY) - 2, 4, 4, "#0000FF");
	
	// Move the camera
	if (!stopCamera) cameraX -= .01;
}

function handleInput(e)
{
	if (e.which == 38) playerY += .5;
	if (e.which == 40) playerY -= .5;
}
