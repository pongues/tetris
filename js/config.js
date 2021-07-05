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

const KEY = "tetris-config";

let obj;

export function set(key, value){
	if(!obj) obj = getLocalStorage();
	obj[key] = value;
}

export function get(key){
	if(!obj) obj = getLocalStorage();
	return obj[key];
}

export function clear(){
	obj = undefined;
}

export function write(){
	setLocalStorage(obj);
}

function v1(obj){
	if(obj.version == 1){
		return obj;
	}else{
		return create();
	}
}

function create(){
	let obj = new Object();
	obj.version = 1;
	obj.keys = ["Escape", "ArrowLeft", "ArrowRight", "ArrowDown", "Control-ArrowDown", "Control-ArrowLeft", "Control-ArrowRight", "Control-ArrowUp"];
	return obj;
}

function getLocalStorage(){
	let str = localStorage.getItem(KEY);
	let obj;
	if(str){
		try{
			obj = JSON.parse(str);
		} catch (e) {
		}
	}
	if(obj){
		v1(obj);
	}else{
		obj = create();
	}
	return obj;
}

function setLocalStorage(obj){
	let str;
	try{
		str = JSON.stringify(obj);
	} catch (e) {
		return;
	}
	localStorage.setItem(KEY, str);
}
