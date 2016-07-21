$(document).ready(function () {
	$('input.lang').change(function(e) {
		var target = $(e.target);
		$.post('/set', { param: target.attr('list'), value: target.val(), csrfmiddlewaretoken: $('[name="csrfmiddlewaretoken"]').val() });
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
	var word = $("#word").val();
	var inlang = $("#lang1").val();
	var outlang = $("#lang2").val();

	var wordID; 
	panlexQuery('/ex', { uid: inlang, tt: word })
	.done(function (data) {
		data.result.forEach(function (ex) {
			wordID = ex.ex;
		});
	})
	.done(function() {
		panlexQuery('/ex', { trex: wordID, uid: outlang, include: "trq", sort: "trq desc", limit: 1 })
		.done(function (data) {
			data.result.forEach(function (ex) {
				var translation = ex.tt; 
				$('#result').text(word + " in " + outlang + " is " + translation); 
			}); 
		})
	});


	// panlexQuery('/ex', { trex: wordID, uid: outlang, include: "trq", sort: "trq desc", limit: 1 })
	// .done(function (data) {
	// 	data.result.forEach(function (ex) {
	// 		var translation = ex.tt; 
	// 		$('#result').text(word + " in " + outlang + " is " + translation); 
	// 	}); 
	// });


	// translate(word, inlang, outlang)
	// .done(function (data) {
	// 	$('#result').text(word + " in " + outlang + " is " + data); 
	// });

}

// function translate(word, inlang, outlang) {
// 	// var data1 = { uid: inlang, tt: word };
// 	var wordID; 
// 	panlexQuery('/ex', { uid: inlang, tt: word })
// 	.done(function (data) {
// 		data.result.forEach(function (ex) {
// 			wordID = ex.ex;
// 		});
// 	});
// 	// var data2 = { trex: wordID, uid: outlang, include: "trq", sort: "trq desc", limit: 1 }; 
// 	var translation;
// 	panlexQuery('/ex', { trex: wordID, uid: outlang, include: "trq", sort: "trq desc", limit: 1 })
// 	.done(function (data) {
// 		data.result.forEach(function (ex) {
// 			translation = ex.tt; 
// 		}); 
// 	});
// 	return translation; 
// }