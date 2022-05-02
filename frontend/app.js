var map = 0;

$(document).ready(function() {
	map = new AMap.Map('map_container', {
		resizeEnable: true,
		zoom: 16,
		center: [116.32281, 40.003519],
	});

	var ctx_menu = new AMap.ContextMenu();
	var evt_coor = 0;
	ctx_menu.addItem("添加一个点", () => {
		// var pixel = map.lngLatToContainer(evt_coor);
		// console.log(pixel);
		$('#addform').show();
		console.log(evt_coor);
		var infownd = new AMap.InfoWindow({
			content: $('#addform')[0]
		});
		infownd.open(map, evt_coor);
	});

	map.on('rightclick', (e) => {
		evt_coor = e.lnglat;
		ctx_menu.open(map, e.lnglat);
	});
	$('#addform').hide();

	$('#btn-submit').click(() => {
		var frm = {
			lat: evt_coor.Q,
			lng: evt_coor.R,
			name: $('#sitename').val(),
			type: $('#sitetype').val(),
			diff: $('#sitediff').val(),
			desc: $('#sitedesc').val(),
			author: $('#author').val()
		};
		console.log(frm);
		$.post('/project-t/query/submit', frm, (data) => {
			console.log(data);
		});
	});
});
