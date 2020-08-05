import * as vscode from 'vscode';
import { ModelProvider } from './modelProvider';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	const provider = new ModelProvider();
	let panel: vscode.WebviewPanel | undefined = undefined;
	const iconDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'images', 'icon.png'));
	const extensionPath = vscode.Uri.file(context.extensionPath);

	let disposable: any = vscode.commands.registerCommand('altwalker.launch', () => {

		let viewColumn: vscode.ViewColumn;

		if (vscode.window.activeTextEditor?.viewColumn){
			viewColumn = vscode.window.activeTextEditor.viewColumn + 1;
		} else {
			viewColumn = 1;
		}

		if (panel) {
			panel.reveal(viewColumn);
		} else {
			panel = vscode.window.createWebviewPanel(
				'modelVisualizer',
				'AltWalker Model Visualizer',
				viewColumn,
				{
					enableScripts: true,
					retainContextWhenHidden: true
				}
			);
		}

		const extensionUri = panel.webview.asWebviewUri(extensionPath);

		panel.iconPath = iconDiskPath;
		panel.webview.html = provider.provideTextDocumentContent(extensionUri);

		vscode.window.onDidChangeActiveTextEditor(e => {
			var editor = vscode.window.activeTextEditor;
			if (editor) {
				if (editor.document.languageId === 'json') {
					if (panel) {
						try {
							var models = JSON.parse(editor.document.getText());
							panel.webview.postMessage({ command: 'newModel', model: models});
						} catch (error) {
							panel.webview.postMessage({ command: 'error', errorMessage: error.message, errorName: error.name});
						}
					}
				}
			}
		});

		vscode.workspace.onDidChangeConfiguration(e => {
			if (panel) {
				try {
					var configuration = vscode.workspace.getConfiguration('altwalker.layout');
					var ranker = provider.getRanker(configuration.get('ranker'));
					var rankdir = provider.getRankdir(configuration.get('rankdir'));
					var align = provider.getAlign(configuration.get('align'));
					var marginx = configuration.get('marginx');
					var nodesep = configuration.get('nodesep');
					var edgesep = configuration.get('edgesep');
					var ranksep = configuration.get('ranksep');
					var marginy = configuration.get('marginy');
					var legend = configuration.get('legend');
					let graphLayoutOptions = {
						'rankdir': rankdir,
						'align': align,
						'nodesep': nodesep,
						'edgesep': edgesep,
						'ranksep': ranksep,
						'marginx': marginx,
						'marginy': marginy,
						'ranker': ranker,
						'legend': legend
					};
					panel.webview.postMessage({ command: 'newConfiguration', configuration: graphLayoutOptions});
				} catch (error) {
					panel.webview.postMessage({ command: 'error', errorMessage: error.message, errorName: error.name});
				}
			}
		});

		vscode.workspace.onDidChangeTextDocument(e => {
			var editor = vscode.window.activeTextEditor;
			if (editor) {
				if (editor.document.languageId === 'json') {
					if (panel) {
						try {
							var models = JSON.parse(editor.document.getText());
							panel.webview.postMessage({ command: 'newModel', model: models});
						} catch (error) {
							panel.webview.postMessage({ command: 'error', errorMessage: error.message, errorName: error.name});
						}
					}
				}
			}
		});

		panel.onDidDispose(() => {
			panel = undefined;
		},
			undefined,
			context.subscriptions
		);
	});


	context.subscriptions.push(disposable);
}

export function deactivate() {}
