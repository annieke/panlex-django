// $(document).ready(function () {
// 	$('input.lang').change(function(e) {
// 		var target = $(e.target);
// 		$.post('/set', { param: target.attr('list'), value: target.val(), csrfmiddlewaretoken: $('[name="csrfmiddlewaretoken"]').val() });
// 	});
// });

$(document).ready(function() {
	var allData = JSON.parse(data);
	var lvs = [];
	console.log(allData[0].result.length);
	for (var i = 0; i < allData[0].result.length; i++) {
		lvs[i] = allData[0].result[i].uid;
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
