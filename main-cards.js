function generateTileBackground () {
	
	// Aesthetics
	var trianglifyOpts = {
		noiseIntensity: 0.1, 
		cellpadding: 10, 
		cellsize: 50
	};
	var css = '.card { background-image: ' + new Trianglify(trianglifyOpts)
						.generate(250, 250)
						.dataUrl + ' }' +
				'.card.Action { background-image: ' + new Trianglify(trianglifyOpts)
						.generate(250, 250)
						.dataUrl + ' }',
		head = document.head,
		style = document.createElement('style');

	var tileBg = document.getElementById('tileBg');
	if (tileBg) head.removeChild(tileBg);

	style.type = 'text/css';
	if (style.styleSheet){
		style.styleSheet.cssText = css;
	} else {
		style.appendChild(document.createTextNode(css));
	}

	style.id = "tileBg";

	head.appendChild(style);

}

generateTileBackground();

document.addEventListener('DOMContentLoaded', function() {

	document.querySelector('.new-color')
	.addEventListener('click', generateTileBackground);

	var lastState = 0;
	var cards = document.querySelector('#cards');

	document.querySelector('.both-cards')
	.addEventListener('click', function() {
		cards.className = 'hipster bogan';
	});

	document.querySelector('.toggle-cards')
	.addEventListener('click', function() {

		var states = [
			'hipster', 'bogan'
		];

		cards.className = states[lastState++] || states[0];

		if (lastState >= states.length)
			lastState = 0;
	});
});

// Main card template
var card = Hogan.compile("<pair><card class='card {{Type}}'>"+
							"<h1>{{{Name}}}</h1>"+
							"<p>{{{Text}}}</p>"+
							"<category>{{Type}}</category>" +
							"{{#Counter}}" +
								"<counter>{{Counter}}</counter>" +
							"{{/Counter}}" +
						"</card></pair>");

// Get CSV
d3.csv("data-cards.csv", function(err, rows) {
	var page = d3.select('#cards');

	var cards = [];
	rows.map(function(row) {
		// Type,Name,Text,Points,Quantity,,,,,Notes
		if (row.Quantity)
			for (var i = row.Quantity - 1; i >= 0; i--)
				cards.push(newCard(row, i));
		else
			cards.push(newCard(row));
	});

	page.html(cards.join(''));

	function newCard (row, i) {
		var count = (i && row.Quantity > 1) ? (i+1) + " of " + row.Quantity : '';
		return card.render({
			Type: (row.Points) ? row.Points + ' points' : row.Type,
			Name: row.Name,
			Text: row.Text,
			Quantity: count,
			Notes: row.Notes
		});
	}
});

function titlify (title) {
	if (!title.match(': '))
		return title;

	title = title.split(/: /);
	return title[0] + "<br><span>" + title[1] + "</span>";
}