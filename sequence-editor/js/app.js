/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var lifeLineOptions = {};
lifeLineOptions.class = "lifeline";
// Lifeline rectangle options
lifeLineOptions.rect = {};
lifeLineOptions.rect.width = 100;
lifeLineOptions.rect.height = 30;
lifeLineOptions.rect.roundX = 20;
lifeLineOptions.rect.roundY = 20;
lifeLineOptions.rect.class = "lifeline-rect";

// Lifeline middle-rect options
lifeLineOptions.middleRect = {};
lifeLineOptions.middleRect.width = 100;
lifeLineOptions.middleRect.height = 500;
lifeLineOptions.middleRect.roundX = 1;
lifeLineOptions.middleRect.roundY = 1;
lifeLineOptions.middleRect.class = "lifeline-middleRect";

// Lifeline options
lifeLineOptions.line = {};
lifeLineOptions.line.height = 500;
lifeLineOptions.line.class = "lifeline-line";
// Lifeline text options
lifeLineOptions.text = {};
lifeLineOptions.text.class = "lifeline-title";

var createPoint = function (x, y) {
    return new GeoCore.Models.Point({ 'x': x, 'y': y });
};

var createLifeLine = function (title, center) {
    return new SequenceD.Models.LifeLine({ title: title, centerPoint: center });
};

var createFixedSizedMediator = function (title, center) {
    return new SequenceD.Models.FixedSizedMediator({ title: title, centerPoint: center });
};

var createMessage = function (start, end) {
    return new SequenceD.Models.Message({ source: start, destination: end });
};

// Create tool palette elements
var lifeline = new Tools.Models.Tool({
	toolId: "tool1",
	toolImage: "images/icon1.png"
});

var log_mediator = new Tools.Models.Tool({
	toolId: "log-mediator",
	toolImage: "images/icon2.png"
});

// Create tool group
var group = new Tools.Models.ToolGroup();
group.add(lifeline);
group.add(log_mediator);
var toolGroupWrapper = new Tools.Models.ToolGroupWrapper({ toolGroupName: "Sequence Diagrams",  toolGroupID: "SequenceDiagrams", toolGroup: group });

// Create tool palette
var toolPalette = new Tools.Models.ToolPalatte();
toolPalette.add(toolGroupWrapper);
var paletteView = new Tools.Views.ToolPalatteView({ collection: toolPalette });
paletteView.render();

// Create the model for the diagram
var diagram = new Diagrams.Models.Diagram({});

// Create the diagram view
var diagramOptions = { selector: '.editor' };
var diagramView = new Diagrams.Views.DiagramView({ model: diagram, options: diagramOptions });
diagramView.render();

// var lifeline1 = createLifeLine("LifeLine1",createPoint(250, 50));
// diagram.addElement(lifeline1, lifeLineOptions);
// var lifeline2 = createLifeLine("LifeLine2",createPoint(500, 50));
// diagram.addElement(lifeline2, lifeLineOptions);
// var lifeline3 = createLifeLine("LifeLine3",createPoint(750, 50));
// diagram.addElement(lifeline3, lifeLineOptions);

// var lf1Activation1 = new SequenceD.Models.Activation({owner:lifeline1});
// var lf2Activation1 = new SequenceD.Models.Activation({owner:lifeline2});
// var lf3Activation1 = new SequenceD.Models.Activation({owner:lifeline3});

// var messageOptions = {'class':'message'};
// var msg1 = new SequenceD.Models.Message({source: lf1Activation1, destination: lf3Activation1});
// diagram.addElement(msg1, messageOptions);
// var msg2 = new SequenceD.Models.Message({source: lf2Activation1, destination: lf3Activation1});
// diagram.addElement(msg2, messageOptions);
// var msg3 = new SequenceD.Models.Message({source: lf3Activation1, destination: lf1Activation1});
// diagram.addElement(msg3, messageOptions);
// var msg4 = new SequenceD.Models.Message({source: lf3Activation1, destination: lf2Activation1});
// diagram.addElement(msg4, messageOptions);
// var msg5 = new SequenceD.Models.Message({source: lf3Activation1, destination: lf1Activation1});
// diagram.addElement(msg5, messageOptions);
selected ="";
selectedModel="";

$("#delete-image").click(function(){
    console.log("deleted");
    var deletebutton = $('#deletebutton'); //get the needed div
    deletebutton.removeClass("visible-button");
    deletebutton.addClass("hidden-button");
    if (selectedModel) {
      diagram.removeElement(selectedModel);
    }
});

$("#edit-image").click(function(){
    alert("Edit properties");
});
