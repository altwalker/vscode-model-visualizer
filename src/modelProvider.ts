import * as vscode from "vscode";
import * as path from 'path';
import { type } from "os";


export class ModelProvider implements vscode.TextDocumentContentProvider {
    private models = "";
    private errorMessage = "";
    private errorName = "";
    private rankdirMap = {
        "Top-Bottom": "TB",
        "Bottom-Top": "BT",
        "Left-Right": "LR",
        "Right-Left": "RL",
    };
    private alignMap = {
        "Up-Left": "UL",
        "Up-Right": "UR",
        "Down-Left": "DL",
        "Down-Right": "DR"
    };
    private rankerMap = {
        "Longest Path": "longest-path",
        "Tight Tree": "tight-tree",
        "Network Simplex": "network-simplex"
    };

    private resetErrors() {
        this.errorMessage = "";
        this.errorName = "";
    }

    private hasKey<O>(obj: O, key: keyof any): key is keyof O {
        return key in obj;
    }

    public getRankdir(rankdir: any) {
        if (this.hasKey(this.rankdirMap, rankdir)) {
            return this.rankdirMap[rankdir];
        }
        return this.rankdirMap["Top-Bottom"];
    }

    public getAlign(align: any) {
        if (this.hasKey(this.alignMap, align)) {
            return this.alignMap[align];
        }
        return this.alignMap["Up-Left"];
    }

    public getRanker(ranker: any) {
        if (this.hasKey(this.rankerMap, ranker)) {
            return this.rankerMap[ranker];
        }
        return this.rankerMap["Network Simplex"];
    }

