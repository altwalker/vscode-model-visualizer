import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { ModelProvider } from '../../modelProvider';
import { getRankdir, getAlign, getRanker } from '../../utils';

const testFolderLocation = '/../../../src/test/workPlace/';

suite('Extension Test Suite', () => {

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

	test('Test node_modules', async() => {
		await closeAllEditors();
		const extensionPath = vscode.Uri.file(path.resolve(__dirname, '../../../'));
		const uriModel = vscode.Uri.file(path.join(__dirname + testFolderLocation + 'goodModel.json'));
		const document = await vscode.workspace.openTextDocument(uriModel);
		const editor = await vscode.window.showTextDocument(document);
		const json_file = provider.provideTextDocumentContent(extensionPath, editor.document.getText());
		await sleep(500);
		assert.equal(json_file.includes("vscode-model-visualizer" + path.sep + "node_modules" + path.sep + "d3" + path.sep + "dist" + path.sep + "d3.js"), true, 'The d3 node_module is not loaded.');
		assert.equal(json_file.includes("vscode-model-visualizer" + path.sep + "node_modules" + path.sep + "dagre-d3" + path.sep + "dist" + path.sep + "dagre-d3.js"), true, 'The dagre-d3 node_module is not loaded.');
		assert.equal(json_file.includes("vscode-model-visualizer" + path.sep + "node_modules" + path.sep + "d3-svg-legend" + path.sep + "d3-legend.js"), true, 'The d3-legend node_module is not loaded.');
		assert.equal(json_file.includes("vscode-model-visualizer" + path.sep + "node_modules" + path.sep + "vue" + path.sep + "dist" + path.sep + "vue.js"), true, 'The vue node_module is not loaded.');
		assert.equal(json_file.includes("model-visualizer.js"), true, 'The model-visualizer.js is not loaded.');
		assert.equal(json_file.includes("model-visualizer.css"), true, 'The model-visualizer.css is not loaded.');
		await sleep(500);
	});

	test('Test css', async() => {
		await closeAllEditors();
		const extensionPath = vscode.Uri.file(path.resolve(__dirname, '../../../'));
		const uriModel = vscode.Uri.file(path.join(__dirname + testFolderLocation + 'goodModel.json'));
		const document = await vscode.workspace.openTextDocument(uriModel);
		const editor = await vscode.window.showTextDocument(document);
		const json_file = provider.provideTextDocumentContent(extensionPath, editor.document.getText());
		await sleep(500);
		assert.equal(json_file.includes("vscode-model-visualizer" + path.sep + "css" + path.sep + "app.css"), true, 'The css file is not loaded.');
		await sleep(500);
	});

	test('Test default configuration', async() => {
		await closeAllEditors();
		const configuration = vscode.workspace.getConfiguration('altwalker.layout');
		assert.equal(configuration.get('rankdir'), "Top-Bottom", 'The rankdir default value is wrong.');
		assert.equal(configuration.get('align'), "Down-Right", 'The align default value is wrong.');
		assert.equal(configuration.get('nodesep'), 1, 'The nodesep default value is wrong.');
		assert.equal(configuration.get('edgesep'), 10, 'The edgesep default value is wrong.');
		assert.equal(configuration.get('ranksep'), 50, 'The ranksep default value is wrong.');
		assert.equal(configuration.get('marginx'), 1, 'The marginx default value is wrong.');
		assert.equal(configuration.get('marginy'), 1, 'The marginy default value is wrong.');
		assert.equal(configuration.get('ranker'), "Network Simplex", 'The ranker default value is wrong.');
		assert.equal(configuration.get('legend'), true, 'The legend default value is wrong.');
		await sleep(500);
	});

	test('Test configuration in provider', async() => {
		await closeAllEditors();
		const configuration = vscode.workspace.getConfiguration('altwalker.layout');
		const extensionPath = vscode.Uri.file(path.resolve(__dirname, '../../../'));
		const uriModel = vscode.Uri.file(path.join(__dirname + testFolderLocation + 'goodModel.json'));
		const document = await vscode.workspace.openTextDocument(uriModel);
		const editor = await vscode.window.showTextDocument(document);
		const json_file = provider.provideTextDocumentContent(extensionPath, editor.document.getText());
		assert.equal(json_file.includes("rankdir: " + "\"" + getRankdir(configuration.get('rankdir')) + "\""), true, 'The extension don not start with default rankdir configuration');
		assert.equal(json_file.includes("align: " + "\"" + getAlign(configuration.get('align')) + "\""), true, 'The extension don not start with default align configuration');
		assert.equal(json_file.includes("nodesep: " + "\"" + configuration.get('nodesep') + "\""), true, 'The extension don not start with default nodesep configuration');
		assert.equal(json_file.includes("edgesep: " + "\"" + configuration.get('edgesep') + "\""), true, 'The extension don not start with default edgesep configuration');
		assert.equal(json_file.includes("ranksep: " + "\"" + configuration.get('ranksep') + "\""), true, 'The extension don not start with default ranksep configuration');
		assert.equal(json_file.includes("marginx: " + "\"" + configuration.get('marginx') + "\""), true, 'The extension don not start with default marginx configuration');
		assert.equal(json_file.includes("marginy: " + "\"" + configuration.get('marginy') + "\""), true, 'The extension don not start with default marginy configuration');
		assert.equal(json_file.includes("ranker: " + "\"" + getRanker(configuration.get('ranker')) + "\""), true, 'The extension don not start with default ranker configuration');
		await sleep(500);
	});

	test('Start extension', async () => {
		await closeAllEditors();
		const uriModel = vscode.Uri.file(path.join(__dirname + testFolderLocation + 'goodModel.json'));
		const document = await vscode.workspace.openTextDocument(uriModel);
		await vscode.window.showTextDocument(document);
		await vscode.commands.executeCommand('altwalker.launch');
		await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
		assert.equal(vscode.window.state.focused, true, 'The current window should be focused.');
		assert.equal(vscode.window.activeTextEditor, undefined, 'Only the extension should be open.');
		await sleep(500);
	});

	test('Test provider good json file', async() => {
		await closeAllEditors();
		const extensionPath = vscode.Uri.file(path.resolve(__dirname, '../../../'));
		const uriModel = vscode.Uri.file(path.join(__dirname + testFolderLocation + 'goodModel.json'));
		const document = await vscode.workspace.openTextDocument(uriModel);
		const editor = await vscode.window.showTextDocument(document);
		const json_file = provider.provideTextDocumentContent(extensionPath, editor.document.getText());
		assert.equal(json_file.includes(editor.document.getText()), true, 'The provider do not return the expected result.');
		await sleep(500);
	});

	test('Test provider bad json file', async() => {
		await closeAllEditors();
		const extensionPath = vscode.Uri.file(path.resolve(__dirname, '../../../'));
		const uriModel = vscode.Uri.file(path.join(__dirname + testFolderLocation + 'badModel.json'));
		const document = await vscode.workspace.openTextDocument(uriModel);
		const editor = await vscode.window.showTextDocument(document);
		const json_file = provider.provideTextDocumentContent(extensionPath, editor.document.getText());
		assert.equal(json_file.includes(editor.document.getText()), true, 'The provider do not return the expected result.');
		await sleep(500);
	});
});
