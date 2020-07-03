# AltWalker Model Visualizer

A Visual Studio Code extension for visualizing and editing JSON models. It expects the format required by [AltWalker](https://altom.gitlab.io/altwalker/altwalker/) and [GraphWalker](http://graphwalker.github.io/).

[AltWalker](https://altom.gitlab.io/altwalker/altwalker/) is a Model-Based Testing framework that supports running tests written in python3 and .NET/C#.

[GraphWalker](http://graphwalker.github.io/) is a Model-Based testing tool. It reads models in the shape of directed graphs, and generates test paths from these graphs.

<img src=https://gitlab.com/altom/altwalker/extensions/vscode-model-visualizer/-/raw/master/images/model.png width=734 height=413>

## Get started

1. Install Visual Studio Code 1.0.0 or higher
2. Launch Code
3. From the command palette `Ctrl+Shift+P` (Windows & Linux) or `Cmd+Shift+P` (MacOS)
4. Select Install Extension
5. Type `AltWalker Model Visualizer`
6. Choose the extension
7. Reload Visual Studio Code

## Features

* `Preview on side panel (Windows & Linux: ctrl+shift+v, MacOS: cmd+shift+v)`: Easily check your [AltWalker](https://altom.gitlab.io/altwalker/altwalker/) or [GraphWalker](http://graphwalker.github.io/) models.

<img src=https://gitlab.com/altom/altwalker/extensions/vscode-model-visualizer/-/raw/master/images/start.gif width=734 height=413>

## Models Format

An example of json model can be found [here](https://gitlab.com/altom/altwalker/extensions/vscode-model-visualizer/-/blob/11-publish-extension/model.json).

For more informations you can visit [AltWalker documentation](https://altom.gitlab.io/altwalker/altwalker/) or [Graphwalker documentation](https://graphwalker.github.io/).

## Snippets

<dl>
  <dt>Ctrl+Space</dt>
    <dd>For snippets suggestions.</dd>
  <dt>actions</dt>
    <dd>Creates an action template. An action is a piece of JavaScript code executed by GraphWalker. You can place action on the model level which will be executed before any step from that model or on an edge which will be executed when an edge is reached.</dd>
  <dt>altwalker</dt>
    <dd>Creates an AltWalker models file template.</dd>
  <dt>dependency</dt>
    <dd>Creates a dependency template. Dependency field is optional, it can be used to set dependencies and use them with dependency_edge_coverage.</dd>
  <dt>edge</dt>
    <dd>Creates an edge template. An edge is an action that takes the system under tests form one state (vertex) to another.</dd>
  <dt>example</dt>
    <dd>Creates an example model with three vertices.</dd>
  <dt>generator</dt>
    <dd>Creates a generator template. A generator is an algorithm that decides how to traverse a model. Different generators will generate different test sequences, and they will navigate in different ways.</dd>
  <dt>guard</dt>
    <dd>Creates a guard template. Guard field is optional, it can be used to set a guard on this edge.</dd>
  <dt>model</dt>
    <dd>Creates a model template.</dd>
  <dt>properties</dt>
    <dd>Creates a properties template. Properties field is optional, it can be used to store pairs of key/data.</dd>
  <dt>requirements</dt>
    <dd>Creates a requirements template. Requirements field is optional, it can be used to set tags on vertices and use them with requirement_coverage.</dd>
  <dt>sharedState</dt>
    <dd>Creates a sharedState template. SharedState field is optional, it can be used to link to vertices from different models. Any vertices with the same value for sharedState are linked.</dd>
  <dt>vertex</dt>
    <dd>Creates a vertex template. A vertex is a state of the system under tests. In the test code this is the place where the actual test (asserts) takes place.<dd>
  <dt>weight</dt>
    <dd>Creates a weight template. Weight field is optional, it can be used to set weights and use them with weighted_random.<dd>
</dl>

## Support

For help with modeling you can read our guide [here](https://altom.gitlab.io/altwalker/altwalker/modeling.html).

Join our Gitter chat room [here](https://gitter.im/altwalker/community) to chat with us or with other members of the community.

## The extension uses the following libraries

* [D3](https://d3js.org/)
* [d3-legend](https://d3-legend.susielu.com/)
* [dagre-d3](https://github.com/dagrejs/dagre-d3)
* [Model-Visualizer](https://altom.gitlab.io/altwalker/model-visualizer/index.html)
* [Vue.js](https://vuejs.org/)

## License

AltWalker Model Visualizer is licensed under the [GNU](https://gitlab.com/altom/altwalker/extensions/vscode-model-visualizer/-/blob/11-publish-extension/LICENSE) General Public License v3.0.
