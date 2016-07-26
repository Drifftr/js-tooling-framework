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
var Diagrams = (function (diagrams){

    var models = diagrams.models || {};

    var DiagramElement = Backbone.Model.extend(
    /** @lends DiagramElement.prototype */
    {
        /**
         * @augments DiagramElement
         * @constructs
         * @class Element represents the model for elements in a diagram.
         */
        initialize: function(attrs, options) {},

        modelName : "DiagramElement",

        nameSpace : diagrams,

        idAttribute: this.cid,

        defaults:{
        }
    });

    var Shape = DiagramElement.extend(
    /** @lends Link.prototype */
    {
        /**
         * @augments DiagramElement
         * @constructs
         * @class Link represents the model for a link between two elements in a diagrams.
         */
        initialize: function(attrs, options) {
            DiagramElement.prototype.initialize.call(this, attrs, options);
            var connectionPoints = new Backbone.Collection([], {model: ConnectionPoint, owner: this});
            this.connectionPoints = connectionPoints;
        },

        modelName : "Shape",

        nameSpace : diagrams,

        addConnectionPoint: function(cntPoints){
            if(_.isArray(cntPoints)){
                cntPoints.forEach(function(cntPoint){
                    this.addConnectionPoint(cntPoint);
               });
            }
            this.connectionPoints.add(cntPoints);
            this.trigger("connectionPointAdded", cntPoints);
        },

        defaults:{
        }
    });

    var Link = DiagramElement.extend(
    /** @lends Link.prototype */
    {
        /**
         * @augments DiagramElement
         * @constructs
         * @class Link represents the model for a link between two elements in a diagrams.
         */
        initialize: function(attrs, options) {
            DiagramElement.prototype.initialize.call(this, attrs, options);
            this.source(attrs['source']);
            this.destination(attrs['destination']);
        },

        modelName : "Link",

        nameSpace : diagrams,

        defaults:{
        },

        /**
         * Gets or sets source connectionPoint for the link.
         * @param {ConnectionPoint} [connectionPoint] Source connectionPoint
         */
        source: function(connectionPoint){
            if(connectionPoint === undefined){
                return this.get('source');
            }
            var connection = connectionPoint.connectLink(this, {type:'outgoing'});
            if(this.makeParallel()){
                connection.point().y(this.destination().point().y());
            }
            this.set('source', connection);
        },
        /**
         * Gets or sets destination connectionPoint for the link.
         * @param {ConnectionPoint} [connectionPoint] Destination connectionPoint
         */
        destination: function(connectionPoint){
            if(connectionPoint === undefined){
                return this.get('destination');
            }
            var connection = connectionPoint.connectLink(this, {type:'incoming'});
            if(this.makeParallel()){
                connection.point().y(this.source().point().y());
            }
            this.set('destination', connection);
        },
        makeParallel: function(){
            return true;
        }
    });

    var Connection =  DiagramElement.extend(
    /** @lends Connection.prototype */
    {
        /**
         * @augments DiagramElement
         * @constructs
         * @class Connection represents a connection made to a connection point owned by an element in a diagrams.
         */
        initialize: function(attrs, options) {
            DiagramElement.prototype.initialize.call(this, attrs, options);
            //this.connectionPoint().on("ownerMoved", this.onOwnerMoved, this);
        },

        modelName : "Connection",

        nameSpace : diagrams,

        onOwnerMoved: function(event){
            this.point().move(event.dx, event.dy);
            this.trigger("connectingPointChanged", this.point());
        },

        /**
         * Get or set connection type of the connection.
         * @param {String} [type] incoming or outgoing
         * @returns {String, void}
         */
        type: function(type){
            if(_.isUndefined(type)){
                return this.get('type');
            }
            this.set('type', type);
        },

        /**
         * Gets or sets the point on paper in which this connection point
         * belongs
         * @param {Point} [point]
         * @returns {Point|void}
         */
        point: function(point){
            if(_.isUndefined(point)){
                return this.get('point');
            }
            this.set('point', point)
        },

        connectionPoint: function(){
            return this.get('connectionPoint');
        },

        /**
         * Checks whether this connection is an incoming connection
         * @returns {boolean}
         */
        isIncomingConnection: function(){
            if(_.isEqual(this.type(), 'incoming')){
                return true;
            }
            return false;
        }

    });

    var ConnectionPoint =  DiagramElement.extend(
    /** @lends ConnectionPoint.prototype */
    {
        /**
         * @augments DiagramElement
         * @constructs
         * @class ConnectionPoint represents a connection point owned by an element in a diagrams.
         */
        initialize: function(attrs, options) {
            DiagramElement.prototype.initialize.call(this, attrs, options);
            this.connections = new Backbone.Collection([], {model: Connection, connectionPoint: this});
        },

        modelName : "ConnectionPoint",

        nameSpace : diagrams,

        connectLink : function(link, options){
            var connection = new Connection({type:options.type, link:link, connectionPoint: this});
            this.connections.add(connection);
            this.trigger("connectionMade", connection);
            this.owner().on("elementMoved", connection.onOwnerMoved, connection);
            return connection;
        },

        onOwnerMoved: function(event){
            this.trigger("ownerMoved", event);
        },

        /**
         * Sets or gets the instance of shape which owns this connection point
         * @param {Shape} [shape]
         * @returns {Shape|void}
         */
        owner: function(shape){
            if(_.isUndefined(shape)){
                return this.get('owner');
            }
            this.set('owner', shape);
        }

    });

    var DiagramElements = Backbone.Collection.extend(
    /** @lends DiagramElements.prototype */
    {
        /**
         * @augments Backbone.Collection
         * @constructs
         * @class DiagramElements represents the collection for elements in a diagram.
         */
        initialize: function(models, options) {},

        modelName : "DiagramElements",

        nameSpace : diagrams,

        model: DiagramElement

    });


    var Diagram = Backbone.Model.extend(
    /** @lends Diagram.prototype */
    {
        /**
         * @augments Backbone.Model
         * @constructs
         * @class Diagram represents the model for aa diagrams.
         */
        initialize: function(attrs, options) {

            var elements = new DiagramElements([],{diagram: this});
            this.diagramElements(elements);
        },

        modelName : "Diagram",

        nameSpace : diagrams,

        addElement: function(element, opts){
            this.diagramElements().add(element, opts);
            this.trigger("addElement", element, opts);
        },

        getElement: function(id){
            return this.diagramElements().get(id);
        },

        diagramElements: function(diaElements){
            if(_.isUndefined(diaElements)){
                return this.get('diagramElements');
            }else{
                this.set('diagramElements', diaElements);
            }
        }

    });

    models.DiagramElement = DiagramElement;
    models.DiagramElements = DiagramElements;
    models.Diagram = Diagram;
    models.Shape = Shape;
    models.Link = Link;
    models.Connection = Connection;
    models.ConnectionPoint = ConnectionPoint;
    diagrams.Models = models;

    return diagrams;
}(Diagrams || {}));


