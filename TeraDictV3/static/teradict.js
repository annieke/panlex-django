// jQuery autofill for previously chosen input language & output langauge
// currently under maintenance
$(document).ready(function () {
	$('input.lang').change(function(e) {
		var target = $(e.target);
		$.post('/set', { param: target.attr('list'), value: target.val(), csrfmiddlewaretoken: $('[name="csrfmiddlewaretoken"]').val() });
	});
});

// global variable for language variety list
var lvs;
// 
$(document).ready(function() {
	$.get({ url: '/static/lvlist.json', dataType: 'json' })
	.done(function (data) {
		lvs = data;

		$('input.lang').autocomplete({ source: suggestLv });
	});
});

function suggestLv(req, res) {
	var term = req.term.trim();

	if (term.length < 2) return;

	var tdTerm = term.toLowerCase().replace(/\s+|['-]/g, '');

	term = new RegExp($.ui.autocomplete.escapeRegex(term));
	tdTerm = new RegExp($.ui.autocomplete.escapeRegex(tdTerm));

	var suggestions = [];

	lvs.forEach(function (lv) {
		if (lv.uid.match(term) || lv.tt.match(term) || lv.td.match(tdTerm)) {
		  suggestions.push(lv.tt + ' (' + lv.uid + ')');
		}
	});

	res(suggestions);
}

function panlexQuery(url, data) {
	return $.ajax({
		url: "https://api.panlex.org" + url,
		data: JSON.stringify(data),
		dataType: "json",
		type: "POST"
	});
}

function findTranslation() {
	var word = $('#word').val();

	var inlang, outlang, m;

	if (m = $('#lang1').val().match(/\(([a-z]{3}-\d{3})\)/)) inlang = m[1];
	if (m = $('#lang2').val().match(/\(([a-z]{3}-\d{3})\)/)) outlang = m[1];

	if (inlang === undefined || outlang === undefined) return;

	panlexQuery('/ex', { uid: inlang, tt: word })
	.done(function (data) {
		var wordID = data.result[0].ex;
		panlexQuery('/ex', { trex: wordID, uid: outlang, include: "trq", sort: "trq desc", limit: 1 })
		.done(function (data) {
			var translation = data.result[0].tt;
			$('#result').text(word + " in " + outlang + " is " + translation);
		})
	});
}
