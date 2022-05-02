var map = 0;

var type_map = {
	"slope":'土坡',
	"stair":'台阶',
	"jump" :'飞包',
	"trail":'平路',
	"other":'其它',
};

var diff_map = ['毫无难度', '只需要会骑车', '小有意思', '略需技术', '挑战性大', '最好不要作死'];

$(document).ready(function() {
	map = new AMap.Map('map_container', {
		resizeEnable: true,
		zoom: 16,
		center: [116.32281, 40.003519],
	});

	// Show public sites
	var infownd = new AMap.InfoWindow({
		content: $('#infoform')[0]
	});
	var addMarker = (m) => {
		var coor = new AMap.LngLat(m.lng, m.lat);
		var marker = new AMap.Marker({
			position: coor,
			title: m.name
		});
		marker.on('click', () => {
			for (var k in m) {
				var id = '#show-site-' + k;
				if ($(id).length > 0) {
					$(id).html(m[k]);
				}
			}
			infownd.open(map, coor);
		});
		map.add(marker);
	};
	$.get('/project-t/query/pub', (data) => {
		for (var i in data) {
			var n = {};
			for (var j in data[i]) {
				n[j] = data[i][j];
			}
			n.marker_type = n.type;
			n.type = type_map[n.type];
			n.diff = diff_map[n.diff] + '(' + n.diff + '/5)';
			addMarker(n);
		}
	});

	// Adding a site by right-click
	for (var i in type_map) {
		$('#sitetype').append('<option value="' + i + '">' + type_map[i] + '</option>');
	}
	var ctx_menu = new AMap.ContextMenu();
	var evt_coor = 0;
	var addwnd = new AMap.InfoWindow({
		content: $('#addform')[0]
	});
	ctx_menu.addItem("添加一个点", () => {
		$('#addform').show();
		$('#btn-submit').show();
		addwnd.open(map, evt_coor);
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
		$('#btn-submit').hide();
		$.post('/project-t/query/submit', frm, (data) => {
			$('#sitename').val('');
			$('#sitedesc').val('');
			addwnd.close();
			console.log(data);
		});
	});
});
