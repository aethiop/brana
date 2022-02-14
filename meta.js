var gun = Gun({ peers: ["http://localhost:8765/gun"] });
var page = {};
(function () {
	$(document).on("click", function () {
		var tmp = $(".meta-on");
		if (!tmp.length) {
			return;
		}
		tmp.removeClass("meta-on");
	});
	meta.edit({
		combo: [38], // up
		on: function (eve) {
			var on = meta.tap().removeClass("meta-on");
			on = on.prev().or(on.parent()).or(on);
			if (on.prop("tagName") == "BODY") {
				$("#page").addClass("meta-on");
				return;
			}
			on.addClass("meta-on");
		},
		up: function () {},
	});
	meta.edit({
		combo: [40], // down
		on: function (eve) {
			var on = meta.tap().removeClass("meta-on");
			on = on.next().or(on.children().first()).or(on);
			if (on.next().prop("tagName") == "SCRIPT") {
				$(".meta-on").removeClass("meta-on");
				var tmp = $("#page").children().get(0);
				$(tmp).addClass("meta-on");
				return;
			}
			on.addClass("meta-on");
		},
		up: function () {},
	});
	meta.edit({
		combo: [39], // right
		on: function (eve) {
			var on = meta.tap().removeClass("meta-on");
			on = on.children().first().or(on.next()).or(on.parent()).or(on);
			on.addClass("meta-on");
		},
		up: function () {},
	});
	meta.edit({
		combo: [37], // left
		on: function (eve) {
			var on = meta.tap().removeClass("meta-on");
			on = on.parent().or(on);
			if (on.attr("id") == "page") {
				$("#page").children().last().addClass("meta-on");
				return;
			}
			on.addClass("meta-on");
		},
		up: function () {},
	});
	meta.edit({
		combo: ["K"], // up
		on: function (eve) {
			var on = meta.tap().removeClass("meta-on");
			on = on.prev().or(on.parent()).or(on);
			if (on.prop("tagName") == "BODY") {
				$("#page").addClass("meta-on");
				return;
			}
			on.addClass("meta-on");
		},
		up: function () {},
	});
	meta.edit({
		combo: ["J"], // down
		on: function (eve) {
			var on = meta.tap().removeClass("meta-on");
			on = on.next().or(on.children().first()).or(on);
			if (on.next().prop("tagName") == "SCRIPT") {
				$(".meta-on").removeClass("meta-on");
				var tmp = $("#page").children().get(0);
				$(tmp).addClass("meta-on");
				return;
			}
			on.addClass("meta-on");
		},
		up: function () {},
	});
	meta.edit({
		combo: ["L"], // right
		on: function (eve) {
			var on = meta.tap().removeClass("meta-on");
			on = on.children().first().or(on.next()).or(on.parent()).or(on);
			on.addClass("meta-on");
		},
		up: function () {},
	});
	meta.edit({
		combo: ["H"], // left
		on: function (eve) {
			var on = meta.tap().removeClass("meta-on");
			on = on.parent().or(on);
			if (on.attr("id") == "page") {
				$("#page").children().last().addClass("meta-on");
				return;
			}
			on.addClass("meta-on");
		},
		up: function () {},
	});
})();
(window.onhashchange = function () {
	var file = (location.hash || "").slice(1);
	var S = +new Date();

	$("#page").empty().attr("contenteditable", "false");
	gun.get(file)
		.get("what")
		.map()
		.on(function render(data, i, msg, eve) {
			var tmp = page[i] || "";
			var last = Gun.state.is(gun._.root.graph[msg.put["#"]], i);
			if (last < tmp.last) {
				return;
			}

			var p = $("#page").children().get(i);
			if (!p && data) {
				$("#page").append("<p>");
				if (i < 0) return;
				setTimeout(function () {
					render(data, i, msg, eve);
				}, 0);
				return;
			}
			var DBG = { s: +new Date() };
			var r = monotype(p);
			DBG.mono = +new Date();
			var safe = $.normalize(data);
			console.log("SAFE", safe);
			DBG.norm = +new Date();
			if (!data) return;
			p.outerHTML = data;
			DBG.html = +new Date();
			r.restore();
			DBG.rest = +new Date();
		});
})();
window.requestAnimationFrame = window.requestAnimationFrame || setTimeout;
window.requestAnimationFrame(function frame() {
	window.requestAnimationFrame(frame, 16);
}, 16);
document.execCommand("defaultParagraphSeparator", false, "p");
$(function () {
	meta.edit({
		combo: ["E"],
		use: function (eve) {
			console.log("on");
		},
		get: function () {
			var r = window.getSelection().getRangeAt(0);
			var c = r.commonAncestorContainer,
				p;
			r.deleteContents();
			var p = c.splitText ? $(c.splitText(r.startOffset)).parent() : $(c);
			var n = $("<" + p.get(0).tagName + ">"),
				f;
			p.contents().each(function () {
				if (this === c) {
					return (f = true);
				}
				if (!f) {
					return;
				}
				n.append(this);
			});
			p.after(n);
			edit.select(n.get(0));
			return p;
		},
		on: function (eve) {
			if ($(eve.target).closest("p").length) {
				return;
			}

			var edit = this;
			setTimeout(function () {
				meta.flip(false);
			}, 10);

			edit.init();
			$(document)
				.on("keydown.tmp", "[contenteditable]", function (eve) {
					if (eve.which == 27) {
						var r = window.getSelection().getRangeAt(0);
						var c = r.commonAncestorContainer,
							p;
						r.deleteContents();
						var p = c.splitText
							? $(c.splitText(r.startOffset)).parent()
							: $(c);
						var n = $("<" + p.get(0).tagName + ">"),
							f;
						p.contents().each(function () {
							if (this === c) {
								return (f = true);
							}
							if (!f) {
								return;
							}
							n.append(this);
						});
						p.after(n);
						edit.select(n.get(0));
						console.log("P: ", p);
						// make sure we re-save & sync each changed paragraph.
						edit.save(p);
						p.nextAll().each(function () {
							edit.save(this);
						});
						$(document).off("keydown.tmp");
						$(document).off("keyup.tmp");
						$("#page").attr("contenteditable", "false");
						return;
					}
					if (eve.which != 13) {
						return;
					}
					eve.preventDefault();
					var r = window.getSelection().getRangeAt(0);
					var c = r.commonAncestorContainer,
						p;
					r.deleteContents();
					var p = c.splitText
						? $(c.splitText(r.startOffset)).parent()
						: $(c);
					var n = $("<" + p.get(0).tagName + ">"),
						f;
					p.contents().each(function () {
						if (this === c) {
							return (f = true);
						}
						if (!f) {
							return;
						}
						n.append(this);
					});
					p.after(n);
					edit.select(n.get(0));

					// make sure we re-save & sync each changed paragraph.
					edit.save(p);
					p.nextAll().each(function () {
						edit.save(this);
					});
				})
				.on("keyup.tmp", "[contenteditable]", function (eve) {
					// $('#debug').val(doc.html());

					var p = $(window.getSelection().anchorNode).closest("p"),
						tmp;
					(tmp = page[p.index()] || (page[p.index()] = {})).last =
						+new Date() + 99;
					clearTimeout(tmp.to);
					tmp.to = setTimeout(function () {
						var DBG = { s: +new Date() };
						var r = monotype(p);
						DBG.m = +new Date();
						var html = p.html() || "";
						DBG.g = +new Date();
						if (
							!html &&
							!p.prev().length &&
							!p.next().length &&
							!$("#page").html()
						) {
							edit.init();
						}
						DBG.i = +new Date();
						var safe = $.normalize(html);
						DBG.n = +new Date();
						p.html(safe);
						DBG.h = +new Date();
						r.restore();
						DBG.r = +new Date();
						edit.save(p);
						DBG.p = +new Date();
					}, 50);
				});
		},
		up: function () {
			$("[contenteditable=true]").off(".tmp");
		},
		init: function () {
			var edit = this;
			var doc = $("#page").attr("contenteditable", "true");
			if (meta.tap().prop("nodeName") == "P") {
				edit.select(doc.children().get(meta.tap().index()) || doc);
			} else {
				if (!doc.text()) {
					doc.html(
						'<p class="loud crack" data-placeholder="Title"></p>'
					);
				}
				edit.select(doc.children().last().get(0));
			}
		},
		save: function (p) {
			p = $(p);
			var i = p.index(); // = Array.prototype.indexOf.call(parent.children, child);
			var file = (location.hash || "").slice(1);
			var data = (p.get(0) || {}).outerHTML || "";
			data = $.normalize(data); // GOOD TO DO SECURITY ON SENDING SIDE TOO!!!
			gun.get(file)
				.get("what")
				.get(i)
				.put(data, function (ack) {
					console.log(ack);
				});
		},
		select: function (p) {
			var s = window.getSelection(),
				r = document.createRange();
			if (p.innerHTML) {
				r.setStart(p, 0);
				r.collapse(true);
				s.removeAllRanges();
				s.addRange(r);
				return;
			}
			p.innerHTML = "\u00a0";
			r.selectNodeContents(p);
			s.removeAllRanges();
			s.addRange(r);
			document.execCommand("delete", false, null);
		},
	});
	meta.edit({ name: "Design", combo: ["D"] });
	meta.edit({
		name: "Fill",
		combo: ["D", "F"],
		on: function (eve) {
			var on = meta.tap();
			meta.ask("Color name, code, or URL?", function (color) {
				var css = on.closest("p").length ? "color" : "background";
				on.css(css, color);
			});
		},
	});
});

