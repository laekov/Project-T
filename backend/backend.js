var express = require('express');
var fs = require('fs');
var router = express.Router();

var sites_pub = [];
var sites_pending = {};

var loadData = () => {
	if (fs.existsSync('./data/pub.json')) {
		fs.readFile('./data/pub.json', (err, data) => {
			sites_pub = JSON.parse(data);
		});
	}
	if (fs.existsSync('./data/pending.json')) {
		fs.readFile('./data/pending.json', (err, data) => {
			sites_pending = JSON.parse(data);
		});
	}
};
loadData();

router.get('/query/pub', (req, res) => {
	return res.status(200).send(sites_pub);
});

router.get('/query/pending/:id', (req, res) => {
	var id = req.params.id;
	if (id in sites_pending) {
		return res.status(200).send(sites_pending[id]);
	}
	return res.status(404).send('Pending site ' + id + ' not found');
});

router.post('/query/submit', (req, res) => {
	var frm = req.body;
	// TODO: validate the form
	var id = Date.now() % 1000;
	sites_pending[id] = frm;
	// TODO: separate pending json files for better performance
	fs.writeFileSync('./data/pending.json', JSON.stringify(sites_pending));
	return res.status(200).send('Successful submission ' + id);
});

router.get('/op/list', (req, res) => {
	var o = '';
	for (var i in sites_pending) {
		o += i + ': ' + sites_pending[i].name + ' (from ' + sites_pending[i].author + ')\n';
	}
	return res.status(200).send(o);
});

router.get('/op/reject/:id', (req, res) => {
	var id = req.params.id;
	delete sites_pending[id];
	fs.writeFileSync('./data/pending.json', JSON.stringify(sites_pending));
	return res.status(200).send('done\n');
});

router.get('/op/approve/:id', (req, res) => {
	var id = req.params.id;
	if (id in sites_pending) {
		sites_pub.push(sites_pending[id]);
		delete sites_pending[id];
		fs.writeFileSync('./data/pending.json', JSON.stringify(sites_pending));
		fs.writeFileSync('./data/pub.json', JSON.stringify(sites_pub));
		return res.status(200).send('approved\n');
	} else {
		return res.status(400).send('invalid id ' + id);
	}
});


router.use(function(req, res) {
	res.status(404).send('Invalid query');
});

module.exports = router;
