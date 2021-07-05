/*
 * Copyright (c) 2020 Hiroaki Sano
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

"use strict";

import * as Config from "./js/config.js";

let wasm;
let timer;

const keys = Config.get("keys");
let stat = { key: "", alt: false, ctrl: false, shift: false };

function onKeyDown(e) {
	if(e.key == "Alt"){
		stat.alt = true;
	}else if(e.key == "Control"){
		stat.ctrl = true;
	}else if(e.key == "Shift"){
		stat.shift = true;
	}else if(e.key != "Process"){
		stat.key = e.key;
	}
	e.preventDefault();
	const key = (stat.alt?"Alt-":"") + (stat.ctrl?"Control-":"") + (stat.shift?"Shift-":"") + stat.key;
	wasm.instance.exports.keydown(keys.indexOf(key));
}
function onKeyUp(e) {
	if(e.key == "Alt"){
		stat.alt = false;
		wasm.instance.exports.keyup();
	}else if(e.key == "Control"){
		stat.ctrl = false;
		wasm.instance.exports.keyup();
	}else if(e.key == "Shift"){
		stat.shift = false;
		wasm.instance.exports.keyup();
	}else{
		if(stat.key == e.key){
			stat.key = null;
			stat.time = 0;
			wasm.instance.exports.keyup();
		}
	}
}

const buttonIds = ["button0", "button1", "button2", "button3", "button4", "button5", "button6", "button7"];
let buttonStat = -1;
function onTouchStart(e){
	buttonStat = buttonIds.indexOf(e.target.id);
	wasm.instance.exports.keydown(buttonStat);
}
function onTouchEnd(e){
	if(buttonStat = buttonIds.indexOf(e.target.id)){
		wasm.instance.exports.keyup();
	}
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
function int16(x){
	let str = "#";
	str += digits[(x>>20) & 0xF];
	str += digits[(x>>16) & 0xF];
	str += digits[(x>>12) & 0xF];
	str += digits[(x>>8) & 0xF];
	str += digits[(x>>4) & 0xF];
	str += digits[(x>>0) & 0xF];
	return str;
}

function delay(msec){
	return new Promise(function(resolve){
		setTimeout(resolve, msec);
	});
}

const info = {
	env: {
		debug1: function(x){
			console.log(x);
		},
		js_random: function(){
			const array = new Uint32Array(1);
			window.crypto.getRandomValues(array);
			return array[0];
		},
		js_stop_timer: function(){
			clearInterval(timer);
		},
		js_fillStyle: function(color){
			const style = int16(color);
			ctx.fillStyle = style;
		},
		js_fillRect: function(x, y, w, h){
			ctx.fillRect(x, y, w, h);
		},
	}
};

fetch('./bin/a.wasm')
	.then(response => {
		return response.arrayBuffer();
	})
	.then(bytes => {
		return WebAssembly.instantiate(bytes, info);
	})
	.then(obj => {
		wasm = obj;
		console.log(obj.instance);
		console.log(obj.module);

		obj.instance.exports.mymain();

		document.addEventListener('keydown', onKeyDown, false);
		document.addEventListener('keyup', onKeyUp, false);
		const buttons = document.getElementsByClassName("button");
		for(let i=0, l=buttons.length; i<l; i++){
			buttons[i].addEventListener('touchstart', onTouchStart, false);
			buttons[i].addEventListener('touchend', onTouchEnd, false);
			buttons[i].addEventListener('touchcancel', onTouchEnd, false);
		};

		timer = setInterval(function(){
			obj.instance.exports.frame();
		}, 40);
	})
	.catch(err => {
		console.dir(err);
	});
