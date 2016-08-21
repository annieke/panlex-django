// jQuery function for preloader
$(window).on('load', function() {
	$('#preloader').fadeOut();
	$('.spinner-wrapper').delay(250).fadeOut('slow');
});

// jQuery autofill for previously chosen input language & output langauge
// currently under maintenance!!
$(document).ready(function () {
	$('.typeahead').bind('typeahead:change', function(ev, suggestion) {
		var target = $(ev.target);
		$.post('/set', { param: target.attr('id'), value: target.typeahead('val'), csrfmiddlewaretoken: $('[name="csrfmiddlewaretoken"]').val() });
  });
});

// // global variable for language variety list
// var lvs;
// // autocomplete function for inlang & outlang inputs
// // retrieves data from JSON file
// $(document).ready(function() {
// 	$.get({ url: '/static/lvlist.json', dataType: 'json' })
// 	.done(function (data) {
// 		lvs = data;
//
// 		$('input.lang').autocomplete({ source: suggestLv });
// 	});
// });
//
// // helper function for generating autocomplete list
// // (comment more & understand this!)
// function suggestLv(req, res) {
// 	var term = req.term.trim();
//
// 	if (term.length < 2) return;
//
// 	var tdTerm = term.toLowerCase().replace(/\s+|['-]/g, '');
//
// 	term = new RegExp($.ui.autocomplete.escapeRegex(term));
// 	tdTerm = new RegExp($.ui.autocomplete.escapeRegex(tdTerm));
//
// 	var suggestions = [];
//
// 	lvs.forEach(function (lv) {
// 		if (lv.uid.match(term) || lv.tt.match(term) || lv.td.match(tdTerm)) {
// 		  suggestions.push(lv.tt + ' (' + lv.uid + ')');
// 		}
// 	});
//
// 	res(suggestions);
// }

var lvs;

$(document).ready(function () {
    $.get({ url: '/static/lvlist.json', dataType: 'json' })
    .done(function (data) {
        lvs = data;
        $('#the-basics input.typeahead').typeahead({
					hint: true,
					highlight: true,
					minLength: 2
				},
				{ source: suggestLv,
					limit: 15,
					display: 'name'
				})
        .on('typeahead:select', function (e, suggestion) {
                $('#bar').val(suggestion.id);
            });
    });
});

function suggestLv(query, syncResults) {
    query = query.trim();
    var tdQuery = query.toLowerCase().replace(/[ -']/g, '');

    query = regexEscape(query);
    tdQuery = regexEscape(tdQuery);

    var suggestions = [];

    for (var i = 0; i < lvs.length; i++) {
        var lv = lvs[i];
        if (lv.uid.match(query) || lv.tt.match(query) || lv.td.match(tdQuery)) {
            suggestions.push({ id: lv.lv, name: lv.tt + ' (' + lv.uid + ')' });
            if (suggestions.length === 15) break;
        }
    }

    syncResults(suggestions);
}

function regexEscape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// simple query function to the PanLex API
function panlexQuery(url, data) {
	return $.ajax({
		url: "https://api.panlex.org" + url,
		data: JSON.stringify(data),
		dataType: "json",
		type: "POST"
	});
}

// translation function leveraging query function & text in inputs
function findTranslation() {
	var word = $('#word').val();

	var inlang, outlang, m;

	if (m = $('#inlang').val().match(/\(([a-z]{3}-\d{3})\)/)) inlang = m[1];
	if (m = $('#outlang').val().match(/\(([a-z]{3}-\d{3})\)/)) outlang = m[1];

	if (inlang === undefined || outlang === undefined) return;

	panlexQuery('/ex', { uid: inlang, tt: word })
	.done(function (data) {
		if (data.resultNum !== 0) {
			var wordID = data.result[0].ex;
			panlexQuery('/ex', { trex: wordID, uid: outlang, include: "trq", sort: "trq desc", limit: 1 })
			.done(function (data) {
				var translation = data.result[0].tt;
				$('#result').text(translation);
			})
		} else {
			$('#result').text('Translation not found');
		}
	});
}

// loading animation during translation
var $loading = $('#loader-wrapper').hide();
$(document)
  .ajaxStart(function () {
    $loading.show();
  })
  .ajaxStop(function () {
    $loading.hide();
  });

// instruction button function
$('#help').click(function() {
	$('#instru').fadeIn(200);
})
