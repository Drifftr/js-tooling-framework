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

var SequenceD = (function (sequenced) {
    var models = sequenced.Models = {};





////


    var FixedSizedMediator = Diagrams.Models.Shape.extend(
        /** @lends DiagramElement.prototype */
        {

            selectedNode : null,
            /**
             * @augments DiagramElement
             * @constructs
             * @class Element represents the model for elements in a diagram.
             */
            initialize: function (attrs, options) {
            Diagrams.Models.Shape.prototype.initialize.call(this, attrs, options);
            },

            modelName: "FixedSizedMediator",

            nameSpace: sequenced,

            idAttribute: this.cid,

                        defaults: {
                            centerPoint: new GeoCore.Models.Point({ x: 0, y: 0 }),
                            title: "Mediator"
                        },
        });



            var FixedSizedMediators = Backbone.Collection.extend(
                /** @lends DiagramElements.prototype */
                {
                    /**
                     * @augments Backbone.Collection
                     * @constructs
                     * @class DiagramElements represents the collection for elements in a diagram.
                     */
                    initialize: function (models, options) { },

                    modelName: "FixedSizedMediators",

                    nameSpace: sequenced,

                    model: FixedSizedMediator

                });


////


    var LifeLine = Diagrams.Models.Shape.extend(
        /** @lends LifeLine.prototype */
        {
            /**
             * @augments Element
             * @constructs
             * @class LifeLine Represents the model for a LifeLine in Sequence Diagrams.
             */
            initialize: function (attrs, options) {
                Diagrams.Models.Shape.prototype.initialize.call(this, attrs, options);

//var elements = new DiagramElements([], { diagram: this });

var elements = new FixedSizedMediators([], { diagram: this });

                var fixedSizedMediators = new FixedSizedMediators([], { diagram: this });
                this.fixedSizedMediators(fixedSizedMediators);


            },

            modelName: "LifeLine",

            nameSpace: sequenced,

            defaults: {
                centerPoint: new GeoCore.Models.Point({ x: 0, y: 0 }),
                title: "lifeline"
            },

            createActivation: function (opts) {
                var activation = new SequenceD.Models.Activation({ owner: this }, opts);
                this.addConnectionPoint(activation);
                return activation;
            },

            createPoint: function(x, y){
                return new GeoCore.Models.Point({'x': x, 'y': y});
            },

            createLifeLine: function(title, center){
                return new SequenceD.Models.LifeLine({title:title, centerPoint: center});
            },

            createFixedSizedMediator: function(title, center){
                return new SequenceD.Models.FixedSizedMediator({title:title, centerPoint: center});
            },

            addFixedSizedMediator: function (element, opts) {
                            this.fixedSizedMediators().add(element, opts);
                            this.trigger("addFixedSizedMediator", element, opts);

            },

            fixedSizedMediators: function (fixedSizedMediators) {
                            if (_.isUndefined(fixedSizedMediators)) {
                                return this.get('fixedSizedMediators');
                                //console.log("fixedSizedMediators is undefined");
                            } else {
                                this.set('fixedSizedMediators', fixedSizedMediators);
                            }
            },


        });

    var Activation = Diagrams.Models.ConnectionPoint.extend(
        /** @lends Activation.prototype */
        {
            /**
             * @augments ConnectionPoint
             * @constructs
             * @class Activation Represents the model for an activation in Sequence Diagrams.
             */
            initialize: function (attrs, options) {
                Diagrams.Models.ConnectionPoint.prototype.initialize.call(this, attrs, options);
                this.owner().addConnectionPoint(this);
            },

            modelName: "Activation",

            nameSpace: sequenced

        });

    var Message = Diagrams.Models.Link.extend(
        /** @lends Message.prototype */
        {
            /**
             * @augments Link
             * @constructs
             * @class Message Represents the model for a Message in Sequence Diagrams.
             */
            initialize: function (attrs, options) {
                Diagrams.Models.Link.prototype.initialize.call(this, attrs, options);
            },

            modelName: "Message",

            nameSpace: sequenced,

            defaults: {
            },

            source: function (ConnectionPoint, x, y) {
                return Diagrams.Models.Link.prototype.source.call(this, ConnectionPoint,x, y);
            },

            destination: function (ConnectionPoint, x, y) {
                return Diagrams.Models.Link.prototype.destination.call(this, ConnectionPoint, x, y);
            },

            makeParallel: function () {
                return false;
            }
        });


        var FixedSizedMediatorsX = Backbone.Collection.extend({


            initialize: function (models, options) { },

            modelName: "FixedSizedMediator",

            nameSpace: sequenced,

            model: FixedSizedMediator

        });

            var FixedSizedMediatorX = Diagrams.Models.Shape.extend(
                    /** @lends FixedSizedMediator.prototype */
                    {
                        /**
                         * @augments Element
                         * @constructs
                         * @class FixedSizedMediator Represents the model for a FixedSizedMediator in Sequence Diagrams.
                         */
                        initialize: function (attrs, options) {
                            Diagrams.Models.Shape.prototype.initialize.call(this, attrs, options);
                        },

                        modelName: "FixedSizedMediator",

                        nameSpace: sequenced,

                        defaults: {
                            centerPoint: new GeoCore.Models.Point({ x: 0, y: 0 }),
                            title: "Mediator"
                        },

                                    idAttribute: this.cid



                        /**createActivation: function (opts) {
                            var activation = new SequenceD.Models.Activation({ owner: this }, opts);
                            this.addConnectionPoint(activation);
                            return activation;
                        }*/
                    });

    // set models
    models.Activation = Activation;
    models.Message = Message;
    models.LifeLine = LifeLine;
    models.FixedSizedMediator = FixedSizedMediator;
    models.FixedSizedMediators = FixedSizedMediators;

    sequenced.Models = models;

    return sequenced;

} (SequenceD || {}));