    public provideTextDocumentContent(extensionUri: vscode.Uri) {
        const editor = vscode.window.activeTextEditor;

        const d3LibraryPath = extensionUri.toString() + path.sep + 'node_modules' + path.sep + 'd3' + path.sep + 'dist' + path.sep + 'd3.js';
        const dagreD3LibrabryPath = extensionUri.toString() + path.sep + 'node_modules' + path.sep + 'dagre-d3' + path.sep + 'dist' + path.sep + 'dagre-d3.js';
        const vueLibraryPath = extensionUri.toString() + path.sep + 'node_modules' + path.sep + 'vue' + path.sep + 'dist' + path.sep + 'vue.js';
        const d3LegendLibraryPath = extensionUri.toString() + path.sep + 'node_modules' + path.sep + 'd3-svg-legend' + path.sep + 'd3-legend.js';

        const configuration = vscode.workspace.getConfiguration('altwalker.layout');
        const layoutRankdir = this.getRankdir(configuration.get('rankdir'));
        const layoutAlign = this.getAlign(configuration.get('align'));
        const layoutRanker = this.getRanker(configuration.get('ranker'));
        const layoutNodsep = configuration.get('nodesep');
        const layoutEdgesep = configuration.get('edgesep');
        const layoutRanksep = configuration.get('ranksep');
        const layoutMarginx = configuration.get('marginx');
        const layoutMarginy = configuration.get('marginy');
        const layoutLegend = configuration.get('legend');

        if (editor) {
            try {
                this.models = editor.document.getText();
            } catch (error) {
                this.errorMessage = error.message.toString();
                this.errorName = error.name.toString();
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
                            .hide {
                                display: none;
                            }
                            </style>
                        </head>
                        <body>
                            <div id="legend"></div>
                            <div id="visualizer"></div>
                            <!-- D3 -->
                            <script src=${d3LibraryPath}></script>
                            <!-- DagreD3 -->
                            <script src=${dagreD3LibrabryPath}></script>
                            <!-- D3 Legend -->
                            <script src=${d3LegendLibraryPath}></script>
                            <!-- Vue JS -->
                            <script src=${vueLibraryPath}></script>
                            <!-- Model-Visualizer -->
                            <script src="https://altom.gitlab.io/altwalker/model-visualizer/build/model-visualizer.js"></script>
                            <script>
                                let visualizer = null;
                                let errorDiv = null;
                                let errorTypeElement = null;
                                let errorMessageElement = null;
                                let showLegend = ${layoutLegend};

                                function createErrorDiv(errorName, errorMessage) {
                                    if (errorDiv == null) {
                                        errorDiv = document.createElement("div");
                                        errorDiv.className = 'error';
                                        errorTypeElement = document.createElement("h1");
                                        errorMessageElement = document.createElement("p");
                                        var errorType = document.createTextNode(errorName);
                                        var errorMessage = document.createTextNode(errorMessage);
                                        errorTypeElement.appendChild(errorType);
                                        errorMessageElement.appendChild(errorMessage);
                                        errorDiv.appendChild(errorTypeElement);
                                        errorDiv.appendChild(errorMessageElement);
                                        var visualizerDiv = document.getElementById("visualizer");
                                        document.body.insertBefore(errorDiv, visualizerDiv);
                                    } else {
                                        errorTypeElement.innerHTML = errorName;
                                        errorMessageElement.innerHTML = errorMessage;
                                    }
                                }

                                window.onload = function () {
                                    try {
                                        if (errorDiv !== null) {
                                            errorDiv.remove();
                                            errorDiv = null;
                                        } else if ("${this.errorMessage}" === "") {
                                            if (${layoutLegend}) {
                                                visualizer = new ModelVisualizer({ container: "visualizer", legendContainer: "legend", models: ${this.models},
                                                                                   graphLayoutOptions: {rankdir: "${layoutRankdir}", align: "${layoutAlign}",
                                                                                   nodesep: "${layoutNodsep}", edgesep: "${layoutEdgesep}", ranksep: "${layoutRanksep}",
                                                                                   marginx: "${layoutMarginx}", marginy: "${layoutMarginy}", ranker: "${layoutRanker}"}});
                                            } else {
                                                visualizer = new ModelVisualizer({ container: "visualizer", models: ${this.models},
                                                                                   graphLayoutOptions: {rankdir: "${layoutRankdir}", align: "${layoutAlign}",
                                                                                   nodesep: "${layoutNodsep}", edgesep: "${layoutEdgesep}", ranksep: "${layoutRanksep}",
                                                                                   marginx: "${layoutMarginx}", marginy: "${layoutMarginy}", ranker: "${layoutRanker}"}});
                                            }
                                        } else {
                                            createErrorDiv("${this.errorName}", "${this.errorMessage}")
                                        }
                                    } catch(error) {
                                        createErrorDiv(error.name, error.message);
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
                                                ${this.resetErrors()};
                                                if (errorDiv !== null) {
                                                    errorDiv.remove();
                                                    errorDiv = null;
                                                }
                                                if (visualizer === null) {
                                                    visualizer = new ModelVisualizer({ container: "visualizer", legendContainer: "legend", models: message.model});
                                                } else {
                                                    visualizer.setModels(message.model);
                                                }
                                            } catch(error) {
                                                createErrorDiv(error.name, error.message);
                                            }
                                            break;
                                        case 'newConfiguration':
                                            try {
                                                if (showLegend != message.configuration.legend) {
                                                    if (message.configuration.legend) {
                                                        legendDiv = document.getElementById("legend");
                                                        legendDiv.classList.remove("hide");
                                                    } else {
                                                        legendDiv = document.getElementById("legend");
                                                        legendDiv.className = 'hide';
                                                    }
                                                }
                                                showLegend = message.configuration.legend;
                                                visualizer.setGraphLayoutOptions(message.configuration);
                                            } catch(error) {
                                                createErrorDiv(error.name, error.message);
                                            }
                                            break;
                                        case 'error':
                                            createErrorDiv(message.errorName, message.errorMessage);
                                            break;
                                        }
                                });
                            </script>
                        </body>
                    </html>`;
    }
}