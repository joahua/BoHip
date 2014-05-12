function generateTileBackground () {
	
	// Aesthetics
	var trianglifyOpts = {
		noiseIntensity: 0.1, 
		cellpadding: 10, 
		cellsize: 50
	};
	var css = '.card.bogan { background-image: ' + new Trianglify(trianglifyOpts)
						.generate(250, 250)
						.dataUrl + ' }' +
				'.card.hipster { background-image: ' + new Trianglify(trianglifyOpts)
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
		cards.className = 'hipster bogan'
	})

	document.querySelector('.toggle-cards')
	.addEventListener('click', function() {

		var states = [
			'hipster'
			, 'bogan'
			// , 'hipster bogan'
		];

		cards.className = states[lastState++] || states[0];

		if (lastState >= states.length)
			lastState = 0;
	});
});

// Main card template
var card = Hogan.compile("<card class='card {{Classes}}'>"+
							"<h1>{{{Title}}}</h1>"+
							"<category>{{Category}}</category>" +
							"{{#Counter}}" +
								"<counter>{{Counter}}</counter>" +
							"{{/Counter}}" +
						"</card>");

// Get CSV
d3.csv("data.csv", function(err, rows) {
	var page = d3.select('#cards');

	var cards = [];
	rows.map(function(row) {
		for (var i = row.Counter - 1; i >= 0; i--) {

			var classes = row.Position.split(' ');
			classes.push(row.Category);

			classes = classes.join(' ').toLowerCase();

			var count = (row.Counter > 1) ? (i+1) + " of " + row.Counter : '';

			cards.push("<pair>",
				// Bogan
				card.render({
					Title: titlify(row.Bogan),
					Classes: classes + ' bogan',
					Category: row.Category,
					Counter: count
				}),

				// Hipster
				card.render({
					Title: titlify(row.Hipster),
					Classes: classes + ' hipster',
					Category: row.Category,
					Counter: count
				}),
				"</pair>"
			);
		}
	});

	page.html(cards.join(''));
});

function titlify (title) {
	if (!title.match(': '))
		return title;

	title = title.split(/: /);
	return title[0] + "<br><span>" + title[1] + "</span>";
}