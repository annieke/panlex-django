$(document).ready(function () {
	$('input.lang').change(function(e) {
		var target = $(e.target);
		$.post('/set', { param: target.attr('list'), value: target.val(), csrfmiddlewaretoken: $('[name="csrfmiddlewaretoken"]').val() });
	});
});

$(function() {
	var data = JSON.parse(list);
	var lvs;
	for (var i = 0; i < data.result.length; i++) {
		lvs[i] = data.result[i].uid; 
	}
	$('input.lang').autocomplete({
		source: lvs
	});
});


function panlexQuery(url, data) {
	return $.ajax({
		url: "https://api.panlex.org" + url,
		data: JSON.stringify(data),
		dataType: "json",
		type: "POST"
	});
}


// function panlexQueryAll(url, data) {
// 	var res;
// 	var param = data;
// 	if (!param.has('offset')) {
// 		param.offset = 0;
// 	}
// 	while (true) {
// 		var r = panlexQuery(url, data);
// 		if (typeof res !== 'undefined') {
// 			res = r;
// 		}
// 		else {
// 			res['result'].push.apply(res['result'], r['result']);
// 			res.resultNum += r.resultNum;
// 			if (r.resultNum < r.resultMax) {
// 				break;
// 			}
// 		}
// 		param.offset += r.resultNum;
// 	}
// 	return res;
// }


function findTranslation() {
	var word = $('#word').val();
	var inlang = $('#lang1').val();
	var outlang = $('#lang2').val();

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
