// 
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as myExtension from '../src/extension';
import cp = require('child_process');

var path = require("path");

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", () => {

	// Defines a Mocha unit test
	test("Something 1", () => {
		assert.equal(-1, [1, 2, 3].indexOf(5));
		assert.equal(-1, [1, 2, 3].indexOf(0));
	});
	
	test("Audio Playable", () => {
		let audioPlayer = new myExtension.AudioPlay();
		assert.doesNotThrow(
			function () {
				audioPlayer.playCarriageReturn()
			},
			Error
		)
	});
	
	// Working on these test -> 
	
	// test("Play Available", () => {
	// 	let properPath = '/^(.*?)\.exe'
	// 	let currentPlayPath = path.join(__dirname, '..', '..', 'audio', 'play.exe');
	// 	console.log(path.join(__dirname, '..', '..', 'audio', 'play.exe'));
	// 	console.log(properPath)
	// 	assert.equal(properPath, currentPlayPath)
	// })
	
	// test('Play exists', () => {
	// 	let playPath = path.join(__dirname, '..', '..', 'audio', 'play.exe');
	// 	let end = playPath.split(playPath, '\\');
	// 	console.log(end);
	// 	assert.equal('audio', playPath )
	// })
	// 
	// test('Play no error', () => {
	// 	let playPath = path.join(__dirname, '..', '..', 'audio', 'playz.exe');
	// 	cp.execFile(playPath);
	// })
	
	
});


