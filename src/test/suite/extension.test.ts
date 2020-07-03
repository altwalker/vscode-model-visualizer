import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { ModelProvider } from '../../modelProvider';

const testFolderLocation = '/../../../src/test/workPlace/';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start tests.');
	const disponsables: vscode.Disposable[] = [];
	const provider = new ModelProvider();

	function closeAllEditors(): Thenable<any> {
		return vscode.commands.executeCommand('workbench.action.closeAllEditors');
	}

	function disponseAll(disposables: vscode.Disposable[]) {
		vscode.Disposable.from(...disposables).dispose();
	}

	teardown(async () => {
		await closeAllEditors();

		disponseAll(disponsables);
	});

	function sleep(ms: number): Promise<void> {
		return new Promise(resolve => {
		  	setTimeout(resolve, ms);
		});
	}

	test('Test provider good json file', async() => {
		const extensionPath = vscode.Uri.file(path.resolve(__dirname, '../../../'));
		const uriModel = vscode.Uri.file(path.join(__dirname + testFolderLocation + 'goodModel.json'));
		const document = await vscode.workspace.openTextDocument(uriModel);
		const editor = await vscode.window.showTextDocument(document);
		await sleep(500);
		const good_json_file = provider.provideTextDocumentContent(extensionPath);
		vscode.commands.executeCommand('altwalker.launch');
		assert.equal(good_json_file.includes(editor.document.getText()), true, 'The provider do not return the expected result');
	});

	test('Test provider bad input file', async() => {
		const extensionPath = vscode.Uri.file(path.resolve(__dirname, '../../../'));
		const uri = vscode.Uri.file(path.join(__dirname + testFolderLocation + 'notJson.html'));
		const document = await vscode.workspace.openTextDocument(uri);
		await vscode.window.showTextDocument(document);
		await sleep(500);
		const bad_editor_file = provider.provideTextDocumentContent(extensionPath);
		vscode.commands.executeCommand('altwalker.launch');
		assert.equal(bad_editor_file.includes('Active editor does not show a json document.'), true, 'The provider do not return the expected result');
	});

	test('Start extension with default model', async() => {
		vscode.commands.executeCommand('altwalker.launch');
		assert.equal(vscode.window.state.focused, true, 'The extension is not focused after start');
	});

});
