import * as vscode from "vscode";

export class ModelProvider implements vscode.TextDocumentContentProvider {
    private models = "{ 'name': 'Default Models', 'models': [{'name': 'DefaultModel', 'generator': 'random(never)', 'startElementId': 'v0', 'vertices': [{'id': 'v0', 'name': 'start_vertex'},{'id': 'v1', 'name': 'state_a'}, {'id': 'v2', 'name': 'state_b'}],'edges': [{'id': 'e0', 'name': 'action_a', 'sourceVertexId': 'v0', 'targetVertexId': 'v1'},{'id': 'e1','name': 'action_b','sourceVertexId': 'v0','targetVertexId': 'v2'}]}]}";

    public provideTextDocumentContent() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            if (editor.document.languageId !== "json"){
                return `
                    <body>
                        <h3>Active editor does not show a json document.<h3>
                    <body>`;
            } else {
                this.models = editor.document.getText();
            }
        }
        return `<!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="UTF-8" />
                            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
                            <title>ModelVisualizer</title>
                            <!-- ModelVisualizer CSS -->
                            <link rel="stylesheet" href="https://altom.gitlab.io/altwalker/model-visualizer/build/model-visualizer.css">
                            <style>
                            .error {
                                position: fixed;
                                background-color: #e2e8f0;
                                top:0;
                                width:100%;
                                height: 100px;
                                color: red;
                                border-bottom: 5px solid #f56565;
                            }
                            .error h1 {
                                height: 50px;
                                color: #742a2a;
                                padding-left: 20px;
                                padding-top: 20px;
                                font-size: 2vh;
                                margin: 0;
                            }
                            .error p {
                                color: #742a2a;
                                padding-left: 20px;
                                margin-top: -10px;
                                font-size: 1.5vh;
                                white-space: nowrap;
                            }
                            body {
                                height: 100vh;
                                padding: 0;
                                margin: 0;
                                background-color: white;
                            }
                            #legend {
                                position: fixed;
                                bottom:0;
                                width:500px;
                            }
                            svg {
                                vertical-align: top;
                            }
                            </style>
                        </head>
                        <body>
                            <div id="legend"></div>
                            <div id="visualizer"></div>
                            <!-- D3, DagreD3 and D3 Legend -->
                            <script src="https://d3js.org/d3.v5.js"></script>
                            <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/dagre-d3/0.6.3/dagre-d3.min.js"></script>
                            <script src="https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.25.6/d3-legend.js"></script>
                            <!-- Vue JS -->
                            <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
                            <!-- Model-Visualizer -->
                            <script src="https://altom.gitlab.io/altwalker/model-visualizer/build/model-visualizer.js"></script>
                            <script>
                                let visualizer = null;
                                let errorDiv = null;
                                let errorTypeElement = null;
                                let errorMessageElement = null;

                                window.onload = function () {
                                    try {
                                        visualizer = new ModelVisualizer({ container: "visualizer", legendContainer: "legend", models: ${this.models}});
                                        if (errorDiv !== null) {
                                            errorDiv.remove();
                                            errorDiv = null;
                                        }
                                    } catch(error) {
                                        if (errorDiv == null) {
                                            errorDiv = document.createElement("div");
                                            errorDiv.className = 'error';
                                            errorTypeElement = document.createElement("h1");
                                            errorMessageElement = document.createElement("p");
                                            var errorType = document.createTextNode(error.name);
                                            var errorMessage = document.createTextNode(error.message);
                                            errorTypeElement.appendChild(errorType);
                                            errorMessageElement.appendChild(errorMessage);
                                            errorDiv.appendChild(errorTypeElement);
                                            errorDiv.appendChild(errorMessageElement);
                                            var visualizerDiv = document.getElementById("visualizer");
                                            document.body.insertBefore(errorDiv, visualizerDiv);
                                        } else {
                                            errorTypeElement.innerHTML = error.name;
                                            errorMessageElement.innerHTML = error.message;
                                        }
                                    }
                                };

                                window.addEventListener('resize', function () {
                                    visualizer.repaint();
                                });

                                window.addEventListener('message', event => {
                                    const message = event.data;
                                    switch (message.command) {
                                        case 'newModel':
                                            try {
                                                visualizer.setModels(message.model);
                                                if (errorDiv !== null) {
                                                    errorDiv.remove();
                                                    errorDiv = null;
                                                }
                                            } catch(error) {
                                                if (errorDiv == null) {
                                                    errorDiv = document.createElement("div");
                                                    errorDiv.className = 'error';
                                                    errorTypeElement = document.createElement("h1");
                                                    errorMessageElement = document.createElement("p");
                                                    var errorType = document.createTextNode(error.name);
                                                    var errorMessage = document.createTextNode(error.message);
                                                    errorTypeElement.appendChild(errorType);
                                                    errorMessageElement.appendChild(errorMessage);
                                                    errorDiv.appendChild(errorTypeElement);
                                                    errorDiv.appendChild(errorMessageElement);
                                                    var visualizerDiv = document.getElementById("visualizer");
                                                    document.body.insertBefore(errorDiv, visualizerDiv);
                                                } else {
                                                    errorTypeElement.innerHTML = error.name;
                                                    errorMessageElement.innerHTML = error.message;
                                                }
                                            }
                                        }
                                });
                            </script>
                        </body>
                    </html>`;
    }
}