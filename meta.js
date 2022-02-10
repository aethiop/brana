$(function () {
	var page = {};
	meta.edit({
		name: "Edit",
		combo: ["E"],
		use: function (eve) {
			console.log("on");
		},
		on: function (eve) {
			if ($(eve.target).closest("p").length) {
				return;
			}
			var edit = this;
			setTimeout(function () {
				meta.flip(false);
			}, 1);
			edit.init();
			$(document)
				.on("keydown.tmp", "[contenteditable]", function (eve) {
					if (eve.which && meta.key === 91) {
						eve.preventDefault();
						console.log("meta key down");
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
					//$('#debug').val(doc.html());
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
						console.log(
							"save:",
							DBG.p - DBG.r,
							"rest:",
							DBG.r - DBG.h,
							"html:",
							DBG.h - DBG.n,
							"norm:",
							DBG.n - DBG.i,
							"init:",
							DBG.i - DBG.g,
							"grab:",
							DBG.g - DBG.m,
							"mono:",
							DBG.m - DBG.s
						);
					}, 50);
				});
		},
		up: function () {
			console.log("UP");
			$("[contenteditable=true]").off(".tmp");
		},
		init: function () {
			var edit = this;
			var doc = $("#app").attr("contenteditable", "true");

			if (!doc.text()) {
				doc.html('<p class="loud crack"></p>');
			}
			edit.select(doc.children().first().get(0));
		},
		save: function (p) {
			p = $(p);
			var i = p.index(); // = Array.prototype.indexOf.call(parent.children, child);
			var file = (location.hash || "").slice(1);
			var data = (p.get(0) || {}).outerHTML || "";
			data = $.normalize(data); // GOOD TO DO SECURITY ON SENDING SIDE TOO!!!
			var node = $(p).attr("name", "p" + i);
			node.data("gun", gun);
			console.log(node.data("gun"));
			console.log("save", i, file, data);
			console.log("PP", $(p).html());
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
		},
	});
	meta.edit({ name: "Design", combo: ["D"] });
	meta.edit({ name: "Add", combo: ["D", "A"] });

	meta.edit({
		name: "Text",
		combo: ["D", "A", "T"],
		on: function (eve) {
			meta.tap.on.append("<p>DUMMY TEXT</p>");
		},
	});
	meta.edit({ name: "Move", combo: ["D", "M"] });
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
				on.addClass("meta-on");
			},
			up: function () {},
		});
		meta.edit({
			combo: [40], // down
			on: function (eve) {
				var on = meta.tap().removeClass("meta-on");
				on = on.next().or(on.children().first()).or(on);
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
				on.addClass("meta-on");
			},
			up: function () {},
		});
	})();
	meta.edit({ name: "Turn", combo: ["D", "T"] });
	meta.edit({ name: "Size", combo: ["D", "S"] });
	meta.edit({
		name: "X",
		combo: ["D", "S", "X"],
		on: function (eve) {
			var on = meta.tap(),
				was = on.width();
			$(document).on("mousemove.tmp", function (eve) {
				var be = was + ((eve.pageX || 0) - was);
				on.css({ "max-width": be, width: "100%" });
			});
		},
		up: function () {
			$(document).off("mousemove.tmp");
		},
	});
	meta.edit({
		name: "Y",
		combo: ["D", "S", "Y"],
		on: function (eve) {
			var on = meta.tap(),
				was = on.height();
			$(document).on("mousemove.tmp", function (eve) {
				var be = was + ((eve.pageY || 0) - was);
				on.css({ "min-height": be });
			});
		},
		up: function () {
			$(document).off("mousemove.tmp");
		},
	});
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
