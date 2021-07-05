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

const keys = Config.get("keys");

main();

function event2key(e){
	if(e.key == "Alt" || e.key == "Control" || e.key == "Shift" /* || e.key == "Process" */){
		return "";
	}else{
		return (e.altKey?"Alt-":"") + (e.ctrlKey?"Control-":"") + (e.shiftKey?"Shift-":"") + e.key;
	}
}

function main(){
	{
		const view = document.getElementById("keytablex");
		view.addEventListener("keydown", function(e){
			e.preventDefault();
			const key = event2key(e);
			if(key == "") return;
			view.value = key;
		});
	}
	for(let i=0; i<8; i++){
		const view = document.getElementById("keytable" + i);
		view.value = keys[i];
		view.addEventListener("keydown", function(e){
			e.preventDefault();
			const key = event2key(e);
			if(key == "") return;
			if(keys[i] != key){
				view.value = key;
				keys[i] = key;
				Config.set("keys", keys);
				Config.write();
			}
		});
	}
}
