// Map
var heightMap = new Array(
	1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
	1.5, 2.0, 0.5, 0.5, 1.5, 1.5,
	1.5, 0.5, 1.5, 0.5, 1.5, 0.5,
	0.5, 0.5, 1.0, 1.0, 1.5, 2.0,
	2.0, 1.5, 1.0, 1.5, 2.0, 2.0
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

var gravity = .00175;
var jumpSpeed = .045;
var moveSpeed = .035;

var cameraX, playerX, playerY, playerDir, playerDY, update;
var keysHeld = new Array();

// Game Functions
function initGame()
{
	// Initial settings
	cameraX = 0;
	playerDir = 0;
	playerX = worldScaleX * (sections / 2);
	playerY = 2;
	playerDY = 0;

	// Set FPS
	update = setInterval(function() {
		updateGame();
		drawGame();
	}, 1000 / FPS);

	// Keypress events
	$("body").keydown(handleInputD);
	$("body").keyup(handleInputU);
}

function resetGame()
{
	// Disable input functions
	$("body").off("keydown", handleInputD);
	$("body").off("keyup", handleInputU);

	// Turn off update interval
	clearInterval(update);

	// Re-initialize game
	initGame();
}

function updateGame()
{
	// Update Camera
	cameraX = (sections / 2) - playerX;

	// Player Input
	playerDir = 1;//keyIsHeld(39) - keyIsHeld(37);

	// Gravity
	if (placeFree(playerX, playerY - .05)) playerDY -= gravity;
	else if (playerDY < 0) playerDY = 0;

	// Update Y
	for (var i = Math.abs(playerDY); i > 0; i--)
	{
		var j = copySign(i, playerDY);

		if (placeFree(playerX, playerY + j))
		{
			playerY += j;
			break;
		}
	}

	// Update X
	if (placeFree(playerX + (playerDir * moveSpeed), playerY)) playerX += playerDir * moveSpeed;
	else resetGame();
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
		var angle = 0;

		if (i == 0) angle = as;
		else if (i == heightMap.length - 1) angle = ae;
		
		if (angle != 0)
		{
			var x3 = originX + (Math.cos(angle) * rad);
			var y3 = originY + (Math.sin(angle) * rad);

			var x4 = originX + (Math.cos(angle) * canvasWidth * canvasHeight);
			var y4 = originY + (Math.sin(angle) * canvasWidth * canvasHeight);

			drawLine(x3, y3, x4, y4);
		}
	}

	// Draw player
	drawRectangleFilledColour((canvasWidth / 2) - 2, originY - (playerY * worldScaleY) - 2, 4, 4, "#0000FF");
	
	// Player colliding with ground?
	if (placeFree(playerX, playerY - .05)) var col = "#00FF00";
	else var col = "#FF0000";

	drawRectangleFilledColour(2, 2, 4, 4, col);
}

function handleInputD(e)
{
	if (keysHeld.indexOf(e.which) < 0) keysHeld.push(e.which);

	if (e.which == 38 && playerDY == 0) playerDY = jumpSpeed;
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
	x -= .005;

	if (x < 0 || x > heightMap.length) return false;
	else if (y < heightMap[Math.floor(x)]) return false;
	else return true;
}
