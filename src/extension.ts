import * as vscode from 'vscode';
import { ModelProvider } from './modelProvider';
import * as path from 'path';
import { getRankdir, getAlign, getRanker } from './utils';

export function activate(context: vscode.ExtensionContext) {
	const provider = new ModelProvider();
	let panel: vscode.WebviewPanel | undefined = undefined;
	const iconDiskPath = vscode.Uri.file(path.join(context.extensionPath, 'images', 'icon.png'));
	const nodeModulesPath = vscode.Uri.file(
		path.join(context.extensionPath, 'node_modules')
	);
	const extensionTitle = "AltWalker Model Visualier";

	let disposable: any = vscode.commands.registerCommand('altwalker.launch', (document) => {

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
				extensionTitle,
				{ preserveFocus: true, viewColumn: viewColumn },
				{
					enableScripts: true,
					retainContextWhenHidden: true
				}
			);
		}

		const nodeModulesUri = panel.webview.asWebviewUri(nodeModulesPath);

		panel.iconPath = iconDiskPath;

		if (document) {
			vscode.workspace.openTextDocument(document.fsPath).then((document) => {
				if (panel) {
					const documentText = document.getText();
					const documentName = document.fileName;
					if (documentText.length === 0) {
						panel.title = documentName.split(path.sep).pop() + " | " + extensionTitle;
						panel.webview.html = provider.provideTextDocumentContent(nodeModulesUri, "{'name': 'Default Models', 'models':''}");
					} else {
						panel.title = documentName.split(path.sep).pop() + " | " + extensionTitle;
						panel.webview.html = provider.provideTextDocumentContent(nodeModulesUri, documentText);
					}
				}
			});
		} else {
			const focusedEditor = vscode.window.activeTextEditor;
			if (focusedEditor) {
				const focuedEditorText = focusedEditor.document.getText();
				const focusedEditorName = focusedEditor.document.fileName;
				panel.title = focusedEditorName.split(path.sep).pop() + " | " + extensionTitle;
				panel.webview.html = provider.provideTextDocumentContent(nodeModulesUri, focuedEditorText);
			} else {
				panel.webview.html = provider.provideTextDocumentContent(nodeModulesUri, "{'name': 'Default Models', 'models':''}");
			}
		}

		vscode.window.onDidChangeActiveTextEditor(e => {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const editorText = editor.document.getText();
				const editorName = editor.document.fileName;
				if (editor.document.languageId === 'json') {
					if (panel) {
						try {
							panel.title = editorName.split(path.sep).pop() + " | " + extensionTitle;
							panel.webview.postMessage({ command: 'newModel', model: JSON.parse(editorText)});
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
					var ranker = getRanker(configuration.get('ranker'));
					var rankdir = getRankdir(configuration.get('rankdir'));
					var align = getAlign(configuration.get('align'));
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
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				const editorText = editor.document.getText();
				if (editor.document.languageId === 'json') {
					if (panel) {
						try {
							panel.webview.postMessage({ command: 'newModel', model: JSON.parse(editorText)});
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