(function () {
	var song = {};
	// TODO:
	// 1. Manually OR automatically load music.js API, dependencies, and modules. - FINE for now
	// 2. only export music API, not meta, not dom, not mouselock system, not UI/html, etc. better module isolation and export.
	// 3. `var wave = Wave('a').play()` // also on `Music.now`
	// defaults... instrument: pure tones, volume curve: |\_ , speed curve: 0.5
	// 4. `wave.blur(0.5).itch(0.5);`
	// 5. wave.long(2); // how long in seconds each note plays, optionally: wave.pace(60) is bpm
	// 6. wave.loud(0.5); // 0% to 100% volume loudness of device output.
	// 7. wave.vary(0.5); // slows down or speeds up wiggle per harmonic
	// 8:
	// wave structure, does ToneJS allow us to change the sine wave smoothness/type continuously or is it a pre-fixed type?
	// wave structure: /\/\/, |_|, /|/, \|\| do some research with ToneJS whether these are dynamic or fixed
	// wave.itch(); // changes the shape of the wiggle from smooth sine to square or triangle
	// wave.blur(220hz); // blur may not apply/work on pure notes other than filtering them.

	meta.edit({ name: "Music", combo: ["M"] });

	meta.edit({
		name: "Play",
		combo: ["M", "P"],
		on: function (eve) {
			// TODO: We still need to add to meta API ability to change name.

			music.stop();
			setTimeout(function () {
				console.log(monotype($("#page").html()));
				song.now = wave($("#page").text()).play();
			}, 0);
		},
	});

	meta.edit({
		name: "Blur",
		combo: ["M", "B"],
		on: function (eve) {
			var on = meta.tap(),
				was = on.width();
			$(document).on("mousemove.tmp", function (eve) {
				var long = Math.mix(0, 3, eve.pageX / $("body").innerWidth());
				song.now.long(long);
			});
		},
		up: function () {
			$(document).off(".tmp");
			console.log(song.now);
		},
	});

	meta.edit({
		name: "Vary",
		combo: ["M", "V"],
		on: function (eve) {
			var on = meta.tap(),
				was = on.width();
			$(document).on("mousemove.tmp", function (eve) {
				var vary = Math.mix(0, 1, eve.pageX / $("body").innerWidth());
				song.now.vary(vary);
			});
		},
		up: function () {
			$(document).off(".tmp");
			console.log(song.now);
		},
	});

	meta.edit({
		name: "Shout",
		combo: ["M", "S"],

		on: function (eve) {
			var on = meta.tap(),
				was = on.width();
			$(document).on("mousemove.tmp", function (eve) {
				var loud = Math.mix(0, 1, eve.pageX / $("body").innerWidth());
				song.now.loud(loud);
			});
		},
		up: function () {
			$(document).off(".tmp");
			console.log(song.now);
		},
	});
	meta.edit({
		name: "Itch",
		combo: ["M", "I"],

		on: function (eve) {
			var on = meta.tap(),
				was = on.width();
			$(document).on("mousemove.tmp", function (eve) {
				var itch = Math.mix(0, 1, eve.pageX / $("body").innerWidth());
				song.now.itch(itch);
			});
		},
		up: function () {
			$(document).off(".tmp");
		},
	});
	$(document).on("keydown", function (eve) {
		if (eve.which === music.which) {
			return;
		}
		music.play(String.fromCharCode((music.which = eve.which)));
	});
})();

Math.mix = function (a, b, m) {
	m = m || 0;
	return a + (b - a) * m;
};
Math.remix = function (a, b, m) {
	m = m || 0;
	return (m - a) / (b - a);
};
Math.in = function (a, b, m) {
	return m >= a && m <= b;
};
