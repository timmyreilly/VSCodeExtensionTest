// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {window, workspace, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';
var path = require("path");

// this method is called when your extension is activated. activation is
// controlled by the activation events defined in package.json
export function activate(ctx: ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "WordcountTester" is now active!');

    // create a new word counter
    //let wordCounter = new WordCounter();
    //let controller = new WordCounterController(wordCounter);
    
    let letterCounter = new AllTheThings();
    let controller = new LetterCountController(letterCounter);

    // add to a list of disposables which are disposed when this extension
    // is deactivated again.
    ctx.subscriptions.push(controller);
    ctx.subscriptions.push(letterCounter);
}

export class AllTheThings {
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
    private _letterCounter: AllTheThings;
    private _disposable: Disposable;
    
    constructor(letterCounter: AllTheThings){
        this._letterCounter = letterCounter
        this._letterCounter.updateEverything();
        
        // subscribe to selection change and editor activation events...
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);
        
        this._disposable = Disposable.from(...subscriptions);
    }
    
    private _onEvent() {
        this._letterCounter.updateEverything();
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
