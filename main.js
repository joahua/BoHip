function generateTileBackground () {
	
	// Aesthetics
	var trianglifyOpts = {
		noiseIntensity: .1, 
		cellpadding: 10, 
		cellsize: 50
	};
	var css = '.bogan { background-image: ' + new Trianglify(trianglifyOpts)
						.generate(250, 250)
						.dataUrl + ' }' +
			  '.hipster { background-image: ' + new Trianglify(trianglifyOpts)
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
document.addEventListener('click', generateTileBackground);

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
	var page = d3.select('body');

	var cards = [];
	rows.map(function(row) {
		for (var i = row.Counter - 1; i >= 0; i--) {

			var classes = row.Position.split(' ');
			classes.push(row.Category);

			classes = classes.join(' ').toLowerCase();

			var count = (row.Counter > 1) ? (i+1) + " of " + row.Counter : '';

			cards.push(
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
				})
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