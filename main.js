// Map
var heightMap = new Array(
	1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
	1.5, 2.0, 0.5, 0.5, 1.5, 1.5,
	1.5, 0.5, 1.5, 0.5, 1.5, 0.5,
	0.5, 0.5, 1.0, 1.0, 1.5, 2.0,
	0.5, 1.5, 1.0, 1.5, 2.0, 2.0
);

// Game settings
var FPS = 60;

var canvasWidth = 800;
var canvasHeight = 600;

var originX = canvasWidth / 2;
var originY = canvasHeight;

var sections = 6;
var worldScaleX = Math.PI / sections;
var worldScaleY = 150;

var cameraX, playerX, playerY, playerDir, update;
var keysHeld = new Array();

// Game Functions
function initGame()
{
	// Initial settings
	cameraX = 0;
	playerDir = 0;
	playerX = worldScaleX * (sections / 2);
	playerY = 1;

	// Set FPS
	update = setInterval(function() {
		updateGame();
		drawGame();
	}, 1000 / FPS);

	// Keypress Events
	$("body").keydown(handleInputD);
	$("body").keyup(handleInputU);
}

function resetGame()
{
	// 
	$("body").off("keydown", handleInputD);
	$("body").off("keyup", handleInputU);
	clearInterval(update);
	initGame();
}

function updateGame()
{
	// Update Camera
	cameraX = (sections / 2) - playerX;

	// Player Input
	playerDir = keyIsHeld(39) - keyIsHeld(37);
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

		// Draw ends of map
		if (i == 0)
		{
			var x3 = originX + (Math.cos(as) * rad);
			var y3 = originY + (Math.sin(as) * rad);

			var x4 = originX + (Math.cos(as) * canvasWidth * canvasHeight);
			var y4 = originY + (Math.sin(as) * canvasWidth * canvasHeight);

			drawLine(x3, y3, x4, y4);
		}
		else if (i == heightMap.length - 1)
		{
			var x3 = originX + (Math.cos(ae) * rad);
			var y3 = originY + (Math.sin(ae) * rad);

			var x4 = originX + (Math.cos(ae) * canvasWidth * canvasHeight);
			var y4 = originY + (Math.sin(ae) * canvasWidth * canvasHeight);

			drawLine(x3, y3, x4, y4);
		}
	}

	// Draw player
	drawRectangleFilledColour((canvasWidth / 2) - 2, originY - (playerY * worldScaleY) - 2, 4, 4, "#0000FF");
	
	// Move the camera
	if (placeFree(playerX + (playerDir * .05), playerY)) playerX += playerDir * .05;

	// Player colliding with ground?
	if (placeFree(playerX, playerY)) var col = "#00FF00";
	else var col = "#FF0000";

	drawRectangleFilledColour(2, 2, 4, 4, col);
}

function handleInputD(e)
{
	if (keysHeld.indexOf(e.which) < 0) keysHeld.push(e.which);

	if (e.which == 38 && placeFree(playerX, playerY + .5)) playerY += .5;
	if (e.which == 40 && placeFree(playerX, playerY - .5)) playerY -= .5;
}

function handleInputU(e)
{
	var check = keysHeld.indexOf(e.which);
	if (check >= 0) keysHeld.splice(check, 1);
}

function keyIsHeld(e)
{
	if (keysHeld.indexOf(e) >= 0) return true;
	else return false;
}

function placeFree(x, y)
{
	if (x < 0 || x > heightMap.length) return false;
	else if (y < heightMap[Math.floor(x)]) return false;
	else return true;
}
