(function () {
	var joy = (window.JOY = function () {});
	joy.auth = function (a, o) {
		if (!o) {
			o = 0;
		}
		if (o === true) {
			window.SEA.pair().then(async (k) => {
				joy.auth(k);
			});
			return;
		}
		gun.user().auth(a);
	};

	var opt = (joy.opt = window.CONFIG || {}),
		peers;
	$("link[type=peer]").each(function () {
		console.log($(this).attr("href"));
		(peers || (peers = [])).push($(this).attr("href"));
	});
	!window.gun &&
		(opt.peers =
			opt.peers ||
			peers ||
			(function () {
				(console.warn || console.log)(
					"Warning: No peer provided, defaulting to DEMO peer. Do not run in production, or your data will be regularly wiped, reset, or deleted. For more info, check https://github.com/eraeco/joydb#peers !"
				);
				return ["http://localhost:8765/gun"];
			})());
	window.gun = window.gun || GUN(opt);

	gun.on("auth", function (ack) {
		console.log("Your namespace is publicly available at", ack.soul);
		console.log("app", $("#app").attr("name"));
		$("#app").attr("name", ack.soul);
	});
})();
