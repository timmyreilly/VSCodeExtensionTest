// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
import cp = require('child_process');

var path = require("path");
//var player = require('play-sound')(opts = {})

// this method is called when your extension is activated. activation is
// controlled by the activation events defined in package.json
export function activate(ctx: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "WordcountTester" is now active!');

    // create a new word counter
    //let wordCounter = new WordCounter();
    //let controller = new WordCounterController(wordCounter);
    
    //
    // process.platform === 'win32'
    var currentpath = process.cwd()
    var keypress_path = currentpath + '\\audio\\typewriter-key-1.wav'
    // keypress_path: 'C:\\Users\\tireilly\\OneDrive\\d\\JavaScript\\ExtensionsVSCode\\tester\\audio\\typewriter-key-1.wav'
   
    //cp.execSync('powershell -c (New-Object Media.SoundPlayer "c:\PathTo\YourSound.wav").PlaySync();');
    //cp.execSync('powershell -c (New-Object Media.SoundPlayer ' + keypress_path + ').PlaySync();');
    
    let letterCounter = new CharCount();
    let audioPlayer = new AudioPlay();
    let controller = new LetterCountController(letterCounter, audioPlayer);

    // add to a list of disposables which are disposed when this extension
    // is deactivated again.
    ctx.subscriptions.push(controller);
    ctx.subscriptions.push(letterCounter);
    
    
}

class AudioPlay {
    public playKeystroke(){
        
        //var currentpath = process.cwd()
        //console.log(currentpath);
        var keypress_path = path.join(__dirname, '..', '..', 'audio', 'typewriter-key-1.wav');
        
        //console.log(keypress_path);
        // keypress_path: 'C:\\Users\\tireilly\\OneDrive\\d\\JavaScript\\ExtensionsVSCode\\tester\\audio\\typewriter-key-1.wav'        
        //cp.exec(`powershell -c (New-Object Media.SoundPlayer "${keypress_path}").PlaySync();`);
        
        let playExe =  path.join(__dirname, '..', '..', 'audio', 'play.exe');
        cp.execFile(playExe, [keypress_path]);
        //cp.execSync('powershell -c (New-Object Media.SoundPlayer ' + keypress_path + ').PlaySync();');
    }
    
    public playCarriageReturn(){
        var carriagereturn_path = path.join(__dirname, '..','..','audio','typewriter-return-1.wav');
        
        let playExe = path.join(__dirname, '..','..','audio','play.exe');
        cp.execFile(playExe, [carriagereturn_path]);
    }
}

export class LineCount {
    
}

export class CharCount {
    private _statusBarItem: StatusBarItem;
    
    public updateEverything(){
        if (!this._statusBarItem){
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right);
        }
        
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }
        
        let doc = editor.document;
        
        let letterCount = this._getLetterCount(doc);
        
        this._statusBarItem.text = `Letters ${letterCount}`;
        
        this._statusBarItem.show();
    }
    
    public _getLetterCount(doc: TextDocument): number {
        let docContent = doc.getText();
        let letterCount = 0;
        letterCount = docContent.split("").length;
        
        return letterCount;
    }
    
    public dispose(){
        this._statusBarItem.dispose();
    }
}

class LetterCountController {
    private _letterCounter: CharCount;
    private _disposable: Disposable;
    private _audioplayer: AudioPlay;
    
    constructor(letterCounter: CharCount, audioplayer: AudioPlay){
        this._letterCounter = letterCounter;
        this._audioplayer = audioplayer;
        this._letterCounter.updateEverything();
        
        // subscribe to selection change and editor activation events...
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        
        this._disposable = Disposable.from(...subscriptions);
    }
    
    private _onEvent() {
        this._letterCounter.updateEverything();
        this._audioplayer.playKeystroke();
    }
    
    private dispose() {
        this._disposable.dispose();
    }
}

export class WordCounter {

    private _statusBarItem: StatusBarItem;

    public updateWordCount() {
        
        // Create as needed
        if (!this._statusBarItem) {
            this._statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left);
        } 

        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        // Only update status if an MD file
        if (doc.languageId === "markdown") {
            let wordCount = this._getWordCount(doc);

            // Update the status bar
            this._statusBarItem.text = wordCount !== 1 ? `$(pencil) ${wordCount} Words` : '$(pencil) 1 Word';
			
            this._statusBarItem.show();
            
        } else {
            this._statusBarItem.hide();
        }
    }

    public _getWordCount(doc: TextDocument): number {
        let docContent = doc.getText();
        
        

        // Parse out unwanted whitespace so the split is accurate
        docContent = docContent.replace(/(< ([^>]+)<)/g, '').replace(/\s+/g, ' ');
        docContent = docContent.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        let wordCount = 0;
        if (docContent != "") {
            wordCount = docContent.split(" ").length;
        }

        return wordCount;
    }

    public dispose() {
        this._statusBarItem.dispose();
    }
}

class WordCounterController {

    private _wordCounter: WordCounter;
    private _disposable: Disposable;

    constructor(wordCounter: WordCounter) {
        this._wordCounter = wordCounter;
        this._wordCounter.updateWordCount();

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    private _onEvent() {
        this._wordCounter.updateWordCount();
    }

    public dispose() {
        this._disposable.dispose();
    }
}











 