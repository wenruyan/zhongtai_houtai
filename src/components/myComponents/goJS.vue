<template>
  <div class="gojs overflow-hidden">
    <div id="sample">
      <div id="myDiagramDiv" style="border: solid 1px black; width:100%; height:300px"></div>
    </div>
  </div>
</template>

<script>
let go = window.go
export default {
  name: 'GoJS',
  props: ["modelData"], // accept model data as a parameter
  data: function() { return { diagram: null } }, // provide access to the GoJS Diagram
  mounted: function() {
    var $GO = go.GraphObject.make;
    var self = this;
    var myDiagram =
          $GO(go.Diagram, this.$el,
            {
              validCycle: go.Diagram.CycleNotDirected,
              // 'allowMove': false,
              "undoManager.isEnabled": true,
              // Model ChangedEvents get passed up to component users
              "ModelChanged": function(e) { self.$emit("model-changed", e); },
              "ChangedSelection": function(e) { self.$emit("changed-selection", e); }
            });
    var fieldTemplate =
        $GO(go.Panel, "TableRow", // this Panel is a row in the containing Table
          new go.Binding("portId", "id"), // this Panel is a "port"
          {
            background: "transparent", // so this port's background can be picked by the mouse
            fromSpot: go.Spot.Right, // links only go from the right side to the left side
            toSpot: go.Spot.Left,
            // allow drawing links from or to this port:
            fromLinkable: true, toLinkable: true, fromMaxLinks: 1, toMaxLinks: 1, cursor: 'pointer'
          },
          // $GO(go.Shape,
          //   { width: 12, height: 12, column: 0, strokeWidth: 2, margin: 4,
          //     // but disallow drawing links from or to this shape:
          //     fromLinkable: false, toLinkable: false },
          //   new go.Binding("figure", "figure"),
          //   new go.Binding("fill", "color")),
          $GO(go.TextBlock,
            { margin: new go.Margin(5, 5), column: 1, font: "bold 14px sans-serif", textAlign: "center", width: 200,
              alignment: go.Spot.Left,
              // and disallow drawing links from or to this text:
              fromLinkable: true, toLinkable: true, overflow: go.TextBlock.OverflowEllipsis },
            new go.Binding("text", "name"))
          // $GO(go.TextBlock,
          //   { margin: new go.Margin(5, 5), column: 2, font: "13px sans-serif", alignment: go.Spot.Left },
          //   new go.Binding("text", "info"))
        );

    myDiagram.nodeTemplate =
        $GO(go.Node, "Auto",
          { copyable: false, deletable: false },
          new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
          // this rectangular shape surrounds the content of the node
          $GO(go.Shape,
            { fill: "#EFEFEF", stroke: "white" }),
          // the content consists of a header and a list of items
          $GO(go.Panel, "Vertical",
            // this is the header for the whole node
            $GO(go.Panel, "Auto",
              { stretch: go.GraphObject.Horizontal }, // as wide as the whole node
              $GO(go.Shape,
                { fill: "#308AD9", stroke: null }),
              $GO(go.TextBlock,
                {
                  alignment: go.Spot.Center,
                  margin: 3,
                  stroke: "white",
                  textAlign: "center",
                  font: "bold 12pt sans-serif"
                },
                new go.Binding("text", "key"))),
            // this Panel holds a Panel for each item object in the itemArray;
            // each item Panel is defined by the itemTemplate to be a TableRow in this Table
            $GO(go.Panel, "Table",
              {
                padding: 2,
                minSize: new go.Size(100, 10),
                defaultStretch: go.GraphObject.Horizontal,
                // defaultRowSeparatorStrokeWidth: 0,
                // defaultRowSeparatorStroke: "gray",
                itemTemplate: fieldTemplate
              },
              new go.Binding("itemArray", "fields")
            ) // end Table Panel of items
          ) // end Vertical Panel
        ); // end Node

    myDiagram.linkTemplate =
        $GO(go.Link,
          {
            relinkableFrom: true, relinkableTo: true, // let user reconnect links
            toShortLength: 4, fromShortLength: 2
          },
          $GO(go.Shape, { strokeWidth: 1.5 }),
          $GO(go.Shape, { toArrow: "Standard", stroke: null })
        );

    this.diagram = myDiagram;

    this.updateModel(this.modelData);
  },
  watch: {
    modelData: function(val) { console.log(val); this.updateModel(val); }
  },
  methods: {
    model: function() { return this.diagram.model; },
    updateModel: function(val) {
      // No GoJS transaction permitted when replacing Diagram.model.
      if (val instanceof go.Model) {
        this.diagram.model = val;
      } else {
        var m = new go.GraphLinksModel()
        if (val) {
          for (var p in val) {
            m[p] = val[p];
          }
        }
        this.diagram.model = m;
      }
    },
    updateDiagramFromData: function() {
      this.diagram.startTransaction();
      // This is very general but very inefficient.
      // It would be better to modify the diagramData data by calling
      // Model.setDataProperty or Model.addNodeData, et al.
      this.diagram.updateAllRelationshipsFromData();
      this.diagram.updateAllTargetBindings();
      this.diagram.commitTransaction("updated");
    }
  }
}
</script>
<style lang="scss">
.gojs {
  width: 100%;
  height: 570px;
  background-color: #fff;
}
</style>
